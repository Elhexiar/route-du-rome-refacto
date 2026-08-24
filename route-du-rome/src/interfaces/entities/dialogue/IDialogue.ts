import type { IDialogueOwner } from "./IDialogueOwner";
import type { IDialogueNode } from "./IDialogueNode";

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
 * @function CompleteDialogue : void : Termine le dialogue et déclenche ses actions de fin
 *
 */

export interface IDialogue {
  readonly id: string;
  readonly owner: IDialogueOwner | undefined;
  readonly isCompleted: boolean;
  readonly isActive: boolean;
  readonly currentLineDepth: number;
  readonly currentChoiceDepth: number;
  readonly rootNode: IDialogueNode | undefined;
  readonly currentNode: IDialogueNode | undefined;

  AddAction(
    actionID: string,
    actionType: "OnStartText" | "OnEndText",
    action: () => void,
  ): void;
  readonly OnDialogueActions: (() => void)[];
  CompleteDialogue: () => void;
  Continue: () => boolean;
  Choose: (choiceID?: string, choiceIndex?: number) => void;
  ImportDialogueFromJSON: (json: unknown) => IDialogue | null;
}
