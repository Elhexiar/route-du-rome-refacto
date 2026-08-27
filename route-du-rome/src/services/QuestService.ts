import type { IQuestService } from "#IServices/index";
import type { IQuest } from "#src/interfaces/entities/IQuest.ts";
import { GameManager } from "#Controllers/GameManager.ts";
import { NPCDefaultQuest } from "#Entities/Quest.ts";
import { NPCBadge } from "#Entities/NPCBadge.ts";
import type { INpc } from "#IEntities/index.ts";
import type { ConfigData } from "#src/entities/Config.ts";
import { QuestCompletedToast } from "#src/ui/experience/QuestCompletedToast.ts";
import type { BadgeService } from "./BadgeService";
import { EndToast } from "#src/ui/experience/EndToast.ts";

export class QuestService implements IQuestService {
  quests: Map<string, IQuest> = new Map<string, IQuest>();

  levelData: ConfigData["Levels"] = [];

  QuestCompleteToast: QuestCompletedToast | null = null;

  EndToast: EndToast | null = null;

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

  OnQuestCompletionCallbacks: (() => void)[] = [];

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
          npc.done = true;
          GameManager.mapController?.mapView?.markers.get(npc)?.UpdateMarker();

          const asFinishedAllQuests = Array.from(this.quests.values()).every(
            (quest) => quest.isCompleted,
          );
          if (asFinishedAllQuests) {
            this.ToggleEndToast();
          } else {
            this.ShowToast();
          }
        });

        this.quests.set(defaultQuest.id, defaultQuest);

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
          GameManager.experienceController?.badgeService.collectBadge(badge.id);
        });

        defaultQuest.relatedBadge = badge;
        GameManager.experienceController?.badgeService.createBadge(badge);
      });
    });

    // get level data from config.json
    void this.LoadLevelDataFromConfig("/config.json");
  }

  async LoadLevelDataFromConfig(configPath: string): Promise<any> {
    const safeConfigPath = configPath ?? "/config.json";
    const response = await fetch(safeConfigPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load config: ${response.status} ${response.statusText}`,
      );
    }

    const configData: ConfigData = await response.json();

    this.levelData = configData.Levels;

    const app = GameManager.app;
    if (app) {
      this.QuestCompleteToast = new QuestCompletedToast(app, this.levelData);
      this.EndToast = new EndToast(app);
    }

    return configData;
  }

  ShowToast() {
    if (!this.QuestCompleteToast) {
      console.error("QuestCompleteToast is not initialized.");
      return;
    }

    this.QuestCompleteToast.ShowToast();
  }

  ToggleEndToast() {
    if (!this.EndToast) {
      console.error("EndToast is not initialized.");
      return;
    }
    this.EndToast.ToggleToast();
  }
}
