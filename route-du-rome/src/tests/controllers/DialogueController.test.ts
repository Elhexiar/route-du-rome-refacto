import { describe, expect, it, vi } from "vitest";

import { DialogueController } from "#Controllers/DialogueController.ts";

describe("DialogueController", () => {
  it("registers NPC and hero dialogue hooks without needing a real view", () => {
    const npcOnClick = vi.fn();
    const npc = {
      id: "npc-1",
      name: "Nina",
      presentationDialogue: {
        isCompleted: false,
        OnDialogueActions: [],
      },
    } as any;
    const hero = {
      id: "hero-1",
      name: "Hugo",
      presentationDialogue: {
        OnDialogueActions: [],
      },
    } as any;

    const controller = new DialogueController(null, {
      npcController: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) => callback([npc]),
      },
      heroController: {
        onHeroesSwitched: (callback: (hero: any) => void) => callback(hero),
      },
      mapController: {
        mapView: { onNpcMarkerClick: npcOnClick },
      },
    });

    expect(npc.presentationDialogue.OnDialogueActions).toHaveLength(1);
    expect(npcOnClick).toHaveBeenCalledTimes(1);
    expect(controller.currentActiveDialogue).toBeNull();
  });

  it("accepts an explicit runtime context instead of relying on the singleton globals", () => {
    const npcOnClick = vi.fn();
    const npc = {
      id: "npc-2",
      name: "Lina",
      presentationDialogue: {
        isCompleted: false,
        OnDialogueActions: [],
      },
    } as any;
    const hero = {
      id: "hero-2",
      name: "Ari",
      presentationDialogue: {
        OnDialogueActions: [],
      },
    } as any;

    const runtime = {
      npcController: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) => callback([npc]),
      },
      heroController: {
        onHeroesSwitched: (callback: (hero: any) => void) => callback(hero),
      },
      mapController: {
        mapView: { onNpcMarkerClick: npcOnClick },
      },
    } as any;

    const controller = new DialogueController(null, runtime);

    expect(npc.presentationDialogue.OnDialogueActions).toHaveLength(1);
    expect(npcOnClick).toHaveBeenCalledTimes(1);
    expect(controller.currentActiveDialogue).toBeNull();
  });
});
