import type { INpc } from "#IEntities/INpc";

export interface IMapView {
  markers: Map<INpc, any>;

  addNPCMarker(lat: number, lng: number, npc: INpc): void;
  moveNPCMarker(npc: INpc, newLat: number, newLng: number): void;
  removeNPCMarker(npc: INpc): void;

  addHeroMarker(lat: number, lng: number, hero: any): void;
  moveHeroMarker(hero: any, newLat: number, newLng: number): void;
  removeHeroMarker(hero: any): void;

  setView(lat: number, lng: number, zoom: number): void;
  onNpcMarkerClick(npc: INpc, callback: () => void): void;
}
