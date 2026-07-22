import type { IDialogueOwner } from "./IDialogueOwner";
import type { IDialogueLine } from "./IDialogueLine";

/***
 *
 * @param id : string : Identifiant unique du dialogue
 * @param owner : IDialogueOwner : Propriétaire du dialogue (Héros ou PNJ)
 * @param isCompleted : boolean : Indique si le dialogue est terminé
 * @param isActive : boolean : Indique si le dialogue est actif
 * @param currentLineIndex : number : Index de la ligne de dialogue actuelle
 * @param currentChoiceIndex : number : Index du choix actuel
 * @param lines : IDialogueLine[] : Liste des lignes de dialogue
 *
 * @function getCurrentLine : IDialogueLine | undefined : Retourne la ligne de dialogue actuelle
 * @function getCurrentChoice : IChoice | undefined : Retourne le choix actuel
 * @function Continue : void : Passe à la ligne de dialogue suivante
 * @function Choose : void : Sélectionne un choix et passe à la ligne de dialogue suivante
 * @function onDialogueCompleted : () => void : Callback appelé lorsque le dialogue est terminé
 *
 */

export interface IDialogue {
  id: string;
  owner: IDialogueOwner | undefined;
  isCompleted: boolean;
  isActive: boolean;
  currentLineLevelIndex: number;
  currentChoiceLevelIndex: number;
  rootLine: IDialogueLine | undefined;
  currentLine: IDialogueLine | undefined;
}
