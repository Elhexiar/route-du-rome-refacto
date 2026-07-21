import type { INpc } from "#IEntities/INpc";

export interface IMapView {
  markers: Map<INpc, any>;

  addMarker(lat: number, lng: number, npc: INpc): void;
  removeMarker(npc: INpc): void;
  setView(lat: number, lng: number, zoom: number): void;
  onMarkerClick(npc: INpc, callback: () => void): void;
}
