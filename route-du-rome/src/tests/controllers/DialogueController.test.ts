import { describe, expect, it, vi } from "vitest";

import { DialogueController } from "#Controllers/DialogueController.ts";
import { GameManager } from "#Controllers/GameManager.ts";

describe("DialogueController", () => {
  it("registers NPC and hero dialogue hooks without needing a real view", () => {
    GameManager.resetForTests();

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

    GameManager.npcController = {
      onNpcsLoaded: (callback: (npcs: any[]) => void) => callback([npc]),
    } as any;
    GameManager.heroController = {
      onHeroesSwitched: (callback: (hero: any) => void) => callback(hero),
    } as any;
    GameManager.mapController = {
      mapView: { onNpcMarkerClick: npcOnClick },
    } as any;

    const controller = new DialogueController(null);

    expect(npc.presentationDialogue.OnDialogueActions).toHaveLength(1);
    expect(GameManager.mapController?.mapView.onNpcMarkerClick).toBeDefined();
    expect(controller.currentActiveDialogue).toBeNull();
  });
});
