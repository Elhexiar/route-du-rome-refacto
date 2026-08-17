import { describe, expect, it } from "vitest";

import { Choice } from "#Entities/dialogue/Choice";
import { Dialogue } from "#Entities/dialogue/Dialogue";
import { DialogueNode } from "#Entities/dialogue/DialogueNode";
import { getRoot } from "./DialogueUtils";

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
