import type { IDialogue } from "#IEntities/dialogue/IDialogue";

export interface IDialogueView {
  dialogue: IDialogue | null;

  showDialogue(node: any): void;
  hideDialogue(): void;
  updateDialogue(node: any): void;
  onChoiceSelected(callback: (choiceId: string) => void): void;

  ShowView(): void;
  HideView(): void;
  ToggleView(): void;
}
