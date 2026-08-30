import type { IExperienceController } from "#IControllers/IExperienceController.ts";
import type { LevelData } from "#src/entities/Config.ts";
import type { IQuestService, IBadgeService } from "../interfaces/services";

export class ExperienceController implements IExperienceController {
  questService: IQuestService;
  badgeService: IBadgeService;
  currentExperience = 0;
  currentLevel = 1;
  currentExperienceLimit = 150;
  private levelData: LevelData[] = [];

  get curentExperience(): number {
    return this.currentExperience;
  }

  set curentExperience(value: number) {
    this.currentExperience = value;
    this.syncLevelFromExperience();
  }

  constructor(questService: IQuestService, badgeService: IBadgeService) {
    this.questService = questService;
    this.badgeService = badgeService;
    this.syncLevelFromExperience();
  }

  setLevelData(levels: LevelData[]): void {
    this.levelData = [...levels].sort((a, b) => a.min - b.min);
    this.syncLevelFromExperience();
  }

  getCurrentLevelDefinition(): LevelData | undefined {
    if (this.levelData.length === 0) {
      return undefined;
    }

    const activeLevelIndex = this.getLevelIndexForExperience(
      this.currentExperience,
    );
    return this.levelData[activeLevelIndex];
  }

  private getLevelIndexForExperience(experience: number): number {
    if (this.levelData.length === 0) {
      return 0;
    }

    for (let index = this.levelData.length - 1; index >= 0; index -= 1) {
      if (experience >= this.levelData[index].min) {
        return index;
      }
    }

    return 0;
  }

  private syncLevelFromExperience(): void {
    if (this.levelData.length === 0) {
      this.currentLevel = 1;
      this.currentExperienceLimit = Math.max(150, this.currentExperienceLimit);
      return;
    }

    const levelIndex = this.getLevelIndexForExperience(this.currentExperience);
    const activeLevel = this.levelData[levelIndex];
    this.currentLevel = levelIndex + 1;
    this.currentExperienceLimit =
      activeLevel?.max ?? this.currentExperienceLimit;
  }

  addExperience(amount: number): void {
    if (amount <= 0) {
      return;
    }

    this.currentExperience += amount;
    this.syncLevelFromExperience();
  }

  levelUp(): void {
    if (this.levelData.length === 0) {
      this.currentLevel += 1;
      this.currentExperienceLimit = Math.round(
        this.currentExperienceLimit * 1.4,
      );
      return;
    }

    const currentIndex = this.getLevelIndexForExperience(
      this.currentExperience,
    );
    const nextLevel = this.levelData[currentIndex + 1];

    if (!nextLevel) {
      return;
    }

    this.currentLevel = currentIndex + 2;
    this.currentExperienceLimit = nextLevel.max;
  }

  checkLevelUp(): boolean {
    if (this.levelData.length === 0) {
      return this.currentExperience >= this.currentExperienceLimit;
    }

    const currentIndex = this.getLevelIndexForExperience(
      this.currentExperience,
    );
    const nextLevel = this.levelData[currentIndex + 1];

    return !!nextLevel && this.currentExperience >= nextLevel.min;
  }
}
