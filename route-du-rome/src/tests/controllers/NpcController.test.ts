import { describe, expect, it, vi } from "vitest";

import { NpcController } from "#Controllers/NpcController.ts";
import { Npc } from "#Entities/Npc.ts";

describe("NpcController", () => {
  it("adds, finds and removes NPCs from the registry", () => {
    const controller = Object.create(NpcController.prototype) as NpcController;
    controller.Npcs = [];
    controller["onNpcsLoadedCallbacks"] = [];

    const npcA = new Npc(
      "npc-1",
      "Alice",
      "#123456",
      "Fermière",
      "Agriculture",
      "🌾",
      "/alice.png",
      48.6,
      -1.8,
      "/alice.mp4",
      "https://example.test/video",
      "Agriculture en Bretagne",
      null,
      [],
    );
    const npcB = new Npc(
      "npc-2",
      "Bob",
      "#654321",
      "Boulanger",
      "Alimentation",
      "🥖",
      "/bob.png",
      48.7,
      -1.7,
      "/bob.mp4",
      "https://example.test/video2",
      "Pain maison",
      null,
      [],
    );

    controller.AddNpc(npcA);
    controller.AddNpc(npcB);
    controller.RemoveNpc(npcA);

    expect(controller.GetAllNpcs()).toHaveLength(1);
    expect(controller.GetNpcById("npc-2")).toBe(npcB);
    expect(controller.GetNpcById("npc-1")).toBeUndefined();
  });

  it("notifies when NPCs are loaded", () => {
    const controller = Object.create(NpcController.prototype) as NpcController;
    controller.Npcs = [];
    controller["onNpcsLoadedCallbacks"] = [];
    const onLoaded = vi.fn();

    controller.onNpcsLoaded(onLoaded);
    const npc = new Npc(
      "npc-3",
      "Cora",
      "#abcdef",
      "Pecheuse",
      "Maritime",
      "⚓",
      "/cora.png",
      48.8,
      -2.0,
      "/cora.mp4",
      "https://example.test/video3",
      "Pêche locale",
      null,
      [],
    );

    controller.Npcs.push(npc);
    controller["onNpcsLoadedCallbacks"].forEach((callback) =>
      callback(controller.Npcs),
    );

    expect(onLoaded).toHaveBeenCalledWith([npc]);
  });
});
