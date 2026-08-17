import { describe, expect, it } from "vitest";
import { GameManager } from "../../controllers/GameManager";

describe("GameManager", () => {
  it("exposes a singleton instance", () => {
    expect(GameManager.instance).toBe(GameManager.instance);
  });

  it("exposes controller properties through static accessors", () => {
    GameManager.resetForTests();
    const manager = GameManager.instance;

    expect(GameManager.heroController).toBe(manager["_heroController"]);
    expect(GameManager.npcController).toBe(manager["_npcController"]);
  });
});
