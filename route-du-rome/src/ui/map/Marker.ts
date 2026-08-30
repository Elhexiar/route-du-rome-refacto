import type { INpc } from "#src/interfaces/entities/INpc.ts";
import type { IHero } from "#src/interfaces/entities/index.ts";
import type { IHeroController } from "#IControllers/index.ts";

export class Marker {
  private readonly marker: any;
  private readonly leaflet: any;
  private readonly runtime: {
    heroController?: IHeroController | null;
  };

  npc?: INpc;
  hero?: IHero;

  constructor(
    leaflet: any,
    map: any,
    npc?: INpc,
    hero?: IHero,
    runtime: { heroController?: IHeroController | null } = {},
  ) {
    this.npc = npc;
    this.hero = hero;
    this.leaflet = leaflet;
    this.runtime = runtime;
    this.marker = this.render(leaflet, map, npc, hero);
  }

  private render(leaflet: any, map: any, npc?: INpc, hero?: IHero): any {
    if (!leaflet) {
      console.error("Leaflet library is not loaded.");
      return undefined;
    }

    if (npc) {
      const icon = this.createNpcIcon(leaflet, npc);

      const m = leaflet
        .marker([npc.latitude, npc.longitude], { icon })
        .addTo(map);

      // prevent marker clicks from propagating to the map
      if (leaflet?.DomEvent) {
        m.on("click", (e: any) => {
          leaflet.DomEvent.stopPropagation(e);
        });
      }

      return m;
    }

    if (hero) {
      const icon = leaflet.divIcon({
        className: "leaflet-marker-icon map-marker map-marker--npc",

        html:
          '<div class="player-wrap">' +
          '<img id="pm-portrait" class="player-portrait" src="' +
          hero.portrait +
          '">' +
          '<div id="pm-name" class="player-lbl">' +
          hero.name +
          "</div>" +
          "</div>",
        iconSize: [90, 110],
        iconAnchor: [45, 104],
      });

      console.log(icon);
      const initialPosition = this.runtime.heroController?.position;

      const m = leaflet
        .marker(
          [initialPosition?.latitude ?? 0, initialPosition?.longitude ?? 0],
          { icon },
        )
        .addTo(map);

      if (leaflet?.DomEvent) {
        m.on("click", (e: any) => {
          leaflet.DomEvent.stopPropagation(e);
        });
      }

      return m;
    }
  }

  private createNpcIcon(leaflet: any, npc: INpc): any {
    const lockOverlay =
      !npc.done && !npc.accessible
        ? '<div class="quest-locked-overlay">🔒</div>'
        : "";
    const iconInner =
      "<img src='" + npc.portrait + "' alt='" + npc.name + "' />";

    return leaflet.divIcon({
      className: "leaflet-marker-icon map-marker map-marker--npc",
      html:
        '<div class="npc-wrap" style="position:relative;">' +
        '<div class="npc-icon' +
        (npc.done ? " done" : "") +
        '" style="border-color:' +
        npc.color +
        ';position:relative;">' +
        iconInner +
        lockOverlay +
        "</div>" +
        '<div class="npc-sector-badge" style="background:' +
        npc.color +
        ';">' +
        npc.icon +
        " " +
        npc.name +
        "</div>" +
        '<div class="npc-lbl">' +
        npc.name +
        (npc.done ? " ✓" : "") +
        "</div>" +
        "</div>",
      iconSize: [120, 130],
      iconAnchor: [60, 125],
    });
  }

  setLatLng(latlng: [number, number]): void {
    if (!this.marker) return;
    if (typeof this.marker.setLatLng === "function") {
      this.marker.setLatLng(latlng);
    }
  }

  onClick(callback: () => void): void {
    if (!this.marker) {
      return;
    }

    this.marker.on("click", callback);
  }

  remove(): void {
    if (!this.marker) {
      return;
    }

    this.marker.remove();
  }

  UpdateMarker(): void {
    if (!this.marker || !this.npc) {
      return;
    }

    this.marker.setIcon(this.createNpcIcon(this.leaflet, this.npc));
  }
}
