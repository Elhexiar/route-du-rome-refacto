import type { IHeroController } from "#IControllers/index.ts";
import type { IHero } from "#IEntities/IHero.ts";
import type { ConfigData } from "#Entities/Config.ts";
import { Hero } from "#Entities/Hero.ts";
import { Dialogue } from "#Entities/dialogue/Dialogue.ts";

export class HeroController implements IHeroController {
  heroes: IHero[] = [];
  currentHero: IHero | null = null;
  private onHeroesLoadedCallbacks: Array<(heroes: IHero[]) => void> = [];
  private onHeroesSwitchedCallbacks: Array<(hero: IHero | null) => void> = [];
  position: { lattitude: number; longitude: number } = {
    lattitude: 48.4,
    longitude: -1.5,
  };

  constructor(configPath: string = "/config.json") {
    this.currentHero = null;
    this.loadHeroesFromConfig(configPath);
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

    configData.Heroes.forEach((heroData) => {
      const hero: IHero = new Hero(
        heroData.id,
        heroData.name,
        heroData.role,
        heroData.description,
        heroData.bio,
        heroData.portrait,
        heroData.presentationVideo,
        null,
        [],
      );

      if (heroData.presentationDialogue) {
        const parsedDialogue = new Dialogue(
          hero,
          hero.name + "-presentation-dialogue",
          heroData.presentationDialogue,
        );
        hero.presentationDialogue = parsedDialogue;
      }

      this.heroes.push(hero);
    });

    console.log("Heroes added from JSON:", this.heroes);

    this.onHeroesLoadedCallbacks.forEach((callback) => callback(this.heroes));
  }

  SwitchHero(hero: IHero): void {
    this.currentHero = hero;
    this.onHeroesSwitchedCallbacks.forEach((callback) =>
      callback(this.currentHero),
    );
  }
  SwitchHeroById(heroId: string): boolean {
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

  onHeroesLoaded(callback: (heroes: IHero[]) => void): void {
    this.onHeroesLoadedCallbacks.push(callback);
  }

  onHeroesSwitched(callback: (hero: IHero | null) => void): void {
    this.onHeroesSwitchedCallbacks.push(callback);
  }
}
