import { describe, expect, it, vi } from "vitest";
import { ConsoleTestController } from "#Controllers/ConsoleTestController.ts";

function createRuntime() {
  const heroDialogue = {
    Reset: vi.fn(),
  };
  const npcDialogue = {
    Reset: vi.fn(),
  };
  const hero = {
    id: "hero-1",
    name: "Hugo",
    dialogues: [heroDialogue],
    presentationDialogue: heroDialogue,
  };
  const npc = {
    id: "npc-1",
    name: "Nina",
    dialogues: [npcDialogue],
    presentationDialogue: npcDialogue,
  };
  const quest = {
    id: "quest-1",
    isCompleted: false,
    Complete: vi.fn(function (this: { isCompleted: boolean }) {
      this.isCompleted = true;
    }),
  };
  const badge = {
    id: "badge-1",
    collected: false,
  };
  const dialogueView = {
    ResetForNewSpeaker: vi.fn(),
    ResetForNewNPC: vi.fn(),
    ShowView: vi.fn(),
    HideView: vi.fn(),
  };
  const notebookView = {
    ShowView: vi.fn(),
    HideView: vi.fn(),
  };

  const runtime = {
    heroController: {
      heroes: [hero],
      currentHero: hero,
      switchHero: vi.fn(),
      welcomeHeroSelectionView: {
        ShowView: vi.fn(),
        HideView: vi.fn(),
      },
    },
    npcController: {
      npcs: [npc],
      getNpcById: vi.fn(() => npc),
    },
    dialogueController: { dialogueView },
    experienceController: {
      currentExperience: 300,
      currentLevel: 3,
      addExperience: vi.fn(),
      resetProgress: vi.fn(function (this: any) {
        this.currentExperience = 0;
        this.currentLevel = 1;
      }),
      levelUp: vi.fn(),
    },
    questService: {
      quests: new Map([[quest.id, quest]]),
      getQuestById: vi.fn(() => quest),
      getAllQuests: vi.fn(() => [quest]),
      showToast: vi.fn(),
      toggleEndToast: vi.fn(),
    },
    badgeService: {
      badges: new Map([[badge.id, badge]]),
      collectedBadges: new Set<string>(),
      getBadgeById: vi.fn(() => badge),
      getAllBadges: vi.fn(() => [badge]),
      getAllCollectedBadges: vi.fn(() => (badge.collected ? [badge] : [])),
      collectBadge: vi.fn(() => {
        badge.collected = true;
        return true;
      }),
      uncollectBadge: vi.fn(() => {
        badge.collected = false;
        return true;
      }),
      NotebookView: notebookView,
    },
  } as any;

  return {
    controller: new ConsoleTestController(runtime),
    runtime,
    quest,
    badge,
    heroDialogue,
    npcDialogue,
    dialogueView,
  };
}

describe("ConsoleTestController", () => {
  it("completes quests and collects badges", () => {
    const { controller, quest, badge } = createRuntime();

    expect(controller.completeQuest()).toBe(true);
    expect(quest.Complete).toHaveBeenCalledTimes(1);
    expect(controller.collectBadge()).toBe(true);
    expect(badge.collected).toBe(true);
    expect(controller.completeAllQuests()).toBe(0);
    expect(controller.collectAllBadges()).toBe(0);
  });

  it("resets progress and dialogues", () => {
    const {
      controller,
      runtime,
      quest,
      badge,
      heroDialogue,
      npcDialogue,
      dialogueView,
    } = createRuntime();
    quest.isCompleted = true;
    badge.collected = true;
    runtime.experienceController.currentExperience = 300;
    runtime.experienceController.currentLevel = 3;

    controller.resetProgress();

    expect(quest.isCompleted).toBe(false);
    expect(badge.collected).toBe(false);
    expect(runtime.npcController.npcs[0].done).toBe(false);
    expect(runtime.experienceController.resetProgress).toHaveBeenCalledTimes(1);
    expect(heroDialogue.Reset).toHaveBeenCalledTimes(1);
    expect(npcDialogue.Reset).toHaveBeenCalledTimes(1);
    expect(dialogueView.HideView).toHaveBeenCalledTimes(1);
  });

  it("shows hero and NPC dialogues from the requested ids", () => {
    const { controller, dialogueView, runtime, heroDialogue } = createRuntime();

    expect(controller.showHeroPresentation("hero-1")).toBe(true);
    expect(heroDialogue.Reset).toHaveBeenCalledTimes(1);
    expect(runtime.heroController.switchHero).toHaveBeenCalledWith(
      runtime.heroController.heroes[0],
    );
    expect(dialogueView.ResetForNewSpeaker).toHaveBeenCalledWith(
      runtime.heroController.heroes[0],
    );
    expect(controller.showNpcDialogue("npc-1")).toBe(true);
    expect(dialogueView.ResetForNewNPC).toHaveBeenCalledWith(
      runtime.npcController.npcs[0],
    );
    expect(dialogueView.ShowView).toHaveBeenCalledTimes(2);
  });

  it("reports the current game state", () => {
    const { controller, runtime, quest, badge } = createRuntime();
    runtime.experienceController.currentExperience = 150;
    runtime.experienceController.currentLevel = 2;
    quest.isCompleted = true;
    badge.collected = true;

    expect(controller.state()).toEqual({
      hero: "Hugo",
      experience: 150,
      level: 2,
      questsCompleted: 1,
      questsTotal: 1,
      badgesCollected: 1,
      badgesTotal: 1,
    });
  });
});
