import { describe, expect, it } from "vitest";

import { Choice } from "#Entities/dialogue/Choice";
import { Dialogue } from "#Entities/dialogue/Dialogue";
import { DialogueNode } from "#Entities/dialogue/DialogueNode";
import { findNodeByID, getRoot, searchActionIDInNode } from "./DialogueUtils";

describe("getRoot", () => {
  it("climbs through both DialogueNode and Choice parents to the top node", () => {
    const root = new DialogueNode({
      id: "root",
      text: "Root",
      choices: [
        {
          id: "choice-1",
          text: "Go to child",
          next: {
            id: "child",
            text: "Child",
          },
        },
      ],
    });

    const choice = root.choices?.[0] as Choice;
    const child = choice.next as DialogueNode;

    expect(getRoot(child)).toBe(root);
    expect(getRoot(choice)).toBe(root);
  });
});

describe("Dialogue import", () => {
  it("converts raw JSON data into runtime DialogueNode objects", () => {
    const dialogue = new Dialogue(undefined, "dialogue-1", {
      id: "root",
      text: "Welcome",
      choices: [
        {
          id: "choice-1",
          text: "Go to child",
          next: {
            id: "child",
            text: "Child message",
          },
        },
      ],
    });

    expect(dialogue.rootNode).toBeInstanceOf(DialogueNode);
    expect(dialogue.currentNode).toBe(dialogue.rootNode);
    expect(dialogue.rootNode?.choices?.[0].next).toBeInstanceOf(DialogueNode);
  });

  it("resolves a choice with findID back to the root node", () => {
    const root = new DialogueNode({
      id: "root",
      text: "Welcome",
      choices: [
        {
          id: "back-to-start",
          text: "Restart",
          findID: "root",
        },
      ],
    });

    const choice = root.choices?.[0] as Choice;

    expect(choice.select()).toBe(root);
  });
});

describe("Dialogue completion", () => {
  it("runs every dialogue action once when completed", () => {
    const dialogue = new Dialogue(undefined, "dialogue-1", {
      id: "root",
      text: "Final message",
    });
    const actions: string[] = [];

    dialogue.OnDialogueActions.push(
      () => actions.push("hide-view"),
      () => actions.push("save-progress"),
    );

    expect(dialogue.Continue()).toBe(true);
    expect(dialogue.isCompleted).toBe(true);
    expect(actions).toEqual(["hide-view", "save-progress"]);

    dialogue.CompleteDialogue();
    expect(actions).toEqual(["hide-view", "save-progress"]);
  });
});

describe("searchActionIDInNode", () => {
  it("normalizes a single end-action ID from JSON", () => {
    const root = new DialogueNode({
      id: "root",
      text: "Start",
      next: {
        id: "end-node",
        text: "End",
        OnEndTextActionID: "choice-end",
      },
    });

    const foundNode = searchActionIDInNode(root, "choice-end", "OnEndText");

    expect(foundNode).toBe(root.nextNode);
    expect((foundNode as DialogueNode).OnEndTextActionID).toEqual([
      "choice-end",
    ]);
  });

  it("finds actions in both nextNode and choice branches", () => {
    const root = new DialogueNode({
      id: "root",
      text: "Start",
      next: {
        id: "linear-node",
        text: "Linear",
        OnEndTextActionID: ["action-in-next"],
      },
      choices: [
        {
          id: "to-branch",
          text: "Branch",
          next: {
            id: "branch-node",
            text: "Branch Node",
            OnStartTextActionID: ["action-in-choice"],
          },
        },
      ],
    });

    const foundInNext = searchActionIDInNode(
      root,
      "action-in-next",
      "OnEndText",
    );
    const foundInChoice = searchActionIDInNode(
      root,
      "action-in-choice",
      "OnStartText",
    );

    expect(foundInNext).not.toBeNull();
    expect((foundInNext as DialogueNode).id).toBe("linear-node");
    expect(foundInChoice).not.toBeNull();
    expect((foundInChoice as DialogueNode).id).toBe("branch-node");
  });
});

describe("findNodeByID", () => {
  it("returns null for unknown IDs without looping when choices jump back to root", () => {
    const root = new DialogueNode({
      id: "root",
      text: "Welcome",
      choices: [
        {
          id: "restart",
          text: "Restart",
          findID: "root",
        },
      ],
    });

    expect(findNodeByID(root, "missing-node-id")).toBeNull();
    expect(findNodeByID(root, "root")).toBe(root);
  });
});
