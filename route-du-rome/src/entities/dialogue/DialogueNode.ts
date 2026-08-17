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
  OnEndTextActionID?: string[];

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
    this.OnStartTextActionID = DialogueNodeJSON.OnStartTextActionID;
    this.OnEndTextActionID = DialogueNodeJSON.OnEndTextActionID;
  }

  onStartTextAction(): () => void {
    return () => {};
  }

  onEndTextAction(): () => void {
    return () => {};
  }

  next(): IDialogueNode | null {
    return this.nextNode ?? null;
  }

  findNodeByID(id: string): IDialogueNode | null {
    if (this.id === id) {
      return this;
    }

    if (this.nextNode && this.nextNode.id === id) {
      return this.nextNode;
    }

    if (this.nextNode) {
      const foundNext = this.nextNode.findNodeByID(id);
      if (foundNext) {
        return foundNext;
      }
    }

    if (this.choices) {
      for (const choice of this.choices) {
        if (choice.id === id) {
          return null;
        }

        const foundChoiceTarget = choice.next?.findNodeByID(id);
        if (foundChoiceTarget) {
          return foundChoiceTarget;
        }

        if (choice.findID === id && choice.root) {
          return choice.root.findNodeByID(id);
        }
      }
    }

    return null;
  }

  findActionByID(id: string): string | null {
    if (this.OnStartTextActionID?.includes(id)) {
      return id;
    }
    return null;
  }
}
