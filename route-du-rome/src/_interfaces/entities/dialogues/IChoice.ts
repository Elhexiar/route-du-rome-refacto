import type { IDialogueLine } from "./IDialogueLine";

export interface IChoice {
  id: string;
  text: string;
  onChoiceNextDialogueLine: IDialogueLine | null;

  onChoiceMade: () => void;
}
