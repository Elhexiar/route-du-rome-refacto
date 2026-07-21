import argparse
import math
import shutil
import sys
import urllib.request
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description="Download PNG tiles from an OSM-style tile server")
    parser.add_argument("--maxZoom", type=int, required=True)
    parser.add_argument("--minZoom", type=int, required=True)
    parser.add_argument("--xWidth", type=int, required=True)
    parser.add_argument("--yWidth", type=int, required=True)
    parser.add_argument("--importPath", type=str, required=True)
    parser.add_argument("--outputPath", type=str, required=True)
    parser.add_argument("--lat", type=float)
    parser.add_argument("--lng", type=float)
    parser.add_argument("--tileRange", type=int, default=1)
    return parser.parse_args()


def lat_lng_to_tile(lat, lng, zoom):
    lat_rad = math.radians(lat)
    n = 2.0**zoom
    x = int((lng + 180.0) / 360.0 * n)
    y = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return x, y


def import_tiles(max_zoom, min_zoom, x_width, y_width, import_path, output_path, lat=None, lng=None, tile_range=1):
    output_root = Path(output_path).resolve()
    template = import_path.strip().lstrip("./")
    template = template.rstrip("/")

    if not template.startswith(("http://", "https://")):
        raise ValueError(f"importPath must be an HTTP(S) URL, got: {import_path}")

    print(f"Tile template: {template}")
    print(f"Output root: {output_root}")

    output_root.mkdir(parents=True, exist_ok=True)

    copied = 0
    skipped = 0
    failed = 0

    for zoom in range(min_zoom, max_zoom + 1):
        if lat is not None and lng is not None:
            center_x, center_y = lat_lng_to_tile(lat, lng, zoom)
            start_x = max(0, center_x - tile_range)
            end_x = center_x + tile_range
            start_y = max(0, center_y - tile_range)
            end_y = center_y + tile_range
            x_values = range(start_x, end_x + 1)
            y_values = range(start_y, end_y + 1)
        else:
            x_values = range(x_width)
            y_values = range(y_width)

        for x in x_values:
            for y in y_values:
                tile_url = f"{template}/{zoom}/{x}/{y}.png"
                destination_file = output_root / str(zoom) / str(x) / f"{y}.png"

                try:
                    destination_file.parent.mkdir(parents=True, exist_ok=True)
                    with urllib.request.urlopen(tile_url, timeout=10) as response:
                        if response.status != 200:
                            skipped += 1
                            continue
                        with destination_file.open("wb") as out_file:
                            shutil.copyfileobj(response, out_file)
                    copied += 1
                    print(f"Imported {tile_url} -> {destination_file}")
                except Exception as exc:
                    failed += 1
                    print(f"FAILED {tile_url} -> {exc}", file=sys.stderr)

    print(f"Tile import completed. Copied: {copied}, skipped: {skipped}, failed: {failed}")


if __name__ == "__main__":
    try:
        args = parse_args()
        import_tiles(
            args.maxZoom,
            args.minZoom,
            args.xWidth,
            args.yWidth,
            args.importPath,
            args.outputPath,
            lat=args.lat,
            lng=args.lng,
            tile_range=args.tileRange,
        )
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
