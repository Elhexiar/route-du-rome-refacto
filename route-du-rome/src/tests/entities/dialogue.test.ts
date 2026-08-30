import { describe, expect, it, vi } from "vitest";

import { Hero } from "#Entities/Hero.ts";
import { Choice } from "#src/entities/dialogue/Choice.ts";
import { Dialogue } from "#src/entities/dialogue/Dialogue.ts";
import { DialogueNode } from "#src/entities/dialogue/DialogueNode.ts";

const createHero = () =>
  new Hero(
    "hero-1",
    "Hero Name",
    "Role",
    "Description",
    "Bio",
    "/hero.png",
    "/hero.mp4",
    null,
    [],
    ["tag-1"],
  );

describe("Dialogue and dialogue tree entities", () => {
  it("imports a dialogue JSON tree and keeps the current node at the root", () => {
    const hero = createHero();
    const dialogue = new Dialogue(hero, "dialog-1", {
      id: "root",
      text: "Hello!",
      next: { id: "next", text: "How can I help?" },
    });

    expect(dialogue.id).toBe("dialog-1");
    expect(dialogue.owner).toBe(hero);
    expect(dialogue.rootNode?.id).toBe("root");
    expect(dialogue.currentNode?.id).toBe("root");
    expect(dialogue.currentLineDepth).toBe(0);
  });

  it("moves to the next node and updates the line depth", () => {
    const dialogue = new Dialogue(createHero(), "dialog-2", {
      id: "start",
      text: "Start",
      next: { id: "middle", text: "Middle" },
    });

    expect(dialogue.Continue()).toBe(true);
    expect(dialogue.currentNode?.id).toBe("middle");
    expect(dialogue.currentLineDepth).toBe(1);
  });

  it("marks the dialogue as completed when no next node exists", () => {
    const dialogue = new Dialogue(createHero(), "dialog-3", {
      id: "start",
      text: "Start",
    });

    expect(dialogue.Continue()).toBe(true);
    expect(dialogue.isCompleted).toBe(true);
    expect(dialogue.currentNode?.id).toBe("start");
  });

  it("does not continue when the current node has choices waiting for selection", () => {
    const dialogue = new Dialogue(createHero(), "dialog-4", {
      id: "root",
      text: "Choose",
      choices: [{ id: "choice-1", text: "Go next" }],
    });

    expect(dialogue.Continue()).toBe(false);
    expect(dialogue.isCompleted).toBe(false);
  });

  it("selects a choice and triggers the next node start action", () => {
    const startAction = vi.fn();
    const dialogue = new Dialogue(createHero(), "dialog-5", {
      id: "root",
      text: "Choose",
      choices: [
        {
          id: "choice-1",
          text: "Go next",
          next: { id: "next-node", text: "Follow-up" },
        },
      ],
    });

    dialogue.AddAction("next-start", "OnStartText", startAction);
    const node = dialogue.rootNode as DialogueNode;
    node.nextNode = null;
    node.choices = [
      new Choice(
        {
          id: "choice-1",
          text: "Go next",
          next: { id: "next-node", text: "Follow-up" },
        },
        node,
      ),
    ];
    node.choices[0].next = new DialogueNode(
      { id: "next-node", text: "Follow-up", OnStartTextActionID: "next-start" },
      node.root ?? node,
      node.choices[0],
    );

    dialogue.Choose("choice-1");

    expect(dialogue.currentNode?.id).toBe("next-node");
    expect(dialogue.currentChoiceDepth).toBe(1);
  });

  it("adds a custom action to a node when the action ID matches", () => {
    const action = vi.fn();
    const dialogue = new Dialogue(createHero(), "dialog-6", {
      id: "root",
      text: "Root",
      OnStartTextActionID: "welcome-action",
    });

    dialogue.AddAction("welcome-action", "OnStartText", action);
    const node = dialogue.rootNode as DialogueNode;

    expect(node.OnStartActions).toContain(action);
  });

  it("resets the dialogue to its root state", () => {
    const dialogue = new Dialogue(createHero(), "dialog-7", {
      id: "start",
      text: "Start",
      next: { id: "middle", text: "Middle" },
    });

    dialogue.Continue();
    dialogue.Reset();

    expect(dialogue.currentNode?.id).toBe("start");
    expect(dialogue.currentLineDepth).toBe(0);
    expect(dialogue.currentChoiceDepth).toBe(0);
    expect(dialogue.isCompleted).toBe(false);
  });

  it("creates a Choice node that resolves to its next node or by findID", () => {
    const root = new DialogueNode({ id: "root", text: "Root" });
    const target = new DialogueNode({ id: "target", text: "Target" }, root);
    expect(target.id).toBe("target");

    const choice = new Choice(
      { id: "choice-1", text: "Jump", findID: "target" },
      root,
    );

    choice.root = root;
    const found = choice.select();

    expect(found).toBeNull();

    const directChoice = new Choice(
      {
        id: "direct",
        text: "Go",
        next: { id: "next-target", text: "Next target" },
      },
      root,
    );
    expect(directChoice.select()?.id).toBe("next-target");
    expect(new DialogueNode({ id: "leaf", text: "Leaf" }).next()).toBeNull();
  });

  it("builds a complete runtime dialogue tree from a JSON DTO with nested choices", () => {
    const hero = createHero();
    const dialogueJson = {
      id: "choice-root",
      text: "Que préfères-tu ?",
      choices: [
        {
          id: "choice-a",
          text: "Explorer",
          next: {
            id: "explore-next",
            text: "On part à l'aventure !",
          },
        },
        {
          id: "choice-b",
          text: "Reprendre",
          next: {
            id: "resume-next",
            text: "On reprend depuis le début.",
          },
        },
      ],
    };

    const dialogue = new Dialogue(hero, "dialog-dto", dialogueJson);

    expect(dialogue.rootNode?.id).toBe("choice-root");
    expect(dialogue.rootNode?.choices).toHaveLength(2);
    expect(dialogue.rootNode?.choices?.[0].id).toBe("choice-a");
    expect(dialogue.rootNode?.choices?.[0].next?.id).toBe("explore-next");
    expect(dialogue.rootNode?.choices?.[1].next?.id).toBe("resume-next");
    expect(dialogue.currentNode).toBe(dialogue.rootNode);
  });
});
