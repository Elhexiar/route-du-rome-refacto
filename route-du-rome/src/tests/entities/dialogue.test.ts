import { describe, it, expect } from "vitest";
import type { DialogueNodeJSON } from "#src/interfaces/entities/dialogue/IDialogueNode.ts";

describe("Dialogue", () => {
  it("should create a dialogue instance", () => {
    // const hero: IDialogueOwner = new Hero(
    //   "hero1",
    //   "Hero Name",
    //   "Hero Role",
    //   "Hero Description",
    //   "Hero Bio",
    //   "hero-portrait.png",
    //   "hero-presentation.mp4",
    // );
    // const dialogue = new Dialogue(hero);
    // it("should handle dialogue behavior correctly", () => {
    //   // Test implementation here
    // });
    // it("should be able to insert custom functions into choices completion and dialogue completion", () => {
    //   // Test implementation here
    // });
    // it("should throw an error if a choice is not found", () => {
    //   // Test implementation here
    // });
    // it("should throw an error if a choice doesn't have a nextDialogue property", () => {
    //   // Test implementation here
    // });
  });
});

describe("dialogue traversal", () => {
  it("walks through a small dialogue tree", () => {
    const tree: DialogueNodeJSON = {
      id: "intro",
      text: "Welcome",
      choices: [
        {
          id: "ask",
          text: "Who are you?",
          next: {
            id: "reply",
            text: "I am the guardian.",
            next: {},
          },
        },
        {
          id: "leave",
          text: "Goodbye",
          next: {
            id: "end",
            text: "Farewell.",
          },
        },
      ],
    };

    const firstChoice = tree.choices?.find((choice) => choice.id === "ask");
    expect(firstChoice?.next?.text).toBe("I am the guardian.");
  });
});
