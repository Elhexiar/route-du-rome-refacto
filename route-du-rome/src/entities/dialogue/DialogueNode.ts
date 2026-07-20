import type {
  IChoices,
  IDialogueNode,
  DialogueNodeJSON,
  ChoiceJSON,
} from "../../interfaces/entities/dialogue/IDialogueNode";

class Choice implements IChoices {
  id: string;
  text: string;
  actionID?: string;
  next: IDialogueNode | null = null;

  constructor(choiceJSON: ChoiceJSON) {
    this.id = choiceJSON.id;
    this.text = choiceJSON.text;
    this.actionID = choiceJSON.actionID;
    this.next = choiceJSON.next ? new DialogueNode(choiceJSON.next) : null;
  }

  select(): IDialogueNode | null {
    return this.next;
  }
}

class DialogueNode implements IDialogueNode {
  root: IDialogueNode | null;
  id: string;
  text: string;
  nextNode?: IDialogueNode | null;
  choices?: IChoices[] | null;
  OnStartTextActionID?: string[];
  OnEndTextActionID?: string[];

  constructor(
    DialogueNodeJSON: DialogueNodeJSON,
    root: IDialogueNode | null = null,
  ) {
    this.root = root;
    this.id = DialogueNodeJSON.id;
    this.text = DialogueNodeJSON.text;
    this.nextNode = DialogueNodeJSON.next
      ? new DialogueNode(DialogueNodeJSON.next, root)
      : null;
    this.choices =
      DialogueNodeJSON.choices?.map((choice) => new Choice(choice)) || null;
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
}
