import { describe, expect, it } from "vitest";

import { ExperienceController } from "#Controllers/ExperienceController.ts";

describe("ExperienceController", () => {
  it("stores the injected services and exposes the current experience state", () => {
    const questService = { quests: new Map() } as any;
    const badgeService = { badges: [] } as any;
    const controller = new ExperienceController(questService, badgeService);

    expect(controller.questService).toBe(questService);
    expect(controller.badgeService).toBe(badgeService);
    expect(controller.curentExperience).toBe(0);
    expect(controller.currentLevel).toBe(1);
    expect(controller.currentExperienceLimit).toBe(100);
  });

  it("throws for the currently unimplemented gameplay methods", () => {
    const controller = new ExperienceController({ quests: new Map() } as any, { badges: [] } as any);

    expect(() => controller.addExperience(25)).toThrow("Method not implemented.");
    expect(() => controller.levelUp()).toThrow("Method not implemented.");
    expect(() => controller.checkLevelUp()).toThrow("Method not implemented.");
  });
});
