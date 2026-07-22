import type { INpc } from "#src/interfaces/entities/INpc.ts";

export class Marker {
  private readonly marker: any;

  constructor(leaflet: any, map: any, npc: INpc) {
    this.marker = this.render(leaflet, map, npc);
  }

  private render(leaflet: any, map: any, npc: INpc): any {
    if (!leaflet) {
      console.error("Leaflet library is not loaded.");
      return undefined;
    }
    var lockOverlay =
      !npc.done && !npc.accessible
        ? '<div class="quest-locked-overlay">🔒</div>'
        : "";

    var iconInner = "<img src='" + npc.portrait + "' alt='" + npc.name + "' />";

    const icon = leaflet.divIcon({
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

    return leaflet.marker([npc.lattitude, npc.longitude], { icon }).addTo(map);
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
}
