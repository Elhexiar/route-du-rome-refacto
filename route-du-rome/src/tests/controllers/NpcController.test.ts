import { describe, expect, it, vi } from "vitest";

import { NpcController } from "#Controllers/NpcController.ts";
import { Npc } from "#Entities/Npc.ts";

describe("NpcController", () => {
  it("adds, finds and removes NPCs from the registry", () => {
    const controller = Object.create(NpcController.prototype) as NpcController;
    controller.npcs = [];
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

    controller.addNpc(npcA);
    controller.addNpc(npcB);
    controller.removeNpc(npcA);

    expect(controller.getAllNpcs()).toHaveLength(1);
    expect(controller.getNpcById("npc-2")).toBe(npcB);
    expect(controller.getNpcById("npc-1")).toBeUndefined();
  });

  it("notifies when NPCs are loaded", () => {
    const controller = Object.create(NpcController.prototype) as NpcController;
    controller.npcs = [];
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

    controller.npcs.push(npc);
    controller["onNpcsLoadedCallbacks"].forEach((callback) =>
      callback(controller.npcs),
    );

    expect(onLoaded).toHaveBeenCalledWith([npc]);
  });

  it("loads NPCs through the canonical API contract", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          Npcs: [
            {
              id: "npc-4",
              name: "Dorian",
              color: "#abcdef",
              job: "Chaudronnier",
              jobSector: "Industrie",
              icon: "🔥",
              portrait: "/dorian.png",
              latitude: 48.9,
              longitude: -2.1,
              relatedQuests: [],
              backgroundVideo: "/dorian.mp4",
              jobVideoUrl: "https://example.test/video4",
              videoTitle: "Métier local",
              presentationDialogue: null,
            },
          ],
          Heroes: [],
          Levels: [],
        }),
      }),
    );

    const controller = Object.create(NpcController.prototype) as NpcController;
    controller.npcs = [];
    controller["onNpcsLoadedCallbacks"] = [];

    await controller.LoadNpcsFromConfig("/config.json");

    expect(controller.npcs).toHaveLength(1);
    expect(controller.npcs[0].id).toBe("npc-4");
  });
});
