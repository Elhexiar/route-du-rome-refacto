import type { IQuestService } from "#IServices/index";
import type { IQuest } from "#src/interfaces/entities/IQuest.ts";
import { GameManager } from "#Controllers/GameManager.ts";
import { NPCDefaultQuest } from "#Entities/Quest.ts";
import { NPCBadge } from "#Entities/NPCBadge.ts";
import type { INpc } from "#IEntities/index.ts";
import type { ConfigData } from "#src/entities/Config.ts";
import { QuestCompletedToast } from "#src/ui/experience/QuestCompletedToast.ts";
import { EndToast } from "#src/ui/experience/EndToast.ts";
import type { EventBus } from "../events/EventBus";
import { AppEvents } from "../events/AppEvents";

export class QuestService implements IQuestService {
  private static readonly questXpReward = 150;

  quests: Map<string, IQuest> = new Map<string, IQuest>();
  levelData: ConfigData["Levels"] = [];
  questCompleteToast: QuestCompletedToast | null = null;
  endToast: EndToast | null = null;
  onQuestCompletionCallbacks: (() => void)[] = [];

  // cache the runtime controllers to avoid repeated access to GameManager
  private readonly runtime: {
    npcController?: {
      onNpcsLoaded: (callback: (npcs: any[]) => void) => void;
    } | null;
    experienceController?: {
      badgeService?: {
        createBadge: (badge: any) => void;
        collectBadge: (id: string) => void;
      };
      addExperience?: (amount: number) => void;
      setLevelData?: (levels: any[]) => void;
      currentLevel?: number;
    } | null;
    mapController?: { mapView?: { markers?: Map<any, any> } } | null;
    app?: HTMLElement | null;
    eventBus?: EventBus | null;
  };

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

  constructor(
    runtime: {
      npcController?: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) => void;
      } | null;
      experienceController?: {
        badgeService?: {
          createBadge: (badge: any) => void;
          collectBadge: (id: string) => void;
        };
        addExperience?: (amount: number) => void;
        setLevelData?: (levels: any[]) => void;
        currentLevel?: number;
      } | null;
      mapController?: { mapView?: { markers?: Map<any, any> } } | null;
      app?: HTMLElement | null;
      eventBus?: EventBus | null;
    } | null = null,
  ) {
    this.runtime = runtime ?? {
      npcController: GameManager.npcController,
      experienceController: GameManager.experienceController,
      mapController: GameManager.mapController,
      app: GameManager.app,
      eventBus: null,
    };

    this.initializeDefaultQuests();
    this.loadLevelDataFromConfig("/config.json").catch(() => undefined);
  }

  private initializeDefaultQuests(): void {
    this.runtime.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        const defaultQuest = this.createDefaultQuestForNpc(npc);
        this.quests.set(defaultQuest.id, defaultQuest);

        const badge = this.createBadgeForQuest(defaultQuest, npc);
        defaultQuest.relatedBadge = badge;
        this.runtime.experienceController?.badgeService?.createBadge(badge);
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
      this.runtime.experienceController?.addExperience?.(
        QuestService.questXpReward,
      );
      this.runtime.mapController?.mapView?.markers?.get(npc)?.UpdateMarker?.();

      if (this.areAllQuestsCompleted()) {
        this.emitQuestCompleted(defaultQuest.id, QuestService.questXpReward);
        this.emitGameEnded();
        this.toggleEndToast();
      } else {
        this.emitQuestCompleted(defaultQuest.id, QuestService.questXpReward);
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
      this.runtime.experienceController?.badgeService?.collectBadge(badge.id);
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
    this.runtime.experienceController?.setLevelData?.(this.levelData);

    const app = this.runtime.app ?? GameManager.app;
    if (app && !this.runtime.eventBus) {
      this.questCompleteToast = new QuestCompletedToast(app, this.levelData, {
        experienceController: this.runtime.experienceController as any,
      });
      this.endToast = new EndToast(app, {
        experienceController: this.runtime.experienceController as any,
      });
    }

    return configData;
  }

  async LoadLevelDataFromConfig(configPath: string): Promise<any> {
    return this.loadLevelDataFromConfig(configPath);
  }

  showToast(): void {
    this.runtime.eventBus?.emit({
      type: AppEvents.NOTIFICATION_SHOW,
      data: {
        type: "toast-quest",
        message: "Quete terminee",
      },
    });

    if (this.runtime.eventBus) {
      return;
    }

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
    this.runtime.eventBus?.emit({
      type: AppEvents.NOTIFICATION_SHOW,
      data: {
        type: "toast-end",
        message: "Jeu termine",
      },
    });

    if (this.runtime.eventBus) {
      return;
    }

    if (!this.endToast) {
      console.error("EndToast is not initialized.");
      return;
    }

    this.endToast.ToggleToast();
  }

  ToggleEndToast(): void {
    this.toggleEndToast();
  }

  /**
   * Emit event when a quest is completed.
   * This is called alongside the existing toast display logic.
   * Future: UI components will listen to events instead of relying on toasts.
   */
  emitQuestCompleted(questId: string, xpReward: number): void {
    this.runtime.eventBus?.emit({
      type: AppEvents.QUEST_COMPLETED,
      data: { questId, xpReward },
    });
  }

  /**
   * Emit event when the game ends (all quests completed).
   * This is called alongside the existing end toast logic.
   */
  emitGameEnded(): void {
    this.runtime.eventBus?.emit({
      type: AppEvents.GAME_ENDED,
      data: {},
    });
  }
}
