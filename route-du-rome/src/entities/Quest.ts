import type { IQuest } from "#IEntities/IQuest.ts";
import type { IBadge } from "#IEntities/IBadge.ts";
import type { INpc } from "../interfaces/entities";

export class NPCDefaultQuest implements IQuest {
  relatedNPC: INpc;
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  OnQuestActions: (() => void)[];
  relatedBadge: IBadge | null = null;

  constructor(relatedNPC: INpc, id: string, name: string, description: string) {
    this.relatedNPC = relatedNPC;
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
