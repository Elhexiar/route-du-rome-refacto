import type { IBadge } from "#IEntities/IBadge.ts";
import type { INpc } from "#IEntities/INpc.ts";

export class NPCBadge implements IBadge {
  relatedNPC: INpc;
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;

  collected: boolean = false;

  onUnlock: (() => void)[] = [];

  constructor(
    relatedNPC: INpc,
    id: string,
    name: string,
    description: string,
    icon: string,
  ) {
    this.relatedNPC = relatedNPC;
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.color = relatedNPC.color; // Assign the color from the related NPC
  }

  // simple always true for now, can be extended later
  checkUnlockCondition(): boolean {
    return true;
  }

  Unlock(): void {
    if (this.collected) {
      return;
    }
    this.collected = true;
    this.onUnlock.forEach((action) => action());
  }
}
