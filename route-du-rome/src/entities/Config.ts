import type { NpcData } from "#Entities/Npc.ts";
import type { HeroData } from "#Entities/Hero.ts";

export type LevelData = {
  id: string;
  name: string;
  description: string;
  icon: string;
  min: number;
  max: number;
};

export type ConfigData = {
  Npcs: NpcData[];
  Heroes: HeroData[];
  Levels: LevelData[];
};
