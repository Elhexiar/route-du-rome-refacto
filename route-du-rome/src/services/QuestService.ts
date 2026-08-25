import type { IQuestService } from "#IServices/index";
import type { IQuest } from "#src/interfaces/entities/IQuest.ts";
import { GameManager } from "#Controllers/GameManager.ts";
import { NPCDefaultQuest } from "#Entities/Quest.ts";
import { NPCBadge } from "#Entities/NPCBadge.ts";

export class QuestService implements IQuestService {
  quests: Map<string, IQuest> = new Map<string, IQuest>();
  getQuestById(questId: string): IQuest | null {
    throw new Error("Method not implemented.");
  }
  getAllQuests(): IQuest[] {
    throw new Error("Method not implemented.");
  }
  createQuest(questData: IQuest): IQuest {
    throw new Error("Method not implemented.");
  }
  updateQuestCompletionStatus(
    questId: string,
    completionStatus: number,
  ): IQuest | null {
    throw new Error("Method not implemented.");
  }
  deleteQuest(questId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  constructor() {
    // Initialize the default quest for each npc
    GameManager.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        const defaultQuest = new NPCDefaultQuest(
          npc,
          npc.id + "-default",
          `Default Quest for ${npc.name}`,
          "This is a default quest.",
        );

        defaultQuest.OnQuestActions.push(() => {
          console.log(
            `Quest "${defaultQuest.name}" completed for NPC ${npc.name}`,
          );
        });

        this.quests.set(defaultQuest.id, defaultQuest);

        npc.presentationDialogue?.OnDialogueActions?.push(() => {
          defaultQuest.Complete();
        });

        console.log(
          `Default quest created for NPC ${npc.name}: ${defaultQuest.name}`,
        );

        // create a badge for the quest and associate it with the quest
        const badge = new NPCBadge(
          npc,
          defaultQuest.id + "-badge",
          npc.jobSector,
          npc.name,
          npc.icon,
        );

        defaultQuest.OnQuestActions.push(() => {
          badge.Unlock();
        });

        defaultQuest.relatedBadge = badge;
        GameManager.experienceController?.badgeService.createBadge(badge);
      });
    });
  }
}
