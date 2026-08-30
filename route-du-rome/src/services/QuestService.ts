import type { IQuestService } from "#IServices/index";
import type { IQuest } from "#src/interfaces/entities/IQuest.ts";
import { GameManager } from "#Controllers/GameManager.ts";
import { NPCDefaultQuest } from "#Entities/Quest.ts";
import { NPCBadge } from "#Entities/NPCBadge.ts";
import type { INpc } from "#IEntities/index.ts";
import type { ConfigData } from "#src/entities/Config.ts";
import { QuestCompletedToast } from "#src/ui/experience/QuestCompletedToast.ts";
import { EndToast } from "#src/ui/experience/EndToast.ts";

export class QuestService implements IQuestService {
  private static readonly questXpReward = 150;

  quests: Map<string, IQuest> = new Map<string, IQuest>();
  levelData: ConfigData["Levels"] = [];
  questCompleteToast: QuestCompletedToast | null = null;
  endToast: EndToast | null = null;
  onQuestCompletionCallbacks: (() => void)[] = [];

  get QuestCompleteToast(): QuestCompletedToast | null {
    return this.questCompleteToast;
  }

  set QuestCompleteToast(value: QuestCompletedToast | null) {
    this.questCompleteToast = value;
  }

  get EndToast(): EndToast | null {
    return this.endToast;
  }

  set EndToast(value: EndToast | null) {
    this.endToast = value;
  }

  constructor() {
    this.initializeDefaultQuests();
    this.loadLevelDataFromConfig("/config.json").catch(() => undefined);
  }

  private initializeDefaultQuests(): void {
    GameManager.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        const defaultQuest = this.createDefaultQuestForNpc(npc);
        this.quests.set(defaultQuest.id, defaultQuest);

        const badge = this.createBadgeForQuest(defaultQuest, npc);
        defaultQuest.relatedBadge = badge;
        GameManager.experienceController?.badgeService.createBadge(badge);
      });
    });
  }

  private createDefaultQuestForNpc(npc: INpc): NPCDefaultQuest {
    const defaultQuest = new NPCDefaultQuest(
      npc,
      `${npc.id}-default`,
      `Default Quest for ${npc.name}`,
      "This is a default quest.",
    );

    defaultQuest.OnQuestActions.push(() => {
      npc.done = true;
      GameManager.experienceController?.addExperience(
        QuestService.questXpReward,
      );
      GameManager.mapController?.mapView?.markers.get(npc)?.UpdateMarker();

      if (this.areAllQuestsCompleted()) {
        this.toggleEndToast();
      } else {
        this.showToast();
      }
    });

    return defaultQuest;
  }

  private createBadgeForQuest(
    defaultQuest: NPCDefaultQuest,
    npc: INpc,
  ): NPCBadge {
    const badge = new NPCBadge(
      npc,
      `${defaultQuest.id}-badge`,
      npc.jobSector,
      npc.name,
      npc.icon,
    );

    defaultQuest.OnQuestActions.push(() => {
      GameManager.experienceController?.badgeService.collectBadge(badge.id);
    });

    return badge;
  }

  private areAllQuestsCompleted(): boolean {
    return Array.from(this.quests.values()).every((quest) => quest.isCompleted);
  }

  getQuestById(questId: string): IQuest | null {
    return this.quests.get(questId) ?? null;
  }

  getAllQuests(): IQuest[] {
    return Array.from(this.quests.values());
  }

  createQuest(questData: IQuest): IQuest {
    this.quests.set(questData.id, questData);
    return questData;
  }

  updateQuestCompletionStatus(
    questId: string,
    completionStatus: number,
  ): IQuest | null {
    const quest = this.quests.get(questId);
    if (!quest) {
      return null;
    }

    quest.isCompleted = completionStatus > 0;
    return quest;
  }

  deleteQuest(questId: string): Promise<boolean> {
    return Promise.resolve(this.quests.delete(questId));
  }

  async loadLevelDataFromConfig(configPath: string): Promise<any> {
    const safeConfigPath = configPath ?? "/config.json";

    if (typeof fetch !== "function") {
      return {
        Levels: [],
        Heroes: [],
        Npcs: [],
      } as ConfigData;
    }

    const normalizedConfigPath = safeConfigPath.startsWith("http")
      ? safeConfigPath
      : safeConfigPath;

    const response = await fetch(normalizedConfigPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load config: ${response.status} ${response.statusText}`,
      );
    }

    const configData: ConfigData = await response.json();
    this.levelData = configData.Levels;
    GameManager.experienceController?.setLevelData(this.levelData);

    const app = GameManager.app;
    if (app) {
      this.questCompleteToast = new QuestCompletedToast(app, this.levelData);
      this.endToast = new EndToast(app);
    }

    return configData;
  }

  async LoadLevelDataFromConfig(configPath: string): Promise<any> {
    return this.loadLevelDataFromConfig(configPath);
  }

  showToast(): void {
    if (!this.questCompleteToast) {
      console.error("QuestCompleteToast is not initialized.");
      return;
    }

    this.questCompleteToast.ShowToast();
  }

  ShowToast(): void {
    this.showToast();
  }

  toggleEndToast(): void {
    if (!this.endToast) {
      console.error("EndToast is not initialized.");
      return;
    }

    this.endToast.ToggleToast();
  }

  ToggleEndToast(): void {
    this.toggleEndToast();
  }
}
