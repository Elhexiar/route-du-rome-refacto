import type {
  IHeroController,
  INpcController,
  IMapController,
  IDialogueController,
  IExperienceController,
} from "#IControllers/index.ts";
import { ConsoleTestController } from "./ConsoleTestController.ts";
import { HeaderHeroSelectionView } from "#UI/HeaderHeroSelectionView.ts";
import type { AppDependencies } from "../bootstrap/ApplicationContainer.ts";
import { ApplicationContainer } from "../bootstrap/ApplicationContainer.ts";
export class GameManager {
  private static _instance: GameManager | null = null;

  public _app: HTMLElement | null = null;

  private _heroController: IHeroController | null = null;
  private _npcController: INpcController | null = null;
  private _mapController: IMapController | null = null;
  private _dialogueController: IDialogueController | null = null;
  private _experienceController: IExperienceController | null = null;
  private _headerView: HeaderHeroSelectionView | null = null;
  private _consoleTestController: ConsoleTestController | null = null;

  private constructor() {}

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

  public static get consoleTestController(): ConsoleTestController | null {
    return GameManager.instance._consoleTestController;
  }

  public static set consoleTestController(value: ConsoleTestController | null) {
    GameManager.instance._consoleTestController = value;
  }

  public static bind(dependencies: AppDependencies): void {
    const manager = GameManager.instance;
    manager._app = manager._app ?? null;
    manager._heroController = dependencies.heroController;
    manager._npcController = dependencies.npcController;
    manager._mapController = dependencies.mapController;
    manager._dialogueController = dependencies.dialogueController;
    manager._experienceController = dependencies.experienceController;
    manager._headerView = dependencies.headerView;
  }

  public get app(): HTMLElement | null {
    return this._app;
  }

  public static get app(): HTMLElement | null {
    return GameManager.instance._app;
  }

  public static resetForTests(): void {
    GameManager._instance = null;
  }

  public static create(
    appElement: HTMLElement | null = null,
    _configPath: string = "/config.json",
  ): GameManager {
    const manager = GameManager.instance;
    manager._app = appElement;
    return manager;
  }

  public static init(
    appElement: HTMLElement | null = null,
    configPath: string = "/config.json",
  ): void {
    const canBootstrapBrowserRuntime =
      typeof window !== "undefined" && typeof document !== "undefined";

    if (!canBootstrapBrowserRuntime) {
      return;
    }

    if (appElement) {
      GameManager.create(appElement, configPath);
      GameManager.bind(ApplicationContainer.create(appElement));
    }
  }
}

// makes the GameManager class accessible globally in the browser environment
if (typeof window !== "undefined") {
  (window as Window & { GameManager?: typeof GameManager }).GameManager =
    GameManager;
}
