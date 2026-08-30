import { afterEach, describe, expect, it, vi } from "vitest";

import { GameManager } from "#Controllers/GameManager.ts";
import { NPCDefaultQuest } from "#Entities/Quest.ts";
import { QuestService } from "#Services/QuestService.ts";

describe("QuestService", () => {
  afterEach(() => {
    GameManager.resetForTests();
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

    GameManager.npcController = {
      onNpcsLoaded: (callback: (npcs: any[]) => void) => callback([npc]),
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

    const service = new QuestService();
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
