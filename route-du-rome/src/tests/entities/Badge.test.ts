import { describe, expect, it, vi } from "vitest";

import { NPCBadge } from "#Entities/NPCBadge.ts";

describe("NPCBadge", () => {
  it("starts locked, can unlock once, and runs unlock actions exactly once", () => {
    const npc = {
      id: "npc-1",
      name: "Morgane",
      color: "#406BDE",
    } as any;
    const badge = new NPCBadge(npc, "badge-1", "Badge Morgane", "Badge description", "🏅");
    const onUnlock = vi.fn();

    badge.onUnlock.push(onUnlock);

    expect(badge.checkUnlockCondition()).toBe(true);
    expect(badge.collected).toBe(false);

    badge.Unlock();
    badge.Unlock();

    expect(badge.collected).toBe(true);
    expect(badge.color).toBe("#406BDE");
    expect(onUnlock).toHaveBeenCalledTimes(1);
  });
});
