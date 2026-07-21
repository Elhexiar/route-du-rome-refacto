import type { IDialogue } from "./IDialogue";
import type { IDialogueLine } from "./IDialogueLine";

export interface IDialogueOwner {
  dialogues: IDialogue[];
  currentActiveDialogue: IDialogue | null;

  addDialogue(dialogue: IDialogue): void;
  addDialogueLine(line: IDialogueLine, dialogueId?: string): void;
  getDialogueById(dialogueId: string): IDialogue | undefined;
}

// const d = Dialogue(loadedJson)
//   .AddDialogueAction("Choice1", () => {
//     // Action for Choice 1
//   })
//   .AddDialogueAction("Choice2", () => {
//     // Action for Choice 2
//   })
//   .AddDialogueAction("Choice3", () => {
//     // Action for Choice 3
//   });

// JSON

// root:
//   line:
//     id: "Intro"
//     text : "Introduction",
//     nextStep:
//       choices:
//           id: "Choice1"
//           text: "Choice 1"
//           nextStep:
//             line:
//               id: "Choice1Result"
//               text: "You chose Choice 1"
//           action: "Choice1"
//       choices:
//           id: "Choice2"
//           text: "Choice 2"
//           nextStep:
//             line:
//               id: "Choice2Result"
//               text: "Go back to the introduction"
//       choices:
//           id: "Choice3"
//           text: "Choice 3"
//           nextStep:
//             line:
//               id: "Choice3Result"
//               text: "You chose Choice 3"
