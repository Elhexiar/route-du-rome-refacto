import type { IHero, INpc } from "#IEntities/index.ts";

export interface IMapController {
  mapView: any;

  InitMapView(mapView: any): void;

  AddNpcMarker(lattitude: number, longitude: number, npc: INpc): void;
  AddHeroMarker(lattitude: number, longitude: number, hero: IHero): void;

  RemoveNpcMarker(npc: INpc): void;
  RemoveHeroMarker(hero: IHero): void;

  GetNpcMarker(npc: INpc): any;
  GetHeroMarker(hero: IHero): any;

  MoveNpcMarker(npc: INpc, newLattitude: number, newLongitude: number): void;
  MoveHeroMarker(hero: IHero, newLattitude: number, newLongitude: number): void;

  ToggleMarkerVisibility(visible: boolean, npc?: INpc, hero?: IHero): void;
  ToggleMarkerAccessibility(
    accessible: boolean,
    npc?: INpc,
    hero?: IHero,
  ): void;
}
