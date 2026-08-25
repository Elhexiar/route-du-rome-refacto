import type { IBadge } from "#IEntities/index";

export interface IQuest {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  relatedBadge: IBadge | null;

  checkCompletionCondition(): boolean;
  Complete(): void;
  OnQuestActions: (() => void)[];
  Reward(): void;
}
