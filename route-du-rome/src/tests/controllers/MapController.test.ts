import { describe, expect, it, vi } from "vitest";

import { MapController } from "#Controllers/MapController.ts";
import { Hero } from "#Entities/Hero.ts";
import { Npc } from "#Entities/Npc.ts";

describe("MapController", () => {
  it("adds, removes and moves markers for heroes and NPCs", () => {
    const controller = Object.create(MapController.prototype) as MapController;
    const calls: string[] = [];

    controller.mapView = {
      addNPCMarker: vi.fn(() => {
        calls.push("npc-added");
        return "npc-marker";
      }),
      addHeroMarker: vi.fn(() => {
        calls.push("hero-added");
        return "hero-marker";
      }),
      removeHeroMarker: vi.fn(() => calls.push("hero-removed")),
      moveNPCMarker: vi.fn(() => calls.push("npc-moved")),
      moveHeroMarker: vi.fn(() => calls.push("hero-moved")),
    } as any;
    controller["currentHeroMarkerOwner"] = null;

    const hero = new Hero(
      "hero-1",
      "Hero One",
      "Role",
      "Description",
      "Bio",
      "/hero.png",
      "/hero.mp4",
    );
    const npc = new Npc(
      "npc-1",
      "Nelly",
      "#333",
      "Mécanicienne",
      "Industrie",
      "🔧",
      "/nelly.png",
      48.5,
      -1.5,
      "/nelly.mp4",
      "https://example.test/video",
      "Mécanique locale",
      null,
      [],
    );

    controller.AddNpcMarker(48.6, -1.6, npc);
    controller.AddHeroMarker(48.4, -1.5, hero);
    controller.MoveNpcMarker(npc, 48.7, -1.7);
    controller.MoveHeroMarker(hero, 48.9, -1.9);
    controller.RemoveHeroMarker(hero);

    expect(calls).toContain("npc-added");
    expect(calls).toContain("hero-added");
    expect(calls).toContain("npc-moved");
    expect(calls).toContain("hero-moved");
    expect(calls).toContain("hero-removed");
  });

  it("accepts an explicit runtime context instead of relying on singleton globals", () => {
    const npcHandler = vi.fn();
    const heroHandler = vi.fn();
    const runtime = {
      npcController: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) => {
          callback([]);
        },
      },
      heroController: {
        onHeroesSwitched: (callback: (hero: any) => void) => {
          heroHandler(callback);
        },
        position: { latitude: 48.2, longitude: -1.2 },
      },
    } as any;

    const appElement =
      typeof document !== "undefined"
        ? document.createElement("div")
        : ({ id: "mock-app" } as any);

    const controller = new MapController(appElement, runtime);

    expect(typeof controller["runtime"]?.npcController?.onNpcsLoaded).toBe(
      "function",
    );
    expect(typeof controller["runtime"]?.heroController?.onHeroesSwitched).toBe(
      "function",
    );
    expect(npcHandler).not.toHaveBeenCalled();
    expect(heroHandler).toHaveBeenCalledTimes(1);
  });
});
