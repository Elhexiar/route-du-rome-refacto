export type ChoiceJSON = {
  id: string;
  text: string;
  actionID?: string;
  next?: DialogueNodeJSON | null;
  findID?: string;
};

export type DialogueNodeJSON = {
  id: string;
  text: string;
  next?: DialogueNodeJSON | null;
  choices?: ChoiceJSON[] | null;
  OnStartTextActionID?: string[];
  OnEndTextActionID?: string[];
};

export interface IDialogueNode {
  root: IDialogueNode | null; // null if this is the root node, otherwise it points to the root node
  id: string;
  text: string;
  nextNode?: IDialogueNode | null;
  choices?: IChoices[] | null;
  OnStartTextActiondID?: string[];
  OnEndTextActionID?: string[];

  findNodeByID(id: string): IDialogueNode | null;
  findActionByID(id: string): string | null;
  next(): IDialogueNode | null;
}

export interface IChoices {
  root: IDialogueNode | null; // null if this is the root node, otherwise it points to the root node
  id: string;
  text: string;
  actionID?: string;
  next: IDialogueNode | null;

  select(): IDialogueNode | null;
}
