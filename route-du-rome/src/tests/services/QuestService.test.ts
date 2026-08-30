import { afterEach, describe, expect, it, vi } from "vitest";

import { NPCDefaultQuest } from "#Entities/Quest.ts";
import { QuestService } from "#Services/QuestService.ts";

describe("QuestService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds default quests and associated badges from the runtime NPC registry", async () => {
    const npc = {
      id: "npc-1",
      name: "Morgane",
      jobSector: "Maritime",
      icon: "⚓",
      done: false,
    } as any;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Levels: [
            {
              id: "level1",
              name: "Niveau 1",
              icon: "🌱",
              min: 0,
              max: 100,
              description: "Test",
            },
          ],
          Heroes: [],
          Npcs: [],
        }),
      }),
    );

    const service = new QuestService({
      npcController: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) => callback([npc]),
      },
    });
    await service.LoadLevelDataFromConfig("/config.json");

    expect(service.quests.has("npc-1-default")).toBe(true);

    const quest = service.quests.get("npc-1-default") as NPCDefaultQuest;
    expect(quest).toBeInstanceOf(NPCDefaultQuest);
    expect(quest.relatedBadge?.id).toBe("npc-1-default-badge");
    expect(quest.isCompleted).toBe(false);

    quest.Complete();

    expect(quest.isCompleted).toBe(true);
    expect(npc.done).toBe(true);
    expect(service.levelData[0].id).toBe("level1");
  });

  it("awards experience when a quest is completed so the level system remains authoritative", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Levels: [
            {
              id: "level1",
              name: "Niveau 1",
              icon: "🌱",
              min: 0,
              max: 150,
              description: "Test",
            },
            {
              id: "level2",
              name: "Niveau 2",
              icon: "🌿",
              min: 150,
              max: 300,
              description: "Test",
            },
          ],
          Heroes: [],
          Npcs: [],
        }),
      }),
    );

    const experienceController = {
      currentExperience: 0,
      currentLevel: 1,
      currentExperienceLimit: 150,
      badgeService: {
        createBadge: vi.fn(),
        collectBadge: vi.fn(),
        getAllBadges: vi.fn(() => []),
        getAllCollectedBadges: vi.fn(() => []),
      },
      addExperience: vi.fn(function (this: any, amount: number) {
        this.currentExperience += amount;
      }),
      setLevelData: vi.fn(),
      getCurrentLevelDefinition: vi.fn(() => ({
        id: "level1",
        name: "Niveau 1",
        icon: "🌱",
        min: 0,
        max: 150,
        description: "Test",
      })),
    };

    const service = new QuestService({
      experienceController: experienceController as any,
      npcController: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) =>
          callback([
            {
              id: "npc-1",
              name: "Morgane",
              jobSector: "Maritime",
              icon: "⚓",
              done: false,
            },
          ]),
      },
    });
    await service.LoadLevelDataFromConfig("/config.json");

    const quest = service.quests.get("npc-1-default");
    expect(quest).toBeTruthy();

    quest!.Complete();

    expect(experienceController.addExperience).toHaveBeenCalledWith(150);
  });

  it("accepts an explicit runtime context instead of relying on singleton globals", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Levels: [
            {
              id: "level1",
              name: "Niveau 1",
              icon: "🌱",
              min: 0,
              max: 150,
              description: "Test",
            },
          ],
          Heroes: [],
          Npcs: [],
        }),
      }),
    );

    const experienceController = {
      currentExperience: 0,
      currentLevel: 1,
      currentExperienceLimit: 150,
      badgeService: {
        createBadge: vi.fn(),
        collectBadge: vi.fn(),
      },
      addExperience: vi.fn(),
      setLevelData: vi.fn(),
    };

    const runtime = {
      npcController: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) =>
          callback([
            {
              id: "npc-runtime",
              name: "Nora",
              jobSector: "Culture",
              icon: "🌾",
              done: false,
            },
          ]),
      },
      experienceController,
      mapController: {
        mapView: {
          markers: new Map(),
        },
      },
    } as any;

    const service = new QuestService(runtime);
    await service.LoadLevelDataFromConfig("/config.json");

    expect(service.quests.has("npc-runtime-default")).toBe(true);
    expect(experienceController.addExperience).not.toHaveBeenCalled();

    service.quests.get("npc-runtime-default")!.Complete();

    expect(experienceController.addExperience).toHaveBeenCalledWith(150);
  });

  it("delegates the toast actions to the configured toast instances", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Levels: [
            {
              id: "level1",
              name: "Niveau 1",
              icon: "🌱",
              min: 0,
              max: 100,
              description: "Test",
            },
          ],
          Heroes: [],
          Npcs: [],
        }),
      }),
    );

    const showToast = vi.fn();
    const toggleToast = vi.fn();
    const service = new QuestService();

    service.QuestCompleteToast = { ShowToast: showToast } as any;
    service.EndToast = { ToggleToast: toggleToast } as any;

    service.ShowToast();
    service.ToggleEndToast();

    expect(showToast).toHaveBeenCalledTimes(1);
    expect(toggleToast).toHaveBeenCalledTimes(1);
  });
});
