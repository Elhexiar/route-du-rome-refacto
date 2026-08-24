import type {
  IChoice,
  IDialogueNode,
  DialogueNodeJSON,
} from "../../interfaces/entities/dialogue/IDialogueNode";

import { Choice } from "./Choice";

export class DialogueNode implements IDialogueNode {
  root: IDialogueNode | null;
  parent: IDialogueNode | IChoice | null;
  id: string;
  text: string;
  nextNode?: IDialogueNode | null | undefined;
  choices?: IChoice[] | null;
  OnStartTextActionID?: string[];
  OnStartActions?: (() => void)[];
  OnEndTextActionID?: string[];
  OnEndActions?: (() => void)[];

  constructor(
    DialogueNodeJSON: DialogueNodeJSON,
    root: IDialogueNode | null = null,
    parent: IDialogueNode | IChoice | null = null,
  ) {
    this.root = root;
    this.parent = parent;
    this.id = DialogueNodeJSON.id;
    this.text = DialogueNodeJSON.text;
    this.nextNode = DialogueNodeJSON.next
      ? new DialogueNode(DialogueNodeJSON.next, root ?? this, this)
      : null;
    this.choices =
      DialogueNodeJSON.choices?.map((choice) => new Choice(choice, this)) ||
      null;
    this.OnStartTextActionID = DialogueNodeJSON.OnStartTextActionID
      ? Array.isArray(DialogueNodeJSON.OnStartTextActionID)
        ? DialogueNodeJSON.OnStartTextActionID
        : [DialogueNodeJSON.OnStartTextActionID]
      : undefined;
    this.OnEndTextActionID = DialogueNodeJSON.OnEndTextActionID
      ? Array.isArray(DialogueNodeJSON.OnEndTextActionID)
        ? DialogueNodeJSON.OnEndTextActionID
        : [DialogueNodeJSON.OnEndTextActionID]
      : undefined;
  }

  next(): IDialogueNode | null {
    if (this.choices && this.choices.length > 0) {
      return null;
    }

    if (this.nextNode) {
      return this.nextNode as IDialogueNode;
    }

    return null;
  }
}
