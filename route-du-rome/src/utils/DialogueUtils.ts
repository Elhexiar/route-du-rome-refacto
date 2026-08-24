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

/**
 * Recursively searches for an action ID in the dialogue tree starting from the given node.
 * @param node The starting node for the search.
 * @param actionID The action ID to search for.
 * @param filterType Optional filter to specify whether to search in OnStartTextActionID or OnEndTextActionID.
 * @returns The node or choice containing the action ID, or null if not found.
 */
export function searchActionIDInNode(
  node: IDialogueNode,
  actionID: string,
  filterType: "OnStartText" | "OnEndText" | "none",
): IDialogueNode | IChoice | null {
  const visited = new Set<IDialogueNode>();

  const walk = (current: IDialogueNode | null): IDialogueNode | null => {
    if (!current || visited.has(current)) {
      return null;
    }

    visited.add(current);

    if (
      filterType === "OnStartText" &&
      current.OnStartTextActionID?.includes(actionID)
    ) {
      return current;
    }

    if (
      filterType === "OnEndText" &&
      current.OnEndTextActionID?.includes(actionID)
    ) {
      return current;
    }

    const foundInNext = walk(current.nextNode ?? null);
    if (foundInNext) {
      return foundInNext;
    }

    for (const choice of current.choices ?? []) {
      const foundInChoiceNext = walk(choice.next);
      if (foundInChoiceNext) {
        return foundInChoiceNext;
      }
    }

    return null;
  };

  return walk(node);
}

// Recursively searches for a node with the given ID in the dialogue tree.
// Uses visited nodes to avoid infinite loops in cyclic graphs.
export function findNodeByID(
  startNode: IDialogueNode | null,
  id: string,
): IDialogueNode | null {
  const visited = new Set<IDialogueNode>();

  const walk = (node: IDialogueNode | null): IDialogueNode | null => {
    if (!node || visited.has(node)) {
      return null;
    }

    visited.add(node);

    if (node.id === id) {
      return node;
    }

    const foundInNext = walk(node.nextNode ?? null);
    if (foundInNext) {
      return foundInNext;
    }

    for (const choice of node.choices ?? []) {
      const foundInChoiceNext = walk(choice.next);
      if (foundInChoiceNext) {
        return foundInChoiceNext;
      }
    }

    return null;
  };

  return walk(startNode);
}
