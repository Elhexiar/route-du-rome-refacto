export interface IQuest {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;

  checkCompletionCondition(): boolean;
  Complete(): void;
  OnQuestActions: (() => void)[];
  Reward(): void;
}
