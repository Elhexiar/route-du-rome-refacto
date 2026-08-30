import { describe, expect, it } from "vitest";

import { ExperienceController } from "#Controllers/ExperienceController.ts";

describe("ExperienceController", () => {
  it("stores the injected services and exposes the level state from the configured thresholds", () => {
    const questService = { quests: new Map() } as any;
    const badgeService = { badges: [] } as any;
    const controller = new ExperienceController(questService, badgeService);
    controller.setLevelData([
      {
        id: "level1",
        name: "Niveau 1",
        description: "Test",
        icon: "🌱",
        min: 0,
        max: 150,
      },
      {
        id: "level2",
        name: "Niveau 2",
        description: "Test",
        icon: "🌿",
        min: 150,
        max: 300,
      },
    ]);

    expect(controller.questService).toBe(questService);
    expect(controller.badgeService).toBe(badgeService);
    expect(controller.currentExperience).toBe(0);
    expect(controller.curentExperience).toBe(0);
    expect(controller.currentLevel).toBe(1);
    expect(controller.currentExperienceLimit).toBe(150);
  });

  it("adds experience using the configured level thresholds", () => {
    const controller = new ExperienceController(
      { quests: new Map() } as any,
      { badges: [] } as any,
    );
    controller.setLevelData([
      {
        id: "level1",
        name: "Niveau 1",
        description: "Test",
        icon: "🌱",
        min: 0,
        max: 150,
      },
      {
        id: "level2",
        name: "Niveau 2",
        description: "Test",
        icon: "🌿",
        min: 150,
        max: 300,
      },
    ]);

    controller.addExperience(25);
    expect(controller.currentExperience).toBe(25);
    expect(controller.currentLevel).toBe(1);
    expect(controller.checkLevelUp()).toBe(false);

    controller.addExperience(150);
    expect(controller.currentExperience).toBe(175);
    expect(controller.currentLevel).toBe(2);
    expect(controller.currentExperienceLimit).toBe(300);
  });
});
