import type { IDialogueController } from "#IControllers/IDialogueController";
import { DialogueView } from "#src/ui/dialogue/DialogueView.ts";
import { GameManager } from "./GameManager.ts";
import type { IDialogue, IDialogueNode } from "../interfaces/entities";

export class DialogueController implements IDialogueController {
  dialogueRegistry: Map<string, IDialogue>;
  currentActiveDialogue: IDialogue | null | undefined;
  currentActiveNode: IDialogueNode | null;

  dialogueView: DialogueView | null = null;

  constructor(app: HTMLElement | null = null) {
    this.dialogueRegistry = new Map<string, IDialogue>();
    this.currentActiveDialogue = null;
    this.currentActiveNode = null;

    this.dialogueView = app ? new DialogueView(app as HTMLElement) : null;

    GameManager.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        // add an action to the dialogue to hide the view when the dialogue ends
        npc.presentationDialogue?.OnDialogueActions?.push(() => {
          this.dialogueView?.jobPresentationView?.ShowView();
        });

        //
        GameManager.mapController?.mapView?.onNpcMarkerClick(npc, () => {
          if (npc.presentationDialogue?.isCompleted) {
            console.log(`Dialogue for NPC ${npc.name} is already completed.`);
            return;
          }

          this.dialogueView?.ResetForNewNPC(npc);
          this.dialogueView?.ShowView();
        });
      });
    });

    GameManager.heroController?.onHeroesSwitched((hero) => {
      if (!hero?.presentationDialogue) {
        return;
      }

      hero.presentationDialogue.OnDialogueActions?.push(() => {
        this.dialogueView?.HideView();
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
