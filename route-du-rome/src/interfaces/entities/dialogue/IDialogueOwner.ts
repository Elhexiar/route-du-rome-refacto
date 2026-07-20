import type { IDialogue } from "./IDialogue";

export interface IDialogueOwner {
  dialogues: IDialogue[];
  currentActiveDialogue: IDialogue | undefined;
}
