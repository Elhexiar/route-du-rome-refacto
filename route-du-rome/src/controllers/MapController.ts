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

  InitMapView(_mapView: any): void {
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
  RemoveNpcMarker(_npc: INpc): void {
    throw new Error("Method not implemented.");
  }
  RemoveHeroMarker(_hero: IHero): void {
    throw new Error("Method not implemented.");
  }
  GetNpcMarker(_npc: INpc) {
    throw new Error("Method not implemented.");
  }
  GetHeroMarker(_hero: IHero) {
    throw new Error("Method not implemented.");
  }
  MoveNpcMarker(
    _npc: INpc,
    _newLattitude: number,
    _newLongitude: number,
  ): void {
    this.mapView.moveNPCMarker(_npc, _newLattitude, _newLongitude);
  }
  MoveHeroMarker(
    _hero: IHero,
    _newLattitude: number,
    _newLongitude: number,
  ): void {
    this.mapView.moveHeroMarker(_hero, _newLattitude, _newLongitude);
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
