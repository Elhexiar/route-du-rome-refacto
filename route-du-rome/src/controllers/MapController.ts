import type { IMapController } from "#IControllers/index.ts";
import type { INpc, IHero } from "../interfaces/entities";
import { LeafletMapView } from "#UI/map/MapView.ts";
import { GameManager } from "./GameManager";

export class MapController implements IMapController {
  mapView: any;
  private currentHeroMarkerOwner: IHero | null = null;
  private readonly runtime: {
    npcController?: {
      onNpcsLoaded: (callback: (npcs: any[]) => void) => void;
    } | null;
    heroController?: {
      onHeroesSwitched: (callback: (hero: any) => void) => void;
      position?: { latitude: number; longitude: number };
    } | null;
  };

  constructor(
    _app: HTMLElement,
    runtime: {
      npcController?: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) => void;
      } | null;
      heroController?: {
        onHeroesSwitched: (callback: (hero: any) => void) => void;
        position?: { latitude: number; longitude: number };
      } | null;
    } | null = null,
  ) {
    this.runtime = runtime ?? {
      npcController: GameManager.npcController,
      heroController: GameManager.heroController,
    };

    if (typeof document !== "undefined") {
      this.mapView = new LeafletMapView(_app, {
        heroController: this.runtime.heroController as any,
      });
    } else {
      this.mapView = { markers: new Map() };
    }

    this.InitMapView(this.mapView);
  }

  initMapView(mapView: any): void {
    this.InitMapView(mapView);
  }

  InitMapView(_mapView: any): void {
    this.runtime.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        this.addNpcMarker(npc.latitude, npc.longitude, npc);
      });
    });

    this.runtime.heroController?.onHeroesSwitched((hero) => {
      if (hero) {
        const position = this.runtime.heroController?.position;
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
  toggleMarkerVisibility(visible: boolean, npc?: INpc, hero?: IHero): void {
    const marker = npc
      ? this.mapView?.markers.get(npc)
      : hero
        ? this.mapView?.markers.get(hero)
        : null;

    const element = marker?.marker?.getElement?.() ?? marker?.marker?._icon;
    if (element) {
      element.style.display = visible ? "" : "none";
      return;
    }

    if (typeof marker?.setOpacity === "function") {
      marker.setOpacity(visible ? 1 : 0);
    }
  }

  ToggleMarkerVisibility(visible: boolean, npc?: INpc, hero?: IHero): void {
    this.toggleMarkerVisibility(visible, npc, hero);
  }

  toggleMarkerAccessibility(
    accessible: boolean,
    npc?: INpc,
    hero?: IHero,
  ): void {
    this.toggleMarkerVisibility(accessible, npc, hero);
  }

  ToggleMarkerAccessibility(
    accessible: boolean,
    npc?: INpc,
    hero?: IHero,
  ): void {
    this.toggleMarkerAccessibility(accessible, npc, hero);
  }
}
