import type { IQuestService, IBadgeService } from "#IServices/index";
import type { LevelData } from "#src/entities/Config.ts";

export interface IExperienceController {
  questService: IQuestService;
  badgeService: IBadgeService;

  currentExperience: number;
  curentExperience: number;
  currentLevel: number;
  currentExperienceLimit: number;

  setLevelData(levels: LevelData[]): void;
  getCurrentLevelDefinition(): LevelData | undefined;
  addExperience(amount: number): void;
  levelUp(): void;
  checkLevelUp(): boolean;
}
