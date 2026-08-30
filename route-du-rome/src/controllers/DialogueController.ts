import type { IDialogueController } from "#IControllers/IDialogueController";
import type { IExperienceController } from "#IControllers/index.ts";
import { DialogueView } from "#src/ui/dialogue/DialogueView.ts";
import type { IDialogue, IDialogueNode, INpc } from "../interfaces/entities";

export class DialogueController implements IDialogueController {
  dialogueRegistry: Map<string, IDialogue>;
  currentActiveDialogue: IDialogue | null | undefined;
  currentActiveNode: IDialogueNode | null;

  dialogueView: DialogueView | null = null;

  // cache the runtime controllers to avoid repeated access to GameManager
  private readonly runtime: {
    npcController?: {
      onNpcsLoaded: (callback: (npcs: any[]) => void) => void;
    } | null;
    heroController?: {
      onHeroesSwitched: (callback: (hero: any) => void) => void;
    } | null;
    mapController?: {
      mapView?: { onNpcMarkerClick: (npc: any, callback: () => void) => void };
    } | null;
    experienceController?: IExperienceController | null;
  };

  constructor(
    app: HTMLElement | null = null,
    runtime: {
      npcController?: {
        onNpcsLoaded: (callback: (npcs: any[]) => void) => void;
      } | null;
      heroController?: {
        onHeroesSwitched: (callback: (hero: any) => void) => void;
      } | null;
      mapController?: {
        mapView?: {
          onNpcMarkerClick: (npc: any, callback: () => void) => void;
        };
      } | null;
      experienceController?: IExperienceController | null;
    } | null = null,
  ) {
    this.dialogueRegistry = new Map<string, IDialogue>();
    this.currentActiveDialogue = null;
    this.currentActiveNode = null;
    this.runtime = runtime ?? {};

    this.dialogueView = app
      ? new DialogueView(app as HTMLElement, {
          experienceController: this.runtime.experienceController,
          dialogueController: this,
        })
      : null;

    this.runtime.npcController?.onNpcsLoaded((npcs) => {
      npcs.forEach((npc) => {
        // add an action to the dialogue to hide the view when the dialogue ends
        npc.presentationDialogue?.OnDialogueActions?.push(() => {
          this.dialogueView?.jobPresentationView?.ShowView();
        });

        this.runtime.mapController?.mapView?.onNpcMarkerClick(npc, () => {
          if (npc.presentationDialogue?.isCompleted) {
            console.log(`Dialogue for NPC ${npc.name} is already completed.`);
            return;
          }

          this.dialogueView?.ResetForNewNPC(npc);
          this.dialogueView?.ShowView();
        });
      });
    });

    this.runtime.heroController?.onHeroesSwitched((hero) => {
      if (!hero?.presentationDialogue) {
        return;
      }

      hero.presentationDialogue.OnDialogueActions?.push(() => {
        this.dialogueView?.HideView();
      });
    });
  }

  importDialogueFromJsonFile(_filePath: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  ImportDialogueFromJSONFile(_filePath: string): Promise<void> {
    return this.importDialogueFromJsonFile(_filePath);
  }

  importDialogueFromJsonNode(_dialogueNodeJSON: any): void {
    throw new Error("Method not implemented.");
  }

  ImportDialogueFromJSONNode(_dialogueNodeJSON: any): void {
    this.importDialogueFromJsonNode(_dialogueNodeJSON);
  }

  ToggleNpcDialogueView(_npcId: string, _node: IDialogueNode): void {}

  completeQuestForSpeaker(npc: INpc): void {
    this.runtime.experienceController?.questService.quests
      .get(`${npc.id}-default`)
      ?.Complete();
  }
}
