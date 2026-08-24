import { describe, expect, it } from "vitest";

import { NPCDefaultQuest } from "#Entities/Quest.ts";

describe("NPCDefaultQuest completion", () => {
  it("runs every quest action once when completed", () => {
    const quest = new NPCDefaultQuest(
      "quest-1",
      "First quest",
      "Complete the first quest",
    );
    const actions: string[] = [];

    quest.OnQuestActions.push(
      () => actions.push("update-experience"),
      () => actions.push("show-reward"),
    );

    quest.Complete();
    quest.Complete();

    expect(quest.isCompleted).toBe(true);
    expect(quest.checkCompletionCondition()).toBe(true);
    expect(actions).toEqual(["update-experience", "show-reward"]);
  });
});
