import { describe, expect, it, vi } from "vitest";

import { NPCDefaultQuest } from "#Entities/Quest.ts";

describe("NPCDefaultQuest", () => {
  it("starts incomplete and only completes once", () => {
    const quest = new NPCDefaultQuest(
      {} as any,
      "quest-1",
      "First quest",
      "Complete the first quest",
    );

    expect(quest.isCompleted).toBe(false);
    expect(quest.checkCompletionCondition()).toBe(false);

    quest.Complete();
    quest.Complete();

    expect(quest.isCompleted).toBe(true);
    expect(quest.checkCompletionCondition()).toBe(true);
  });

  it("executes every quest action exactly once when completed", () => {
    const quest = new NPCDefaultQuest(
      {} as any,
      "quest-2",
      "Second quest",
      "Do something important",
    );
    const firstAction = vi.fn();
    const secondAction = vi.fn();

    quest.OnQuestActions.push(firstAction, secondAction);
    quest.Complete();

    expect(firstAction).toHaveBeenCalledTimes(1);
    expect(secondAction).toHaveBeenCalledTimes(1);
  });

  it("stores its metadata and exposes the related badge slot", () => {
    const quest = new NPCDefaultQuest(
      {} as any,
      "quest-3",
      "Third quest",
      "Finish the last challenge",
    );

    expect(quest.id).toBe("quest-3");
    expect(quest.name).toBe("Third quest");
    expect(quest.description).toBe("Finish the last challenge");
    expect(quest.relatedBadge).toBeNull();
  });
});
