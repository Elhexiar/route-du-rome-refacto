import type { IExperienceController } from "#IControllers/IExperienceController.ts";
import type { IQuestService, IBadgeService } from "../interfaces/services";

export class ExperienceController implements IExperienceController {
  questService: IQuestService;
  badgeService: IBadgeService;
  curentExperience = 0;
  currentLevel = 1;
  currentExperienceLimit = 100;

  constructor(questService: IQuestService, badgeService: IBadgeService) {
    this.questService = questService;
    this.badgeService = badgeService;
  }

  addExperience(_amount: number): void {
    throw new Error("Method not implemented.");
  }

  levelUp(): void {
    throw new Error("Method not implemented.");
  }

  checkLevelUp(): boolean {
    throw new Error("Method not implemented.");
  }
}
