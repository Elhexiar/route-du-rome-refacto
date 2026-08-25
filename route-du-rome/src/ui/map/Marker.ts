import { GameManager } from "#src/controllers/GameManager.ts";
import type { IHero } from "#src/interfaces/entities/index.ts";
import type { INpc } from "#src/interfaces/entities/INpc.ts";

export class Marker {
  private readonly marker: any;

  npc?: INpc;
  hero?: IHero;

  constructor(leaflet: any, map: any, npc?: INpc, hero?: IHero) {
    this.npc = npc;
    this.hero = hero;
    this.marker = this.render(leaflet, map, npc, hero);
  }

  private render(leaflet: any, map: any, npc?: INpc, hero?: IHero): any {
    if (!leaflet) {
      console.error("Leaflet library is not loaded.");
      return undefined;
    }

    if (npc) {
      var lockOverlay =
        !npc.done && !npc.accessible
          ? '<div class="quest-locked-overlay">🔒</div>'
          : "";

      var iconInner =
        "<img src='" + npc.portrait + "' alt='" + npc.name + "' />";

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

      const m = leaflet
        .marker([npc.lattitude, npc.longitude], { icon })
        .addTo(map);

      // prevent marker clicks from propagating to the map
      if (leaflet && leaflet.DomEvent) {
        m.on("click", (e: any) => {
          leaflet.DomEvent.stopPropagation(e);
        });
      }

      return m;
    }

    if (hero) {
      var iconInner =
        "<img src='" + hero.portrait + "' alt='" + hero.name + "' />";

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
      const initialPosition = GameManager.heroController?.position;

      const m = leaflet
        .marker(
          [initialPosition?.lattitude ?? 0, initialPosition?.longitude ?? 0],
          { icon },
        )
        .addTo(map);

      if (leaflet && leaflet.DomEvent) {
        m.on("click", (e: any) => {
          leaflet.DomEvent.stopPropagation(e);
        });
      }

      return m;
    }
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
    if (!this.marker) {
      return;
    }
    // updates the marker's icon based on the current state of the NPC or Hero
    const icon = this.marker.getIcon();

    // Query the DOM for the marker's icon element
    const markerEl = document.querySelector(
      ".leaflet-marker-icon, .map-marker",
    );

    if (markerEl) {
      // Update the icon's HTML content based on the current state of the NPC or Hero
      if (this.npc) {
        const lockOverlay =
          !this.npc.done && !this.npc.accessible
            ? '<div class="quest-locked-overlay">🔒</div>'
            : "";
      }
    }
  }
}
