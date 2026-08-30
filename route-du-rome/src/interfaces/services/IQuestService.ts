import type { IQuest } from "#IEntities/IQuest.ts";

export interface IQuestService {
  quests: Map<string, IQuest>;
  levelData: {
    id: string;
    name: string;
    description: string;
    icon: string;
    min: number;
    max: number;
  }[];
  QuestCompleteToast: { ShowToast(): void } | null;
  EndToast: { ToggleToast(): void } | null;

  getQuestById(questId: string): IQuest | null;
  getAllQuests(): IQuest[];
  createQuest(questData: IQuest): IQuest;
  updateQuestCompletionStatus(
    questId: string,
    completionStatus: number,
  ): IQuest | null;
  deleteQuest(questId: string): Promise<boolean>;

  loadLevelDataFromConfig(configPath: string): Promise<any>;
  showToast(): void;
  toggleEndToast(): void;
}
