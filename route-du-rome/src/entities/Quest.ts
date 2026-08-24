import type { IQuest } from "#IEntities/IQuest.ts";

export class NPCDefaultQuest implements IQuest {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  OnQuestActions: (() => void)[];

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isCompleted = false;
    this.OnQuestActions = [];
  }

  checkCompletionCondition(): boolean {
    return this.isCompleted;
  }

  Complete(): void {
    if (this.isCompleted) {
      return;
    }

    this.isCompleted = true;
    this.OnQuestActions.forEach((action) => action());
    this.Reward();
  }

  Reward(): void {}
}
