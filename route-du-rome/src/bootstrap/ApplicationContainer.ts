/**
 * ApplicationContainer - Composition Root
 *
 * Single place where ALL dependencies are created and wired together.
 * This replaces scattered initialization logic and makes the dependency graph explicit.
 *
 * Usage:
 *   const container = ApplicationContainer.create(appElement);
 */

import { EventBus } from "../events/EventBus";
import { NpcController } from "../controllers/NpcController";
import { HeroController } from "../controllers/HeroController";
import { MapController } from "../controllers/MapController";
import { DialogueController } from "../controllers/DialogueController";
import { ExperienceController } from "../controllers/ExperienceController";
import { HeaderHeroSelectionView } from "../ui/HeaderHeroSelectionView";
import { NotificationService } from "../services/NotificationService";
import { QuestService } from "../services/QuestService";
import type { IHeroController } from "#IControllers/IHeroController";
import type { INpcController } from "#IControllers/INpcController";
import type { IMapController } from "#IControllers/IMapController";
import type { IDialogueController } from "#IControllers/IDialogueController";
import type { IExperienceController } from "#IControllers/IExperienceController";

export interface AppDependencies {
  eventBus: EventBus;
  npcController: INpcController;
  heroController: IHeroController;
  mapController: IMapController | null;
  dialogueController: IDialogueController;
  experienceController: IExperienceController;
  notificationService: NotificationService;
  headerView: HeaderHeroSelectionView;
}

export class ApplicationContainer {
  private static instance: AppDependencies | null = null;

  /**
   * Create and return singleton dependencies for the application.
   * Called once during bootstrap in main.ts
   */
  static create(appElement: HTMLElement): AppDependencies {
    if (this.instance) {
      return this.instance;
    }

    // 1. Create EventBus - all communication flows through this
    const eventBus = new EventBus();

    // 2. Create controllers in dependency order
    const npcController = new NpcController("/config.json");
    const heroController = new HeroController("/config.json");

    // MapController needs app element
    const mapController = appElement
      ? new MapController(appElement, { npcController, heroController })
      : null;

    // ExperienceController needs to be created before DialogueController
    // so DialogueView can access questService
    const experienceController = new ExperienceController(null, null, {
      npcController,
      heroController,
      mapController,
      app: appElement,
      eventBus,
    });

    // DialogueController now has access to experienceController
    const dialogueController = new DialogueController(appElement, {
      npcController,
      heroController,
      mapController,
      experienceController,
    });

    // Initialize the welcome hero selection view, it needs to be done after the controllers are created so it can access them
    heroController.initializeWelcomeHeroSelectionView(
      appElement,
      dialogueController,
    );

    // NotificationService needs access to questService and experienceController
    const notificationService = new NotificationService(
      appElement,
      eventBus,
      experienceController.questService as QuestService,
      experienceController,
      experienceController.badgeService as import("../services/BadgeService").BadgeService,
      heroController,
    );

    // 3. Create header view
    const headerView = new HeaderHeroSelectionView(appElement, {
      heroController,
      experienceController,
      dialogueController,
    });

    // 4. Store and return
    const dependencies: AppDependencies = {
      eventBus,
      npcController,
      heroController,
      mapController,
      dialogueController,
      experienceController,
      notificationService,
      headerView,
    };

    this.instance = dependencies;
    return dependencies;
  }

  /**
   * Get the singleton dependencies (must call create() first)
   */
  static getInstance(): AppDependencies {
    if (!this.instance) {
      throw new Error(
        "ApplicationContainer not initialized. Call create() first.",
      );
    }
    return this.instance;
  }

  /**
   * Reset for testing
   */
  static resetForTests(): void {
    this.instance = null;
  }
}
