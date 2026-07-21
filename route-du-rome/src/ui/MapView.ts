import type { IMapView } from "#IUI/IMapView";
import type { INpc } from "#src/interfaces/entities/INpc.ts";

export class LeafletMapView implements IMapView {
  private readonly element: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement("section");
    this.element.className = "map-view";
    this.element.style.width = "100%";
    this.element.style.minHeight = "500px";
    this.element.style.height = "100%";
    container.appendChild(this.element);
    this.render();
  }

  // type cannot be enforced because leaflet lib is in js
  map: any = null;

  markers: Map<INpc, any> = new Map<INpc, any>();

  private render(): void {
    this.element.innerHTML = `
      <div class="map-view__body" style="width: 100%; height: 100%;">
        <div id="map" style="width: 100%; height: 100%; min-height: 500px;"></div>
      </div>
    `;

    this.initMap();
  }

  private initMap(): void {
    const mapContainer = this.element.querySelector("#map");

    if (!mapContainer) {
      return;
    }

    const leaflet = (window as Window & { L?: unknown }).L;

    if (!leaflet) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/src/lib/leaflet/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "/src/lib/leaflet/leaflet.js";
      script.onload = () => this.initMap();
      document.head.appendChild(script);
      return;
    }

    const map = (leaflet as any)
      .map(mapContainer)
      .setView([48.65623516497951, -3.6942922928437985], 10);

    (leaflet as any)
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 13,
      })
      .addTo(map);

    this.map = map;
  }

  addMarker(lat: number, lng: number, npc: INpc): void {}

  removeMarker(npc: INpc): void {}

  onMarkerClick(npc: INpc, callback: () => void): void {}

  setView(lat: number, lng: number, zoom: number): void {
    if (this.map) {
      this.map.setView([lat, lng], zoom);
    }
  }
}
