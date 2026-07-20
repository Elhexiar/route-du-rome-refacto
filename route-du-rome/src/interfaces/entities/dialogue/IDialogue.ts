import type { IDialogueOwner } from "./IDialogueOwner";
import type { DialogueNodeJSON } from "./IDialogueNode";

/***
 *
 * @param id : string : Identifiant unique du dialogue
 * @param owner : IDialogueOwner : Propriétaire du dialogue (Héros ou PNJ)
 * @param isCompleted : boolean : Indique si le dialogue est terminé
 * @param isActive : boolean : Indique si le dialogue est actif
 * @param currentLineDepth : number : Profondeur du niveau de la ligne de dialogue actuelle
 * @param currentChoiceDepth : number : Profondeur du niveau du choix actuel
 *
 * @function Continue : void : Passe à la ligne de dialogue suivante
 * @function Choose : void : Selectionne un choix par son identifiant ou son index et passe à la ligne de dialogue suivante
 * @function onDialogueCompleted : () => void : Callback appelé lorsque le dialogue est terminé
 *
 */

export interface IDialogue {
  readonly id: string;
  readonly owner: IDialogueOwner | undefined;
  readonly isCompleted: boolean;
  readonly isActive: boolean;
  readonly currentLineDepth: number;
  readonly currentChoiceDepth: number;
  readonly rootNode: DialogueNodeJSON | undefined;
  readonly currentNode: DialogueNodeJSON | undefined;

  AddAction(actionID: string, actionType: "OnStartText" | "OnEndText"): void;
  readonly OnDialogueCompleted: () => void;
  Continue: () => void;
  Choose: (choiceID?: string, choiceIndex?: number) => void;
  ImportDialogueFromJSON: (json: unknown) => IDialogue | null;
}
