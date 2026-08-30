import { afterEach, describe, expect, it, vi } from "vitest";

import { GameManager } from "#Controllers/GameManager.ts";
import { NPCBadge } from "#Entities/NPCBadge.ts";
import { BadgeService } from "#Services/BadgeService.ts";

describe("BadgeService", () => {
  afterEach(() => {
    GameManager.resetForTests();
    vi.unstubAllGlobals();
  });

  it("creates, fetches and collects badges in the runtime registry", () => {
    const service = new BadgeService();
    const badge = new NPCBadge(
      { id: "npc-1", color: "#406BDE" } as any,
      "badge-1",
      "Badge de Morgane",
      "Badge de la marraine du port",
      "🏅",
    );
    const callback = vi.fn();

    service.onBadgeCollected(callback);
    service.createBadge(badge);

    expect(service.getBadgeById("badge-1")).toBe(badge);
    expect(service.getAllBadges()).toEqual([badge]);
    expect(service.getAllCollectedBadges()).toEqual([]);

    expect(service.collectBadge("badge-1")).toBe(true);
    expect(badge.collected).toBe(true);
    expect(service.collectedBadges.has("badge-1")).toBe(true);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(service.getAllCollectedBadges()).toEqual([badge]);
  });

  it("refuses to collect the same badge twice and supports uncollection", () => {
    const service = new BadgeService();
    const badge = new NPCBadge(
      { id: "npc-2", color: "#8B5BB8" } as any,
      "badge-2",
      "Badge de Sarah",
      "Badge agricole",
      "🌾",
    );
    const callback = vi.fn();

    service.onBadgeUncollected(callback);
    service.createBadge(badge);

    expect(service.collectBadge("badge-2")).toBe(true);
    expect(service.collectBadge("badge-2")).toBe(false);

    expect(service.uncollectBadge("badge-2")).toBe(true);
    expect(badge.collected).toBe(false);
    expect(service.collectedBadges.has("badge-2")).toBe(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("updates and deletes badge entries from the registry", () => {
    const service = new BadgeService();
    const badge = new NPCBadge(
      { id: "npc-3", color: "#C0FFEE" } as any,
      "badge-3",
      "Badge de Jules",
      "Badge de fabrication",
      "🔧",
    );

    service.createBadge(badge);
    const updated = service.updateBadge("badge-3", { name: "Badge modifié" });

    expect(updated?.name).toBe("Badge modifié");
    expect(service.deleteBadge("badge-3")).toBe(true);
    expect(service.getBadgeById("badge-3")).toBeNull();
  });

  it("accepts an explicit runtime context instead of relying on singleton globals", () => {
    const runtime = { app: null };

    const service = new BadgeService(runtime);
    const badge = new NPCBadge(
      { id: "npc-4", color: "#ABCDEF" } as any,
      "badge-4",
      "Badge Runtime",
      "Badge with explicit runtime",
      "⭐",
    );

    service.createBadge(badge);
    expect(service.getBadgeById("badge-4")).toBe(badge);
    expect(service.collectBadge("badge-4")).toBe(true);
    expect(badge.collected).toBe(true);
  });
});
