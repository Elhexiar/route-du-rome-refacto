import { describe, expect, it } from "vitest";

import { GameManager } from "../../controllers/GameManager";

describe("GameManager", () => {
  it("exposes a singleton instance and keeps the same instance across calls", () => {
    GameManager.resetForTests();

    expect(GameManager.instance).toBe(GameManager.instance);
    expect(GameManager.instance).toBeInstanceOf(GameManager);
  });

  it("stores controller references through static accessors", () => {
    GameManager.resetForTests();
    const fakeHero = { id: "hero-1" } as any;
    const fakeNpc = { id: "npc-1" } as any;
    const fakeMap = { id: "map-1" } as any;
    const fakeDialogue = { id: "dialog-1" } as any;
    const fakeExperience = { id: "experience-1" } as any;

    GameManager.heroController = fakeHero;
    GameManager.npcController = fakeNpc;
    GameManager.mapController = fakeMap;
    GameManager.dialogueController = fakeDialogue;
    GameManager.experienceController = fakeExperience;

    expect(GameManager.heroController).toBe(fakeHero);
    expect(GameManager.npcController).toBe(fakeNpc);
    expect(GameManager.mapController).toBe(fakeMap);
    expect(GameManager.dialogueController).toBe(fakeDialogue);
    expect(GameManager.experienceController).toBe(fakeExperience);
  });

  it("keeps the underlying app reference in sync with the static getter", () => {
    GameManager.resetForTests();
    const app = { id: "app-root" } as HTMLElement;

    GameManager.instance["_app"] = app;

    expect(GameManager.app).toBe(app);
  });

  it("creates an explicit runtime instance without relying on the singleton bootstrap alone", () => {
    GameManager.resetForTests();
    const app = { id: "runtime-app" } as HTMLElement;

    const manager = GameManager.create(app, "/config.json");

    expect(manager).toBeInstanceOf(GameManager);
    expect(manager.app).toBe(app);
    expect(GameManager.instance).toBe(manager);
  });
});
