import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type {
  DialogueNodeJSON,
  IDialogueNode,
} from "#src/interfaces/entities/dialogue/IDialogueNode.ts";
import type { IDialogueOwner } from "#src/interfaces/entities/dialogue/IDialogueOwner.ts";

import { DialogueNode } from "./DialogueNode";

export type DialogueData = {
  // Temporary type for testing purposes

  id: string;
  ownerId: string;
};

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
 * @function Continue : void : Passe à la ligne de dialogue suivante
 * @function Choose : void : Sélectionne un choix et passe à la ligne de dialogue suivante
 * @function onDialogueCompleted : () => void : Callback appelé lorsque le dialogue est terminé
 *
 */
export class Dialogue implements IDialogue {
  private _id: string;
  private _owner: IDialogueOwner | undefined;
  private _isCompleted: boolean;
  private _isActive: boolean;
  private _currentLineDepth: number;
  private _currentChoiceDepth: number;
  private _rootNode: IDialogueNode | undefined;
  private _currentNode: IDialogueNode | undefined;
  private _OnDialogueCompleted: () => void;

  get id(): string {
    return this._id;
  }

  get owner(): IDialogueOwner | undefined {
    return this._owner;
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get currentLineDepth(): number {
    return this._currentLineDepth;
  }

  get currentChoiceDepth(): number {
    return this._currentChoiceDepth;
  }

  get rootNode(): IDialogueNode | undefined {
    return this._rootNode;
  }

  get currentNode(): IDialogueNode | undefined {
    return this._currentNode;
  }

  get OnDialogueCompleted(): () => void {
    return this._OnDialogueCompleted;
  }

  /**
   *
   * @param owner : IDialogueOwner : Propriétaire du dialogue (Héros ou PNJ)
   * @param id? : string : Identifiant unique du dialogue
   * @param json : unknown : Données JSON importées pour initialiser le dialogue
   */
  constructor(
    owner: IDialogueOwner | undefined,
    id?: string,
    json: unknown = undefined,
    OnDialogueCompletionCallback: () => void = () => {},
  ) {
    this._id = id ?? crypto.randomUUID();
    this._owner = owner;
    this._isCompleted = false;
    this._isActive = false;
    this._currentLineDepth = 0;
    this._currentChoiceDepth = 0;
    this._OnDialogueCompleted = OnDialogueCompletionCallback;

    this.ImportDialogueFromJSON(json);
  }

  ImportDialogueFromJSON(json: unknown): IDialogue | null {
    if (!json || typeof json !== "object") {
      console.error("Invalid JSON data for dialogue import.");
      return null;
    }

    const parsedData = json as DialogueNodeJSON;
    const rootNode = new DialogueNode(parsedData);

    this._rootNode = rootNode;
    this._currentNode = rootNode;

    return this;
  }

  AddAction(_actionID: string, _actionType: "OnStartText" | "OnEndText"): void {
    throw new Error("Method not implemented.");
  }

  Continue(): void {
    throw new Error("Method not implemented.");
  }

  Choose(_choiceID?: string, _choiceIndex?: number): void {
    throw new Error("Method not implemented.");
  }
}
