import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { IDialogueLine } from "#src/interfaces/entities/dialogue/IDialogueLine.ts";
import type { IDialogueOwner } from "#src/interfaces/entities/dialogue/IDialogueOwner.ts";

/**
 * Implements {@link IDialogue}
 *
 * @param id? : string : Identifiant unique du dialogue
 * @param owner : IDialogueOwner : Propriétaire du dialogue (Héros ou PNJ)
 * @param isCompleted? : boolean : Indique si le dialogue est terminé
 * @param isActive? : boolean : Indique si le dialogue est actif
 * @param currentLineIndex? : number : Index de la ligne de dialogue actuelle
 * @param currentChoiceIndex? : number : Index du choix actuel
 * @param lines? : IDialogueLine[] : Liste des lignes de dialogue
 *
 * @function GetCurrentLine : IDialogueLine | undefined : Retourne la ligne de dialogue actuelle
 * @function GetCurrentChoice : IChoice | undefined : Retourne le choix actuel
 * @function Continue : void : Passe à la ligne de dialogue suivante
 * @function Choose : void : Sélectionne un choix et passe à la ligne de dialogue suivante
 * @function onDialogueCompleted : () => void : Callback appelé lorsque le dialogue est terminé
 *
 */
export class Dialogue implements IDialogue {
  id: string;
  owner: IDialogueOwner | undefined;
  isCompleted: boolean;
  isActive: boolean;
  currentLineLevelIndex: number;
  currentChoiceLevelIndex: number;
  rootLine: IDialogueLine | undefined;
  currentLine: IDialogueLine | undefined;
  onDialogueCompleted: () => void;

  constructor(
    owner: IDialogueOwner | undefined,
    isCompleted?: boolean,
    isActive?: boolean,
    currentLineIndex?: number,
    currentChoiceIndex?: number,
    lines?: IDialogueLine[],
    id?: string,
  ) {
    this.id = id ?? crypto.randomUUID();
    this.owner = owner;
    this.isCompleted = isCompleted ?? false;
    this.isActive = isActive ?? false;
    this.currentLineLevelIndex = currentLineIndex ?? 0;
    this.currentChoiceLevelIndex = currentChoiceIndex ?? 0;
    this.rootLine = lines?.[0];
    this.currentLine = this.rootLine;
    this.onDialogueCompleted = () => {};
  }
}
