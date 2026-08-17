import type { IMapController } from "#IControllers/index.ts";
import type { INpc, IHero } from "../interfaces/entities";
import { LeafletMapView } from "#UI/map/MapView.ts";
import { GameManager } from "./GameManager";

export class MapController implements IMapController {
  mapView: any;

  constructor(_app: HTMLElement) {
    this.mapView = new LeafletMapView(_app);

    this.InitMapView(this.mapView);
  }

  InitMapView(mapView: any): void {
    GameManager.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        this.AddNpcMarker(npc.lattitude, npc.longitude, npc);
      });
    });

    GameManager.heroController?.onHeroesSwitched((hero) => {
      if (hero) {
        const position = GameManager.heroController?.position;
        this.AddHeroMarker(
          position?.lattitude ?? 0,
          position?.longitude ?? 0,
          hero,
        );
      }
    });
  }

  AddNpcMarker(lattitude: number, longitude: number, npc: INpc): void {
    this.mapView.addNPCMarker(lattitude, longitude, npc);
  }
  AddHeroMarker(lattitude: number, longitude: number, hero: IHero): void {
    this.mapView.addHeroMarker(lattitude, longitude, hero);
  }
  RemoveNpcMarker(npc: INpc): void {
    throw new Error("Method not implemented.");
  }
  RemoveHeroMarker(hero: IHero): void {
    throw new Error("Method not implemented.");
  }
  GetNpcMarker(npc: INpc) {
    throw new Error("Method not implemented.");
  }
  GetHeroMarker(hero: IHero) {
    throw new Error("Method not implemented.");
  }
  MoveNpcMarker(npc: INpc, newLattitude: number, newLongitude: number): void {
    throw new Error("Method not implemented.");
  }
  MoveHeroMarker(
    hero: IHero,
    newLattitude: number,
    newLongitude: number,
  ): void {
    throw new Error("Method not implemented.");
  }
  ToggleMarkerVisibility(visible: boolean, npc?: INpc, hero?: IHero): void {
    throw new Error("Method not implemented.");
  }
  ToggleMarkerAccessibility(
    accessible: boolean,
    npc?: INpc,
    hero?: IHero,
  ): void {
    throw new Error("Method not implemented.");
  }
}
