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
});
