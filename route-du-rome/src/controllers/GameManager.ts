import type {
  IHeroController,
  INpcController,
  IMapController,
} from "#IControllers/index.ts";
import {
  HeroController,
  NpcController,
  MapController,
} from "#Controllers/index.ts";

export class GameManager {
  private static _instance: GameManager | null = null;

  private _app: HTMLElement | null = null;

  private configPath: string = "/config.json";

  private _heroController: IHeroController | null = null;
  private _npcController: INpcController | null = null;
  private _mapController: IMapController | null = null;
  //   private _dialogueController: IDialogueController | null = null;
  //   private _experienceController: IExperienceController | null = null;

  private constructor() {
    this.initializeControllers();
  }

  private initializeControllers(): void {
    this._heroController = new HeroController(this.configPath);
    this._npcController = new NpcController(this.configPath);

    if (this._app) {
      this._mapController = new MapController(this._app);
    }
    // this._dialogueController = new DialogueController();
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

    if (appElement && !manager._mapController) {
      manager._mapController = new MapController(appElement);
    }
  }
}

// makes the GameManager class accessible globally in the browser environment
(window as Window & { GameManager?: typeof GameManager }).GameManager =
  GameManager;
