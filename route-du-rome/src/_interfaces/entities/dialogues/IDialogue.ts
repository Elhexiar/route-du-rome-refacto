import type { IDialogueOwner } from "./IDialogueOwner";
import type { IDialogueLine } from "./IDialogueLine";
import type { IChoice } from "./IChoice";

export interface IDialogue {
  id: string;
  owner: IDialogueOwner;
  isCompleted: boolean;
  isActive: boolean;
  currentLineIndex: number;
  currentChoiceIndex: number;
  lines: IDialogueLine[];

  getCurrentLine(): IDialogueLine | undefined;
  getCurrentChoice(): IChoice | undefined;
  Continue(): void;
  Choose(choiceIndex: number): void;
  Choose(choice: IChoice): void;
  onDialogueCompleted: () => void;
}
