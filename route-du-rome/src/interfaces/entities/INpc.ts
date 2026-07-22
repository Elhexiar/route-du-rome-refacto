import type { IDialogue } from "./dialogue/IDialogue";
import type { IDialogueOwner } from "./dialogue/IDialogueOwner";

export interface INpc extends IDialogueOwner {
  id: string;
  name: string;
  icon: string;
  job: string;
  color: string;
  portrait: string;
  lattitude: number;
  longitude: number;
  presentationVideo: string;
  presentationDialogue: IDialogue | null;
  done: boolean;
  accessible: boolean;
}
