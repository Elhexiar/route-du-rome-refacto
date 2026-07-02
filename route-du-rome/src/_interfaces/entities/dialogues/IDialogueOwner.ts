import type { IDialogue } from "./IDialogue";

export interface IDialogueOwner {
  id: string;
  name: string;
  dialogues: IDialogue[];

  addDialogue(dialogue: IDialogue): this; // Add a dialogue to the owner and return the owner instance for chaining
  removeDialogue(dialogue: IDialogue): void;
  removeDialogueById(dialogueId: string): void;
  getDialogueById(dialogueId: string): IDialogue | undefined;
  getAllDialogues(): IDialogue[];
}
