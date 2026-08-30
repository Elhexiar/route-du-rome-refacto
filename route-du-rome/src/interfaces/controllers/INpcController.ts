import type { INpc } from "#IEntities/INpc.ts";

export interface INpcController {
  npcs: INpc[];

  addNpc(npc: INpc): void;

  removeNpc(npc: INpc): void;

  getNpcById(id: string): INpc | undefined;

  getAllNpcs(): INpc[];

  onNpcsLoaded(callback: (npcs: INpc[]) => void): void;
}
