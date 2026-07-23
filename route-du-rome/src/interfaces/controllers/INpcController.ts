import type { INpc } from "#IEntities/INpc.ts";

export interface INpcController {
  Npcs: INpc[];

  AddNpc(npc: INpc): void;
  RemoveNpc(npc: INpc): void;
  GetNpcById(id: string): INpc | undefined;
  GetAllNpcs(): INpc[];

  onNpcsLoaded(callback: (npcs: INpc[]) => void): void;
}
