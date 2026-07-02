import type { IDialogue } from "./dialogues/IDialogue";
import type { IDialogueOwner } from "./dialogues/IDialogueOwner";

export interface IHero extends IDialogueOwner {
  id: string;
  name: string;
  role: string;
  description: string;
  bio: string;
  presentationDialogue: IDialogue;
  portrait: string;
  presentationVideo: string;
}
