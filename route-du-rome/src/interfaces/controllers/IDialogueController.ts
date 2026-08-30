import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { IDialogueNode } from "#IEntities/dialogue/IDialogueNode";
import type { IHero } from "#IEntities/IHero";
import type { INpc } from "#IEntities/INpc";

export interface IDialogueController {
  importDialogueFromJsonFile(filePath: string): Promise<void>;
  ImportDialogueFromJSONFile(filePath: string): Promise<void>;

  importDialogueFromJsonNode(dialogueNodeJSON: any): void;
  ImportDialogueFromJSONNode(dialogueNodeJSON: any): void;

  // Dialogues can be accessed by their unique ID or from their respective owner.
  dialogueRegistry: Map<string, IDialogue>;
  currentActiveDialogue: IDialogue | null | undefined;
  currentActiveNode: IDialogueNode | null | undefined;
  dialogueView: {
    ResetForNewSpeaker(speaker: INpc | IHero): void;
    ResetForNewNPC(npc: INpc): void;
    ShowView(): void;
    HideView(): void;
  } | null;
}
