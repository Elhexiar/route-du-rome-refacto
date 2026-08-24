import type { IDialogueNode } from "./IDialogueNode";

/***
 *
 * @param id : string : Identifiant unique du choix
 * @param text : string : Texte du choix
 *
 *
 */

export interface IChoice {
  root: IDialogueNode | null;
  parent: IDialogueNode | IChoice | null;
  id: string;
  text: string;
  actionID?: string;
  actions?: (() => void)[];
  next: IDialogueNode | null;

  select(): IDialogueNode | null;
}
