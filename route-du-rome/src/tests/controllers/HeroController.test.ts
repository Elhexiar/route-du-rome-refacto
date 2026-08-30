import { describe, expect, it, vi } from "vitest";

import { HeroController } from "#Controllers/HeroController.ts";
import { Hero } from "#Entities/Hero.ts";

describe("HeroController", () => {
  it("switches the current hero and triggers callbacks", () => {
    const controller = Object.create(
      HeroController.prototype,
    ) as HeroController;
    controller.heroes = [
      new Hero(
        "hero-1",
        "Hero One",
        "Role One",
        "Description One",
        "Bio One",
        "/hero-one.png",
        "/hero-one.mp4",
      ),
      new Hero(
        "hero-2",
        "Hero Two",
        "Role Two",
        "Description Two",
        "Bio Two",
        "/hero-two.png",
        "/hero-two.mp4",
      ),
    ];
    controller.currentHero = null;
    controller["onHeroesSwitchedCallbacks"] = [];
    const onSwitch = vi.fn();

    controller.onHeroesSwitched(onSwitch);
    controller.SwitchHero(controller.heroes[0]);
    controller.SwitchHeroById("hero-2");

    expect((controller.currentHero as Hero | null)?.id).toBe("hero-2");
    expect(onSwitch).toHaveBeenCalledTimes(2);
  });

  it("notifies listeners when heroes are loaded", () => {
    const controller = Object.create(
      HeroController.prototype,
    ) as HeroController;
    controller.heroes = [];
    controller["onHeroesLoadedCallbacks"] = [];
    const onLoaded = vi.fn();

    controller.onHeroesLoaded(onLoaded);
    const hero = new Hero(
      "hero-3",
      "Hero Three",
      "Role Three",
      "Description Three",
      "Bio Three",
      "/hero-three.png",
      "/hero-three.mp4",
    );

    controller.heroes.push(hero);
    controller["onHeroesLoadedCallbacks"].forEach((callback) =>
      callback(controller.heroes),
    );

    expect(onLoaded).toHaveBeenCalledWith([hero]);
  });

  it("loads heroes through the canonical API contract", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Heroes: [
            {
              id: "hero-4",
              name: "Hero Four",
              role: "Role Four",
              description: "Description Four",
              bio: "Bio Four",
              portrait: "/hero-four.png",
              presentationVideo: "/hero-four.mp4",
              presentationDialogue: null,
              tags: [],
            },
          ],
          Npcs: [],
          Levels: [],
        }),
      }),
    );

    const controller = Object.create(
      HeroController.prototype,
    ) as HeroController;
    controller.heroes = [];
    controller["onHeroesLoadedCallbacks"] = [];
    controller["onHeroesSwitchedCallbacks"] = [];

    await controller.loadHeroesFromConfig("/config.json");

    expect(controller.heroes).toHaveLength(1);
    expect(controller.heroes[0].id).toBe("hero-4");
  });
});
