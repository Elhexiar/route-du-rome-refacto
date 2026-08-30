import type { IHero } from "#IEntities/IHero.ts";
import type { IDialogueController } from "./IDialogueController.ts";

export interface IHeroController {
  heroes: IHero[];
  readonly currentHero: IHero | null;

  position: { latitude: number; longitude: number };

  switchHero(hero: IHero): void;
  SwitchHero(hero: IHero): void;

  switchHeroById(heroId: string): boolean;
  SwitchHeroById(heroId: string): boolean;

  onHeroesLoaded(callback: (heroes: IHero[]) => void): void;
  onHeroesSwitched(callback: (hero: IHero | null) => void): void;

  initializeWelcomeHeroSelectionView(
    appContainer: HTMLElement,
    dialogueController: IDialogueController,
  ): void;
}
