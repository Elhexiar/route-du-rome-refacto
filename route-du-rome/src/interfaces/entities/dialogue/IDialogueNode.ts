export type ChoiceJSON = {
  id: string;
  text: string;
  actionID?: string;
  next?: DialogueNodeJSON | null;
  // optional if you want to jump to an already existing branch of the dialogue tree instead of creating a new one
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

export interface IChoice {
  root: IDialogueNode | null;
  parent: IDialogueNode | IChoice | null;
  id: string;
  text: string;
  actionID?: string;
  findID?: string;
  next: IDialogueNode | null;

  select(): IDialogueNode | null;
}

export interface IDialogueNode {
  root: IDialogueNode | null;
  parent: IDialogueNode | IChoice | null;
  id: string;
  text: string;
  nextNode?: IDialogueNode | null;
  choices?: IChoice[] | null;
  OnStartTextActionID?: string[];
  OnEndTextActionID?: string[];

  findNodeByID(id: string): IDialogueNode | null;
  findActionByID(id: string): string | null;
  next(): IDialogueNode | null;
}

export type IChoices = IChoice;
