import type { IDialogueNode, IChoice } from "#IEntities/dialogue/index";

type DialogueBranch = {
  root?: IDialogueNode | IChoice | null;
  parent?: IDialogueNode | IChoice | null;
};

export function getRoot(
  current?: IDialogueNode | IChoice | DialogueBranch | null,
): IDialogueNode | null {
  let cursor: IDialogueNode | IChoice | DialogueBranch | null = current ?? null;
  const seen = new Set<object>();

  while (cursor && !seen.has(cursor as object)) {
    seen.add(cursor as object);

    const root = "root" in cursor ? cursor.root : null;
    if (root) {
      return root as IDialogueNode;
    }

    if ("parent" in cursor && cursor.parent) {
      cursor = cursor.parent as IDialogueNode | IChoice | DialogueBranch;
      continue;
    }

    return cursor as IDialogueNode;
  }

  return cursor ? (cursor as IDialogueNode) : null;
}
