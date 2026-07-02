import type { IDialogue } from "./dialogues/IDialogue";
import type { IDialogueOwner } from "./dialogues/IDialogueOwner";

export interface INpc extends IDialogueOwner {
  id: string;
  name: string;
  icon: string;
  job: string;
  portrait: string;
  lattitude: number;
  longitude: number;
  presentationVideo: string;
  presentationDialogue: IDialogue;
}
