import type { DialogueNodeJSON } from "./IDialogueNode";

/***
 *
 * @param id : string : Identifiant unique du choix
 * @param text : string : Texte du choix
 *
 *
 */

export interface IChoice {
  id: string;
  text: string;
  actionID?: string;
  next?: DialogueNodeJSON | undefined;
}
