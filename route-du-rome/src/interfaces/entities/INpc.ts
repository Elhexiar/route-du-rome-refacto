import type { IDialogue } from "./dialogue/IDialogue";
import type { IDialogueOwner } from "./dialogue/IDialogueOwner";
import type { IQuest } from "./IQuest";

export interface INpc extends IDialogueOwner {
  id: string;
  name: string;
  icon: string;
  job: string;
  jobSector: string;
  color: string;
  portrait: string;
  latitude: number;
  longitude: number;
  relatedQuests: IQuest[];
  backgroundVideo: string;
  jobVideoUrl: string;
  videoTitle: string;
  presentationDialogue: IDialogue | null;
  done: boolean;
  accessible: boolean;
}
