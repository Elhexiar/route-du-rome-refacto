import type { IMapView } from "#IUI/IMapView";
import { Npc } from "#src/entities/Npc.ts";
import type { INpc } from "#src/interfaces/entities/INpc.ts";
import { Marker } from "./Marker";

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

  private async initMap(): Promise<void> {
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
        // minZoom: 11,
        maxZoom: 13,
        zoomControl: true,
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

    // Test : Add a few markers for testing purposes

    type dataNpc = {
      id: string;
      name: string;
      color: string;
      job: string;
      icon: string;
      portrait: string;
      lattitude: number;
      longitude: number;
    };

    type Config = {
      Npcs: dataNpc[];
    };

    const response = await fetch("/config.json");
    const data: Config = await response.json();

    data.Npcs.forEach((npcData) => {
      const npc: Npc = new Npc(
        npcData.id,
        npcData.name,
        npcData.color,
        npcData.job,
        npcData.icon,
        npcData.portrait,
        npcData.lattitude,
        npcData.longitude,
        "",
        null,
        [],
      );

      this.addMarker(npc.lattitude, npc.longitude, npc);
      this.onMarkerClick(npc, () => {
        console.log(`Marker clicked: ${npc.name}`);
      });
    });

    // const testNPC1: Npc = new Npc(
    //   "jeanne",
    //   "Jeanne",
    //   "#ff0000",
    //   "Mécanicienne",
    //   "🔩",
    //   "/portraits/JeannePP.png",
    //   48.424580002157796,
    //   -1.7402379516237536,
    //   "",
    //   null,
    //   [],
    // );
    // const testNPC2: Npc = new Npc(
    //   "manu",
    //   "Manu",
    //   "#00ff00",
    //   "Guide touristique",
    //   "🗺️",
    //   "/portraits/ManuPP.png",
    //   48.583,
    //   -1.9,
    //   "",
    //   null,
    //   [],
    // );

    // this.addMarker(testNPC1.lattitude, testNPC1.longitude, testNPC1);
    // this.onMarkerClick(testNPC1, () => {
    //   console.log(`Marker clicked: ${testNPC1.name}`);
    // });
    // this.addMarker(testNPC2.lattitude, testNPC2.longitude, testNPC2);
    // this.onMarkerClick(testNPC2, () => {
    //   console.log(`Marker clicked: ${testNPC2.name}`);
    // });
  }

  addMarker(lat: number, lng: number, npc: INpc): Marker | undefined {
    if (!this.map) {
      console.error("Map is not initialized.");
      return;
    }

    const marker = new Marker(this.leaflet, this.map, npc);
    this.markers.set(npc, marker);
    return marker;
  }

  removeMarker(npc: INpc): void {
    const marker = this.markers.get(npc);

    if (!marker) {
      return;
    }

    marker.remove();
    this.markers.delete(npc);
  }

  onMarkerClick(npc: INpc, callback: () => void): void {
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
