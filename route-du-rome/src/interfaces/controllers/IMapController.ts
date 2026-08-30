import type { IHero, INpc } from "#IEntities/index.ts";

export interface IMapController {
  mapView: any;

  initMapView(mapView: any): void;

  addNpcMarker(latitude: number, longitude: number, npc: INpc): void;

  addHeroMarker(latitude: number, longitude: number, hero: IHero): void;

  removeNpcMarker(npc: INpc): void;

  removeHeroMarker(hero: IHero): void;

  getNpcMarker(npc: INpc): any;

  getHeroMarker(hero: IHero): any;

  moveNpcMarker(npc: INpc, newLatitude: number, newLongitude: number): void;

  moveHeroMarker(hero: IHero, newLatitude: number, newLongitude: number): void;

  toggleMarkerVisibility(visible: boolean, npc?: INpc, hero?: IHero): void;

  toggleMarkerAccessibility(
    accessible: boolean,
    npc?: INpc,
    hero?: IHero,
  ): void;
}
