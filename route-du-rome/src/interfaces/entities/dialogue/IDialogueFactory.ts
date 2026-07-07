import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { IDialogueLine } from "#IEntities/dialogue/IDialogueLine";
import type { IDialogueOwner } from "#IEntities/dialogue/IDialogueOwner";

export function createDialogueOwnerBehavior(state: IDialogueOwner) {
  return {
    addDialogue(dialogue: IDialogue) {
      state.dialogues.push(dialogue);
      return this;
    },

    addDialogueLine(line: IDialogueLine, dialogueId?: string) {
      const targetDialogue = dialogueId
        ? state.dialogues.find((dialogue) => dialogue.id === dialogueId)
        : state.dialogues[state.dialogues.length - 1];

      if (targetDialogue) {
        targetDialogue.lines.push(line);
      }

      return this;
    },

    getDialogueById(dialogueId: string) {
      return state.dialogues.find((dialogue) => dialogue.id === dialogueId);
    },
  };
}
