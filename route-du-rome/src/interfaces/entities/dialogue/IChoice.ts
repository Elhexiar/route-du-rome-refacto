import type { IDialogueLine } from "./IDialogueLine";

/***
 *
 * @param id : string : Identifiant unique du choix
 * @param text : string : Texte du choix
 * @param onChoiceNextDialogueLine : IDialogueLine | null : Ligne de dialogue suivante si ce choix est sélectionné
 *
 * @function onChoiceMade : () => void : Callback appelé lorsque le choix est sélectionné
 *
 */

export interface IChoice {
  id: string;
  text: string;
  onChoiceNextDialogueLine: IDialogueLine | null;

  onChoiceMade: () => void;
}
