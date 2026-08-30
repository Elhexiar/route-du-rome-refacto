import type { IQuestService, IBadgeService } from "#IServices/index";

export interface IExperienceController {
  questService: IQuestService;
  badgeService: IBadgeService;

  currentExperience: number;
  curentExperience: number;
  currentLevel: number;
  currentExperienceLimit: number;

  addExperience(amount: number): void;
  levelUp(): void;
  checkLevelUp(): boolean;
}
