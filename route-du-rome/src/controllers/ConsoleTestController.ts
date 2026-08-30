import type { IHeroController } from "../interfaces/controllers/IHeroController";
import type { INpcController } from "../interfaces/controllers/INpcController";
import type { IDialogueController } from "../interfaces/controllers/IDialogueController";
import type { IExperienceController } from "../interfaces/controllers/IExperienceController";
import type { IQuestService } from "../interfaces/services/IQuestService";
import type { IBadgeService } from "../interfaces/services/IBadgeService";
import type { IHero } from "../interfaces/entities/IHero";
import type { IDialogue } from "../interfaces/entities/dialogue/IDialogue";

export interface ConsoleTestRuntime {
  heroController: IHeroController;
  npcController: INpcController;
  dialogueController: IDialogueController;
  experienceController: IExperienceController;
  questService: IQuestService;
  badgeService: IBadgeService;
}

export class ConsoleTestController {
  private readonly runtime: ConsoleTestRuntime;

  constructor(runtime: ConsoleTestRuntime) {
    this.runtime = runtime;
  }

  showQuestToast(): void {
    this.runtime.questService.showToast();
  }

  showEndToast(): void {
    this.runtime.questService.toggleEndToast();
  }

  showNotebook(): void {
    this.runtime.badgeService.NotebookView?.ShowView();
  }

  hideNotebook(): void {
    this.runtime.badgeService.NotebookView?.HideView();
  }

  addExperience(amount = 150): void {
    this.runtime.experienceController.addExperience(amount);
  }

  levelUp(): void {
    this.runtime.experienceController.levelUp();
  }

  completeQuest(questId?: string): boolean {
    const quest = questId
      ? this.runtime.questService.getQuestById(questId)
      : this.runtime.questService
          .getAllQuests()
          .find((item) => !item.isCompleted);

    if (!quest) {
      return false;
    }

    quest.Complete();
    return true;
  }

  completeAllQuests(): number {
    let completedCount = 0;
    this.runtime.questService.getAllQuests().forEach((quest) => {
      if (!quest.isCompleted) {
        quest.Complete();
        completedCount += 1;
      }
    });
    return completedCount;
  }

  collectBadge(badgeId?: string): boolean {
    const badge = badgeId
      ? this.runtime.badgeService.getBadgeById(badgeId)
      : this.runtime.badgeService
          .getAllBadges()
          .find((item) => !item.collected);

    return badge ? this.runtime.badgeService.collectBadge(badge.id) : false;
  }

  collectAllBadges(): number {
    let collectedCount = 0;
    this.runtime.badgeService.getAllBadges().forEach((badge) => {
      if (
        !badge.collected &&
        this.runtime.badgeService.collectBadge(badge.id)
      ) {
        collectedCount += 1;
      }
    });
    return collectedCount;
  }

  resetProgress(): void {
    this.runtime.questService.getAllQuests().forEach((quest) => {
      quest.isCompleted = false;
    });
    this.runtime.npcController.npcs.forEach((npc) => {
      npc.done = false;
    });
    this.runtime.badgeService.getAllCollectedBadges().forEach((badge) => {
      this.runtime.badgeService.uncollectBadge(badge.id);
    });
    this.runtime.experienceController.resetProgress();
    this.resetDialogues();
  }

  showHeroPresentation(heroId?: string): boolean {
    const hero = this.getHero(heroId);
    const dialogue = hero?.presentationDialogue;
    const dialogueView = this.runtime.dialogueController.dialogueView;

    if (!hero || !dialogue || !dialogueView) {
      return false;
    }

    this.runtime.heroController.switchHero(hero);
    dialogue.Reset();
    dialogueView.ResetForNewSpeaker(hero);
    dialogueView.ShowView();
    return true;
  }

  showNpcDialogue(npcId: string): boolean {
    const npc = this.runtime.npcController.getNpcById(npcId);
    const dialogueView = this.runtime.dialogueController.dialogueView;

    if (!npc?.presentationDialogue || !dialogueView) {
      return false;
    }

    npc.presentationDialogue.Reset();
    dialogueView.ResetForNewNPC(npc);
    dialogueView.ShowView();
    return true;
  }

  resetDialogues(): void {
    this.getDialogues().forEach((dialogue) => dialogue.Reset());
    this.runtime.dialogueController.dialogueView?.HideView();
  }

  showWelcome(): void {
    this.runtime.heroController.welcomeHeroSelectionView?.ShowView();
  }

  hideWelcome(): void {
    this.runtime.heroController.welcomeHeroSelectionView?.HideView();
  }

  state(): {
    hero: string | null;
    experience: number;
    level: number;
    questsCompleted: number;
    questsTotal: number;
    badgesCollected: number;
    badgesTotal: number;
  } {
    const quests = this.runtime.questService.getAllQuests();
    const badges = this.runtime.badgeService.getAllBadges();

    return {
      hero: this.runtime.heroController.currentHero?.name ?? null,
      experience: this.runtime.experienceController.currentExperience,
      level: this.runtime.experienceController.currentLevel,
      questsCompleted: quests.filter((quest) => quest.isCompleted).length,
      questsTotal: quests.length,
      badgesCollected: badges.filter((badge) => badge.collected).length,
      badgesTotal: badges.length,
    };
  }

  private getHero(heroId?: string): IHero | null {
    return (
      (heroId
        ? this.runtime.heroController.heroes.find((hero) => hero.id === heroId)
        : this.runtime.heroController.currentHero) ?? null
    );
  }

  private getDialogues(): IDialogue[] {
    return [
      ...this.runtime.heroController.heroes.flatMap((hero) => hero.dialogues),
      ...this.runtime.npcController.npcs.flatMap((npc) => npc.dialogues),
    ];
  }
}
