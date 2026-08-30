import type { IMapView } from "#IUI/IMapView";
import type { INpc } from "#src/interfaces/entities/INpc.ts";
import type { IHeroController } from "#IControllers/index.ts";
import { Marker } from "./Marker";
import { GameManager } from "#src/controllers/GameManager.ts";

export class LeafletMapView implements IMapView {
  private readonly element: HTMLElement;
  private readonly runtime: {
    heroController?: IHeroController | null;
  };

  constructor(
    container: HTMLElement,
    runtime: { heroController?: IHeroController | null } | null = null,
  ) {
    this.element = document.createElement("section");
    this.element.className = "map-view";
    this.element.style.width = "100%";
    this.element.style.height = "auto";
    this.element.style.flexGrow = "1";
    container.appendChild(this.element);
    this.runtime = runtime ?? {
      heroController: GameManager.heroController,
    };
    this.render();
  }

  // type cannot be enforced because leaflet lib is in js
  map: any = null;

  leaflet: any = null;

  // track dragging to avoid treating drags as clicks
  private mapDragging: boolean = false;

  markers: Map<any, any> = new Map<any, any>();

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

    // Leaflet is loaded before the application module in index.html.
    if (!this.leaflet) {
      console.error("Leaflet library is not loaded.");
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

    // track dragging to avoid treating drags as clicks
    this.map.on("dragstart", () => {
      this.mapDragging = true;
    });

    this.map.on("dragend", () => {
      // small timeout to avoid immediate click after drag
      setTimeout(() => (this.mapDragging = false), 50);
    });

    // handle map clicks: ignore when dragging or when clicking on a marker
    this.map.on("click", (e: any) => {
      if (this.mapDragging) return;

      const originalTarget = e?.originalEvent?.target as
        | HTMLElement
        | undefined;

      // Check if the click was on a marker
      if (originalTarget && originalTarget.closest) {
        const markerEl = originalTarget.closest(
          ".leaflet-marker-icon, .map-marker",
        );
        if (markerEl) return;
      }

      const hero = this.runtime.heroController?.currentHero;
      if (!hero) return;

      this.moveHeroMarker(hero, e.latlng.lat, e.latlng.lng);
    });

    // console.log("Map initialized");
    // GameManager.npcController?.onNpcsLoaded((npcs) => {
    //   npcs.forEach((npc) => {
    //     this.addNPCMarker(npc.latitude, npc.longitude, npc);
    //   });
    // });
  }

  addNPCMarker(_lat: number, _lng: number, npc: INpc): Marker | undefined {
    if (!this.map) {
      console.error("Map is not initialized.");
      return;
    }

    const marker = new Marker(
      this.leaflet,
      this.map,
      npc,
      undefined,
      this.runtime,
    );
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

  addHeroMarker(_lat: number, _lng: number, hero: any): Marker | undefined {
    if (!this.map) {
      console.error("Map is not initialized.");
      return;
    }

    const existingMarker = this.markers.get(hero);
    if (existingMarker) {
      existingMarker.remove();
      this.markers.delete(hero);
    }

    const marker = new Marker(
      this.leaflet,
      this.map,
      undefined,
      hero,
      this.runtime,
    );
    marker.setLatLng([_lat, _lng]);
    this.markers.set(hero, marker);
    return marker;
  }

  moveHeroMarker(_hero: any, _newLat: number, _newLng: number): void {
    const marker = this.markers.get(_hero);

    if (!marker) {
      return;
    }

    marker.setLatLng([_newLat, _newLng]);
    if (this.runtime.heroController?.position) {
      this.runtime.heroController.position = {
        latitude: _newLat,
        longitude: _newLng,
      };
    }
  }

  removeHeroMarker(_hero: any): void {
    const marker = this.markers.get(_hero);

    if (!marker) {
      return;
    }

    marker.remove();
    this.markers.delete(_hero);
  }

  onNpcMarkerClick(npc: INpc, callback: () => void): void {
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
