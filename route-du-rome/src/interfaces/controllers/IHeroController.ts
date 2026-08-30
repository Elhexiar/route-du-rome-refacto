import type { IHero } from "#IEntities/IHero.ts";
import type { IDialogueController } from "./IDialogueController.ts";

export interface IHeroController {
  heroes: IHero[];
  readonly currentHero: IHero | null;
  welcomeHeroSelectionView: {
    ShowView(): void;
    HideView(): void;
  } | null;

  position: { latitude: number; longitude: number };

  switchHero(hero: IHero): void;

  switchHeroById(heroId: string): boolean;

  onHeroesLoaded(callback: (heroes: IHero[]) => void): void;
  onHeroesSwitched(callback: (hero: IHero | null) => void): void;

  initializeWelcomeHeroSelectionView(
    appContainer: HTMLElement,
    dialogueController: IDialogueController,
  ): void;
}
