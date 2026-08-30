import type { IHero } from "#IEntities/IHero";
import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { DialogueData } from "#Entities/dialogue/Dialogue.ts";

// JSON data structure for Hero
export type HeroData = {
  id: string;
  name: string;
  role: string;
  description: string;
  bio: string;
  presentationDialogue?: DialogueData | null;
  portrait: string;
  presentationVideo: string;
  tags: string[];
  dialogues?: DialogueData[];
};

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
  id: string;
  name: string;
  role: string;
  description: string;
  bio: string;
  presentationDialogue: IDialogue | undefined | null;
  portrait: string;
  presentationVideo: string;
  tags: string[];

  dialogues: IDialogue[] = [];
  currentActiveDialogue: IDialogue | null | undefined = null;

  constructor(
    id: string,
    name: string,
    role: string,
    description: string,
    bio: string,
    portrait: string,
    presentationVideo: string,
    presentationDialogue?: IDialogue | undefined | null,
    dialogues?: IDialogue[],
    tags: string[] = [],
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.description = description;
    this.bio = bio;
    this.portrait = portrait;
    this.presentationVideo = presentationVideo;
    this.tags = tags;
    this.currentActiveDialogue = null;
    this.dialogues = dialogues ?? [];

    if (presentationDialogue) {
      this.presentationDialogue = presentationDialogue;
      this.dialogues.unshift(presentationDialogue);
    }
  }

  static fromJson(data: HeroData): Hero {
    const hero = new Hero(
      data.id,
      data.name,
      data.role,
      data.description,
      data.bio,
      data.portrait,
      data.presentationVideo,
      null,
      [],
      data.tags,
    );

    return hero;
  }
}
