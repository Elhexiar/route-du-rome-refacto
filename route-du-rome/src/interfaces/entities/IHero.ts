import type { IDialogue } from "./dialogue/IDialogue";
import type { IDialogueOwner } from "./dialogue/IDialogueOwner";

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

export interface IHero extends IDialogueOwner {
  id: string;
  name: string;
  role: string;
  description: string;
  bio: string;
  presentationDialogue: IDialogue | undefined | null;
  portrait: string;
  presentationVideo: string;
  dialogues: IDialogue[];
}
