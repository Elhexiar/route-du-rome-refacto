import { AppEvents } from "../events/AppEvents";
import type { AppEvent, EventBus } from "../events/EventBus";
import type { ExperienceController } from "../controllers/ExperienceController";
import type { QuestService } from "./QuestService";
import { QuestCompletedToast } from "../ui/experience/QuestCompletedToast";
import { EndToast } from "../ui/experience/EndToast";
import { NotebookView } from "../ui/experience/NotebookView";
import type { BadgeService } from "./BadgeService";
import type { IHeroController } from "../interfaces/controllers/IHeroController";

export class NotificationService {
  private readonly questCompletedToast: QuestCompletedToast;
  private readonly endToast: EndToast;
  private readonly notebookView: NotebookView;

  constructor(
    app: HTMLElement,
    eventBus: EventBus,
    questService: QuestService,
    experienceController: ExperienceController,
    badgeService: BadgeService,
    heroController: IHeroController,
  ) {
    this.questCompletedToast = new QuestCompletedToast(
      app,
      questService.levelData,
      { experienceController },
    );
    this.endToast = new EndToast(app, {
      experienceController,
    });
    this.notebookView = new NotebookView(app, {
      badgeService,
      heroController,
    });

    questService.QuestCompleteToast = this.questCompletedToast;
    questService.EndToast = this.endToast;
    badgeService.NotebookView = this.notebookView;

    eventBus.on(AppEvents.NOTIFICATION_SHOW, (event) => {
      this.handleNotification(event);
    });
    eventBus.on(AppEvents.BADGE_COLLECTED, () => {
      this.notebookView.ShowView();
    });
  }

  private handleNotification(
    event: AppEvent<typeof AppEvents.NOTIFICATION_SHOW>,
  ): void {
    if (event.data?.type === "toast-quest") {
      this.questCompletedToast.ShowToast();
    }

    if (event.data?.type === "toast-end") {
      this.endToast.ShowToast();
    }
  }
}
