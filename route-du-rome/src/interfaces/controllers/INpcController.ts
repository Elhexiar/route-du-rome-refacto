import type { INpc } from "#IEntities/INpc.ts";

export interface INpcController {
  npcs: INpc[];

  addNpc(npc: INpc): void;
  AddNpc(npc: INpc): void;

  removeNpc(npc: INpc): void;
  RemoveNpc(npc: INpc): void;

  getNpcById(id: string): INpc | undefined;
  GetNpcById(id: string): INpc | undefined;

  getAllNpcs(): INpc[];
  GetAllNpcs(): INpc[];

  onNpcsLoaded(callback: (npcs: INpc[]) => void): void;
}
