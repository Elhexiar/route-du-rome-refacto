import type { IHero } from "#IEntities/IHero.ts";

export interface IHeroController {
  heroes: IHero[];
  readonly currentHero: IHero | null;

  position: { lattitude: number; longitude: number };

  SwitchHero(hero: IHero): void;
  SwitchHeroById(heroId: string): boolean;
  onHeroesLoaded(callback: (heroes: IHero[]) => void): void;
  onHeroesSwitched(callback: (hero: IHero | null) => void): void;
}
