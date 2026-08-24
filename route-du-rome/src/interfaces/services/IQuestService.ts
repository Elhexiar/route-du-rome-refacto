import type { IQuest } from "#IEntities/IQuest.ts";

export interface IQuestService {
  quests: Map<string, IQuest>;

  getQuestById(questId: string): IQuest | null;
  getAllQuests(): IQuest[];
  createQuest(questData: IQuest): IQuest;
  updateQuestCompletionStatus(
    questId: string,
    completionStatus: number,
  ): IQuest | null;
  deleteQuest(questId: string): Promise<boolean>;
}
