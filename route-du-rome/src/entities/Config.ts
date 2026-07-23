import type { NpcData } from "#Entities/Npc.ts";
import type { HeroData } from "#Entities/Hero.ts";

export type ConfigData = {
  Npcs: NpcData[];
  Heroes: HeroData[];
};
