import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type {
  DialogueNodeJSON,
  IDialogueNode,
  IChoice,
} from "#src/interfaces/entities/dialogue/IDialogueNode.ts";
import type { IDialogueOwner } from "#src/interfaces/entities/dialogue/IDialogueOwner.ts";
import { searchActionIDInNode } from "#src/utils/DialogueUtils.ts";
import { Choice } from "./Choice";

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
 * @function CompleteDialogue : void : Termine le dialogue et déclenche ses actions de fin
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
  OnDialogueActions: (() => void)[];

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
  ) {
    this._id = id ?? crypto.randomUUID();
    this._owner = owner;
    this._isCompleted = false;
    this._isActive = false;
    this._currentLineDepth = 0;
    this._currentChoiceDepth = 0;
    this.OnDialogueActions = [];

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

  /**
   *  Adds an action to a dialogue node or choice based on the provided action ID and type.
   *
   * @param _actionID : string : The unique identifier for the action to be added.
   * @param _actionType : "OnStartText" | "OnEndText" | "none" : Specifies when the action should be triggered (at the start or end of the text).
   * @param _action : () => void : The callback function to be executed when the action is triggered.
   */
  AddAction(
    _actionID: string,
    _actionType: "OnStartText" | "OnEndText" | "none",
    _action: () => void,
  ): void {
    if (!this._rootNode) {
      console.warn("No root node to add action to.");
      return;
    }

    // Search for the action ID in the dialogue tree
    const foundNode = searchActionIDInNode(
      this._rootNode,
      _actionID,
      _actionType,
    );

    // filter for DialogueNode or IChoice and add the action to the appropriate property
    if (foundNode instanceof DialogueNode) {
      if (_actionType === "OnStartText") {
        foundNode.OnStartActions = foundNode.OnStartActions || [];
        foundNode.OnStartActions.push(_action);
      } else if (_actionType === "OnEndText") {
        foundNode.OnEndActions = foundNode.OnEndActions || [];
        foundNode.OnEndActions.push(_action);
      }
    } else if (foundNode instanceof Choice) {
      foundNode.actions = foundNode.actions || [];
      foundNode.actions.push(_action);
    }
  }

  CompleteDialogue(): void {
    if (this._isCompleted) {
      return;
    }

    this._isCompleted = true;
    this.OnDialogueActions.forEach((action) => action());
    console.log("Dialogue completed.");
  }

  Continue(): boolean {
    if (!this._currentNode) {
      console.warn("No current node to continue from.");
      return false;
    }

    if (this._currentNode.choices && this._currentNode.choices.length > 0) {
      console.log("Current node has choices. Awaiting user selection.");
      return false;
    }

    const nextNode = this._currentNode.next();

    if (nextNode) {
      this._currentNode = nextNode;
      this._currentLineDepth++;
      console.log("Moved to next node:", nextNode.id);
    } else {
      this.CompleteDialogue();
    }
    return true;
  }

  Choose(_choiceID?: string, _choiceIndex?: number): void {
    if (!this._currentNode || !this._currentNode.choices) {
      console.warn("No choices available at the current node.");
      return;
    }

    let selectedChoice: IChoice | undefined;

    if (_choiceID) {
      selectedChoice = this._currentNode.choices.find(
        (choice) => choice.id === _choiceID,
      );
    } else if (_choiceIndex !== undefined) {
      selectedChoice = this._currentNode.choices[_choiceIndex];
    }

    if (!selectedChoice) {
      console.warn("Selected choice not found.");
      return;
    }

    const nextNode = selectedChoice.select();

    if (nextNode) {
      this._currentNode = nextNode;
      this._currentChoiceDepth++;
      console.log("Moved to next node via choice:", nextNode.id);
      this._currentNode?.OnStartActions?.forEach((action) => action());
    } else {
      console.warn("Selected choice does not lead to a next node.");
    }
  }

  Reset(): void {
    this._currentNode = this._rootNode;
    this._currentLineDepth = 0;
    this._currentChoiceDepth = 0;
    this._isCompleted = false;
    console.log("Dialogue has been reset to the root node.");
  }
}
