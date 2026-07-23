import type { IMapView } from "#IUI/IMapView";
import { Npc } from "#src/entities/Npc.ts";
import type { INpc } from "#src/interfaces/entities/INpc.ts";
import { Marker } from "./Marker";
import type { NpcData } from "#Entities/Npc.ts";
import type { ConfigData } from "#Entities/Config.ts";
import { GameManager } from "#Controllers/GameManager.ts";
import type { NpcController } from "#Controllers/NpcController.ts";

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

  leaflet: any = null;

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

    // Assign the Leaflet library to the class property
    this.leaflet = (window as Window & { L?: unknown }).L;

    // Check if Leaflet is loaded if not, load it dynamically
    if (!this.leaflet) {
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

    // Define the bounds for the map (top-left and bottom-right coordinates)
    const topLeftBound = [49, -3];
    const bottomRightBound = [48, -0.9];
    const bounds = (this.leaflet as any).latLngBounds(
      topLeftBound,
      bottomRightBound,
    );

    // Initialize the map with the specified bounds and zoom levels
    const map = (this.leaflet as any)
      .map(mapContainer, {
        minZoom: 11,
        maxZoom: 13,
        zoomControl: true,
        maxBounds: bounds,
        maxBoundsViscosity: 0.8,
      })
      .setView([48.58, -1.96], 11);

    // Add the tile layer to the map
    (this.leaflet as any)
      .tileLayer("/tiles/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 13,
      })
      .addTo(map);

    this.map = map;

    // console.log("Map initialized");
    // GameManager.npcController?.onNpcsLoaded((npcs) => {
    //   npcs.forEach((npc) => {
    //     this.addNPCMarker(npc.lattitude, npc.longitude, npc);
    //   });
    // });
  }

  addNPCMarker(lat: number, lng: number, npc: INpc): Marker | undefined {
    if (!this.map) {
      console.error("Map is not initialized.");
      return;
    }

    const marker = new Marker(this.leaflet, this.map, npc);
    this.markers.set(npc, marker);
    return marker;
  }

  moveNPCMarker(npc: INpc, newLat: number, newLng: number): void {
    const marker = this.markers.get(npc);

    if (!marker) {
      return;
    }

    marker.setLatLng([newLat, newLng]);
  }

  removeNPCMarker(npc: INpc): void {
    const marker = this.markers.get(npc);

    if (!marker) {
      return;
    }

    marker.remove();
    this.markers.delete(npc);
  }

  addHeroMarker(lat: number, lng: number, hero: any): Marker | undefined {
    if (!this.map) {
      console.error("Map is not initialized.");
      return;
    }

    const marker = new Marker(this.leaflet, this.map, undefined, hero);
    this.markers.set(hero, marker);
    return marker;
  }

  moveHeroMarker(hero: any, newLat: number, newLng: number): void {}

  removeHeroMarker(hero: any): void {}

  onNPcMarkerClick(npc: INpc, callback: () => void): void {
    const marker = this.markers.get(npc);

    if (!marker) {
      return;
    }

    marker.onClick(callback);
  }

  setView(lat: number, lng: number, zoom: number): void {
    if (this.map) {
      this.map.setView([lat, lng], zoom);
    }
  }
}
