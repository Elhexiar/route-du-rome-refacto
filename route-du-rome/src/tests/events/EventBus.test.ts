import { afterEach, describe, expect, it, vi } from "vitest";
import { AppEvents } from "../../events/AppEvents";
import { EventBus } from "../../events/EventBus";

describe("EventBus", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("invokes a once listener only once and removes it", () => {
    const eventBus = new EventBus();
    const listener = vi.fn();

    eventBus.once(AppEvents.BADGE_COLLECTED, listener);
    eventBus.emit({
      type: AppEvents.BADGE_COLLECTED,
      data: { badgeId: "badge-1" },
    });
    eventBus.emit({
      type: AppEvents.BADGE_COLLECTED,
      data: { badgeId: "badge-2" },
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(eventBus.listenerCount(AppEvents.BADGE_COLLECTED)).toBe(0);
  });

  it("adds a timestamp when an event does not provide one", () => {
    const eventBus = new EventBus();
    const listener = vi.fn();
    const event = {
      type: AppEvents.GAME_ENDED,
      data: {},
    } as const;

    eventBus.on(AppEvents.GAME_ENDED, listener);
    eventBus.emit(event);

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AppEvents.GAME_ENDED,
        timestamp: expect.any(Number),
      }),
    );
  });
});
