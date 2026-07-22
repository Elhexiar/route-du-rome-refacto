import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { IDialogueLine } from "#IEntities/dialogue/IDialogueLine.ts";
import type { INpc } from "#IEntities/INpc.ts";
import { createDialogueOwnerBehavior } from "#src/interfaces/entities/dialogue/IDialogueFactory.ts";

export class Npc implements INpc {
  id: string;
  name: string;
  color: string;
  job: string;
  icon: string;
  portrait: string;
  lattitude: number;
  longitude: number;
  presentationVideo: string;
  presentationDialogue: IDialogue | null;
  dialogues: IDialogue[];
  currentActiveDialogue: IDialogue | null;
  done: boolean = false;
  accessible: boolean = true;

  private readonly dialogueOwnerBehavior = createDialogueOwnerBehavior(this);

  constructor(
    id: string,
    name: string,
    color: string,
    job: string,
    icon: string,
    portrait: string,
    lattitude: number,
    longitude: number,
    presentationVideo: string,
    presentationDialogue: IDialogue | null,
    dialogues: IDialogue[],
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.job = job;
    this.icon = icon;
    this.portrait = portrait;
    this.lattitude = lattitude;
    this.longitude = longitude;
    this.presentationVideo = presentationVideo;
    this.presentationDialogue = presentationDialogue
      ? presentationDialogue
      : null;
    this.dialogues = dialogues;
    this.currentActiveDialogue = null;
  }

  addDialogue(dialogue: IDialogue): void {
    this.dialogueOwnerBehavior.addDialogue(dialogue);
  }
  addDialogueLine(line: IDialogueLine, dialogueId?: string): void {
    this.dialogueOwnerBehavior.addDialogueLine(line, dialogueId);
  }
  getDialogueById(dialogueId: string): IDialogue | undefined {
    return this.dialogueOwnerBehavior.getDialogueById(dialogueId);
  }
}
