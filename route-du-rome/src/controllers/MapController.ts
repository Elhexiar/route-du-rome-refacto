import type { IMapController } from "#IControllers/index.ts";
import type { INpc, IHero } from "../interfaces/entities";
import { LeafletMapView } from "#UI/map/MapView.ts";
import { GameManager } from "./GameManager";

export class MapController implements IMapController {
  mapView: any;
  private currentHeroMarkerOwner: IHero | null = null;

  constructor(_app: HTMLElement) {
    this.mapView = new LeafletMapView(_app);

    this.InitMapView(this.mapView);
  }

  initMapView(mapView: any): void {
    this.InitMapView(mapView);
  }

  InitMapView(_mapView: any): void {
    GameManager.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        this.addNpcMarker(npc.latitude, npc.longitude, npc);
      });
    });

    GameManager.heroController?.onHeroesSwitched((hero) => {
      if (hero) {
        const position = GameManager.heroController?.position;
        const lat = position?.latitude ?? 0;
        const lng = position?.longitude ?? 0;

        if (this.currentHeroMarkerOwner) {
          this.removeHeroMarker(this.currentHeroMarkerOwner);
        }

        this.addHeroMarker(lat, lng, hero);
        this.currentHeroMarkerOwner = hero;
      }
    });
  }

  addNpcMarker(latitude: number, longitude: number, npc: INpc): void {
    this.mapView.addNPCMarker(latitude, longitude, npc);
  }

  AddNpcMarker(latitude: number, longitude: number, npc: INpc): void {
    this.addNpcMarker(latitude, longitude, npc);
  }

  addHeroMarker(latitude: number, longitude: number, hero: IHero): void {
    this.mapView.addHeroMarker(latitude, longitude, hero);
  }

  AddHeroMarker(latitude: number, longitude: number, hero: IHero): void {
    this.addHeroMarker(latitude, longitude, hero);
  }
  removeNpcMarker(npc: INpc): void {
    this.mapView.removeNPCMarker?.(npc);
  }

  RemoveNpcMarker(npc: INpc): void {
    this.removeNpcMarker(npc);
  }

  removeHeroMarker(hero: IHero): void {
    this.mapView.removeHeroMarker(hero);

    if (this.currentHeroMarkerOwner?.id === hero.id) {
      this.currentHeroMarkerOwner = null;
    }
  }

  RemoveHeroMarker(hero: IHero): void {
    this.removeHeroMarker(hero);
  }

  getNpcMarker(npc: INpc) {
    return this.mapView.getNPCMarker?.(npc);
  }

  GetNpcMarker(npc: INpc) {
    return this.getNpcMarker(npc);
  }

  getHeroMarker(hero: IHero) {
    return this.mapView.getHeroMarker?.(hero);
  }

  GetHeroMarker(hero: IHero) {
    return this.getHeroMarker(hero);
  }

  moveNpcMarker(npc: INpc, newLatitude: number, newLongitude: number): void {
    this.mapView.moveNPCMarker(npc, newLatitude, newLongitude);
  }

  MoveNpcMarker(npc: INpc, newLatitude: number, newLongitude: number): void {
    this.moveNpcMarker(npc, newLatitude, newLongitude);
  }

  moveHeroMarker(hero: IHero, newLatitude: number, newLongitude: number): void {
    this.mapView.moveHeroMarker(hero, newLatitude, newLongitude);
  }

  MoveHeroMarker(hero: IHero, newLatitude: number, newLongitude: number): void {
    this.moveHeroMarker(hero, newLatitude, newLongitude);
  }
  ToggleMarkerVisibility(_visible: boolean, _npc?: INpc, _hero?: IHero): void {
    throw new Error("Method not implemented.");
  }
  ToggleMarkerAccessibility(
    _accessible: boolean,
    _npc?: INpc,
    _hero?: IHero,
  ): void {
    throw new Error("Method not implemented.");
  }
}
