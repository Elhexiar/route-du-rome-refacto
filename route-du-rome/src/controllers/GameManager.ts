import type {
  IHeroController,
  INpcController,
  IMapController,
  IDialogueController,
  IExperienceController,
} from "#IControllers/index.ts";
import { HeroController } from "./HeroController.ts";
import { NpcController } from "./NpcController.ts";
import { MapController } from "./MapController.ts";
import { DialogueController } from "./DialogueController.ts";
import { ExperienceController } from "./ExperienceController.ts";

import { QuestService } from "#Services/QuestService.ts";
import { BadgeService } from "#Services/BadgeService.ts";
import { HeaderHeroSelectionView } from "#UI/HeaderHeroSelectionView.ts";
export class GameManager {
  private static _instance: GameManager | null = null;

  public _app: HTMLElement | null = null;

  private configPath: string = "/config.json";

  private _heroController: IHeroController | null = null;
  private _npcController: INpcController | null = null;
  private _mapController: IMapController | null = null;
  private _dialogueController: IDialogueController | null = null;
  private _experienceController: IExperienceController | null = null;
  private _headerView: HeaderHeroSelectionView | null = null;

  //   private _experienceController: IExperienceController | null = null;

  private constructor() {}

  private initializeControllers(): void {
    this._heroController = new HeroController(this.configPath);
    this._npcController = new NpcController(this.configPath);

    // Initialize the map controller only if the app element is provided
    if (this._app) {
      this._mapController = new MapController(this._app);
    }
    this._dialogueController = new DialogueController(this._app);
    this._experienceController = new ExperienceController(
      new QuestService(),
      new BadgeService(),
    );

    this._headerView = new HeaderHeroSelectionView(this._app as HTMLElement);

    // this._experienceController = new ExperienceController();
  }

  public static get instance(): GameManager {
    if (!GameManager._instance) {
      GameManager._instance = new GameManager();
    }

    return GameManager._instance;
  }

  public static get heroController(): IHeroController | null {
    return GameManager.instance._heroController;
  }

  public static set heroController(value: IHeroController | null) {
    GameManager.instance._heroController = value;
  }

  public static get npcController(): INpcController | null {
    return GameManager.instance._npcController;
  }

  public static set npcController(value: INpcController | null) {
    GameManager.instance._npcController = value;
  }

  public static get mapController(): IMapController | null {
    return GameManager.instance._mapController;
  }

  public static set mapController(value: IMapController | null) {
    GameManager.instance._mapController = value;
  }

  public static get dialogueController(): IDialogueController | null {
    return GameManager.instance._dialogueController;
  }

  public static set dialogueController(value: IDialogueController | null) {
    GameManager.instance._dialogueController = value;
  }

  public static get experienceController(): IExperienceController | null {
    return GameManager.instance._experienceController;
  }

  public static set experienceController(value: IExperienceController | null) {
    GameManager.instance._experienceController = value;
  }

  public static get headerView(): HeaderHeroSelectionView | null {
    return GameManager.instance._headerView;
  }

  public static set headerView(value: HeaderHeroSelectionView | null) {
    GameManager.instance._headerView = value;
  }

  public static get app(): HTMLElement | null {
    return GameManager.instance._app;
  }

  public static resetForTests(): void {
    GameManager._instance = null;
  }

  public static init(
    appElement: HTMLElement | null = null,
    configPath: string = "/config.json",
  ): void {
    const manager = GameManager.instance;
    manager._app = appElement;
    manager.configPath = configPath;

    if (!manager._heroController || !manager._npcController) {
      manager.initializeControllers();
    }

    if (
      appElement &&
      (!manager._mapController || !manager._dialogueController)
    ) {
      manager.initializeControllers();
    }
  }
}

// makes the GameManager class accessible globally in the browser environment
if (typeof window !== "undefined") {
  (window as Window & { GameManager?: typeof GameManager }).GameManager =
    GameManager;
}
