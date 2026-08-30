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

  it("removes a once listener when it throws", () => {
    const eventBus = new EventBus();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {
      return undefined;
    });
    const listener = vi.fn(() => {
      throw new Error("listener failure");
    });

    eventBus.once(AppEvents.GAME_STARTED, listener);
    eventBus.emit({ type: AppEvents.GAME_STARTED, data: {} });
    eventBus.emit({ type: AppEvents.GAME_STARTED, data: {} });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(eventBus.listenerCount(AppEvents.GAME_STARTED)).toBe(0);
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
