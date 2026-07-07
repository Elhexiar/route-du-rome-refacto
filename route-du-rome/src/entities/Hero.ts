import type { IHero } from "#IEntities/IHero";
import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import { createDialogueOwnerBehavior } from "#src/interfaces/entities/dialogue/IDialogueFactory.ts";
import type { IDialogueLine } from "#src/interfaces/entities/dialogue/IDialogueLine.ts";

/**
 * @param id : string : Identifiant unique du héros
 * @param name : string : Nom du héros
 * @param role : string : role montrée dans le jeu
 * @param description : string : description du héros
 * @param bio : string : biographie du héros
 * @param presentationDialogue : IDialogue : Dialogue de présentation du héros
 * @param portrait : string : URL de l'image du portrait du héros
 * @param presentationVideo : string : URL de la vidéo de présentation du héros
 */

export class Hero implements IHero {
  // Hero properties
  id: string;
  name: string;
  role: string;
  description: string;
  bio: string;
  presentationDialogue: IDialogue | undefined;
  portrait: string;
  presentationVideo: string;

  // Dialogue Owner properties
  dialogues: IDialogue[] = [];
  currentActiveDialogue: IDialogue | null = null;

  private readonly dialogueOwnerBehavior = createDialogueOwnerBehavior(this);

  constructor(
    id: string,
    name: string,
    role: string,
    description: string,
    bio: string,
    portrait: string,
    presentationVideo: string,
    presentationDialogue?: IDialogue | undefined,
    dialogues?: IDialogue[],
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.description = description;
    this.bio = bio;
    this.portrait = portrait;
    this.presentationVideo = presentationVideo;

    this.currentActiveDialogue = null;

    this.dialogues = dialogues ?? [];
    if (presentationDialogue) {
      ((this.presentationDialogue = presentationDialogue),
        this.dialogues.unshift(presentationDialogue));
    }
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
