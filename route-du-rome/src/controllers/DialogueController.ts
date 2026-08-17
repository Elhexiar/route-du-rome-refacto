import type { IDialogueController } from "#IControllers/IDialogueController";
import { NPCDialogueView } from "#UI/dialogue/NPCDialogueView";
import { GameManager } from ".";
import type { IDialogue, IDialogueNode } from "../interfaces/entities";

export class DialogueController implements IDialogueController {
  dialogueRegistry: Map<string, IDialogue>;
  currentActiveDialogue: IDialogue | null | undefined;
  currentActiveNode: IDialogueNode | null;

  // rather than building a new dialogue view for each NPC, we can reuse the same view
  //   and just update its content based on the current NPC
  npcDialogueViews: NPCDialogueView | null = null;
  // same for the hero dialogue view, we can reuse the same view
  //   and just update its content based on the current hero

  constructor(app: HTMLElement | null = null) {
    this.dialogueRegistry = new Map<string, IDialogue>();
    this.currentActiveDialogue = null;
    this.currentActiveNode = null;

    this.npcDialogueViews = app
      ? new NPCDialogueView(app as HTMLElement)
      : null;

    GameManager.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        GameManager.mapController?.mapView?.onNpcMarkerClick(npc, () => {
          this.currentActiveDialogue = npc.presentationDialogue;

          this.npcDialogueViews?.ResetForNewNPC(npc);
          this.npcDialogueViews?.ShowView();
        });
      });
    });
  }

  ImportDialogueFromJSONFile(_filePath: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  ImportDialogueFromJSONNode(_dialogueNodeJSON: any): void {
    throw new Error("Method not implemented.");
  }

  ToggleNpcDialogueView(_npcId: string, _node: IDialogueNode): void {}
}
