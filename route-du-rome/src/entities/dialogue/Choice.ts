import type {
  IDialogueNode,
  IChoice,
  ChoiceJSON,
} from "#IEntities/dialogue/IDialogueNode";

import { DialogueNode } from "#Entities/dialogue/DialogueNode";

import { getRoot } from "#Utils/DialogueUtils";

export class Choice implements IChoice {
  root: IDialogueNode | null;
  parent: IDialogueNode | IChoice | null;
  id: string;
  text: string;
  actionID?: string;
  findID?: string;
  next: IDialogueNode | null = null;

  constructor(choiceJSON: ChoiceJSON, parentNode: IDialogueNode | null = null) {
    this.id = choiceJSON.id;
    this.text = choiceJSON.text;
    this.actionID = choiceJSON.actionID;
    this.findID = choiceJSON.findID;
    this.parent = parentNode;
    this.root = parentNode ? getRoot(parentNode) : null;
    this.next = choiceJSON.next
      ? new DialogueNode(
          choiceJSON.next,
          this.root ?? this.parent ?? null,
          this,
        )
      : null;
  }

  select(): IDialogueNode | null {
    if (this.findID) {
      return this.root?.findNodeByID(this.findID) ?? null;
    }

    return this.next;
  }
}
