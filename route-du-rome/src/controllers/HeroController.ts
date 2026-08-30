import type { IHeroController } from "#IControllers/index.ts";
import type { IHero } from "#IEntities/IHero.ts";
import type { ConfigData } from "#Entities/Config.ts";
import { Hero } from "#Entities/Hero.ts";
import { Dialogue } from "#Entities/dialogue/Dialogue.ts";
import { WelcomeHeroSelectionView } from "#UI/WelcomeHeroSelectionView.ts";
import { VideoPreloadService } from "#Services/VideoPreloadService.ts";
import type { IDialogueController } from "#IControllers/IDialogueController";

export class HeroController implements IHeroController {
  heroes: IHero[] = [];
  currentHero: IHero | null = null;

  welcomeHeroSelectionView: WelcomeHeroSelectionView | null = null;

  private onHeroesLoadedCallbacks: Array<(heroes: IHero[]) => void> = [];
  private onHeroesSwitchedCallbacks: Array<(hero: IHero | null) => void> = [];
  position: { latitude: number; longitude: number } = {
    latitude: 48.4,
    longitude: -1.5,
  };

  get latitude(): number {
    return this.position.latitude;
  }

  set latitude(value: number) {
    this.position.latitude = value;
  }

  constructor(configPath: string = "/config.json") {
    this.currentHero = null;

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      void this.loadHeroesFromConfig(configPath);
    }
  }

  async loadHeroesFromConfig(configPath?: string): Promise<void> {
    const safeConfigPath = configPath ?? "/config.json";
    const response = await fetch(safeConfigPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load config: ${response.status} ${response.statusText}`,
      );
    }

    const configData: ConfigData = await response.json();

    VideoPreloadService.preloadVideos(
      configData.Heroes.map((heroData) => heroData.presentationVideo),
    );

    configData.Heroes.forEach((heroData) => {
      const hero = Hero.fromJson(heroData);

      if (heroData.presentationDialogue) {
        const parsedDialogue = new Dialogue(
          hero,
          `${hero.name}-presentation-dialogue`,
          heroData.presentationDialogue,
        );
        hero.presentationDialogue = parsedDialogue;
      }

      if (hero.presentationDialogue) {
        hero.presentationDialogue.OnDialogueActions.push(() => {
          if (hero.presentationDialogue) {
            hero.presentationDialogue.Reset();
          }
        });
      }

      this.heroes.push(hero);
    });

    console.log("Heroes added from JSON:", this.heroes);

    this.onHeroesLoadedCallbacks.forEach((callback) => callback(this.heroes));
  }

  initializeWelcomeHeroSelectionView(
    appContainer: HTMLElement,
    dialogueController: IDialogueController,
  ): void {
    const createView = (): void => {
      if (this.welcomeHeroSelectionView) {
        return;
      }

      this.welcomeHeroSelectionView = new WelcomeHeroSelectionView(
        appContainer,
        { heroController: this, dialogueController },
      );
    };

    if (this.heroes.length > 0) {
      createView();
      return;
    }

    this.onHeroesLoaded(createView);
  }

  switchHero(hero: IHero): void {
    this.currentHero = hero;
    this.onHeroesSwitchedCallbacks.forEach((callback) =>
      callback(this.currentHero),
    );
  }

  SwitchHero(hero: IHero): void {
    this.switchHero(hero);
  }

  switchHeroById(heroId: string): boolean {
    const hero = this.heroes.find((h) => h.id === heroId);
    if (hero) {
      this.currentHero = hero;
      this.onHeroesSwitchedCallbacks.forEach((callback) =>
        callback(this.currentHero),
      );
      return true;
    }

    return false;
  }

  SwitchHeroById(heroId: string): boolean {
    return this.switchHeroById(heroId);
  }

  onHeroesLoaded(callback: (heroes: IHero[]) => void): void {
    this.onHeroesLoadedCallbacks.push(callback);
  }

  onHeroesSwitched(callback: (hero: IHero | null) => void): void {
    this.onHeroesSwitchedCallbacks.push(callback);
  }
}
