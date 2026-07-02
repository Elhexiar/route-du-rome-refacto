import type { IChoice } from "./IChoice";

export interface IDialogueLine {
  id: string;
  text: string;
  hasChoice: boolean;
  choices: IChoice[];
  onBeginDisplayLine: () => void;
  onEndDisplayLine: () => void;
}
