import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { IDialogueNode } from "#IEntities/dialogue/IDialogueNode";

export interface IDialogueController {
  ImportDialogueFromJSONFile(filePath: string): Promise<void>;
  ImportDialogueFromJSONNode(dialogueNodeJSON: any): void;

  // Dialogues can be accesed by their unique ID, or from their respective owner (e.g. Hero, NPC, etc.)
  dialogueRegistry: Map<string, IDialogue>;
  currentActiveDialogue: IDialogue | null | undefined;
  currentActiveNode: IDialogueNode | null | undefined;
}
