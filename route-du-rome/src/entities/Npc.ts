import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { INpc } from "#IEntities/INpc.ts";
import type { IQuest } from "#IEntities/IQuest.ts";
import type { DialogueData } from "./dialogue/Dialogue";

export type NpcData = {
  id: string;
  name: string;
  color: string;
  job: string;
  jobSector: string;
  icon: string;
  portrait: string;
  latitude?: number;
  lattitude?: number;
  longitude: number;
  relatedQuestsIds: string[];
  backgroundVideo: string;
  jobVideoUrl: string;
  videoTitle: string;
  presentationDialogue: DialogueData | null;
};

/***
 * @param id : string : Identifiant unique du PNJ
 * @param name : string : Nom du PNJ
 * @param color : string : Couleur associée au PNJ
 * @param job : string : Métier du PNJ
 * @param jobSector : string : Secteur du métier du PNJ
 * @param icon : string : URL de l'icône du PNJ
 * @param portrait : string : URL de l'image du portrait du PNJ
 * @param latitude : number : Latitude de la position du PNJ
 * @param longitude : number : Longitude de la position du PNJ
 * @param jobVideoUrl : string : URL de la vidéo métier du PNJ
 * @param presentationDialogue : IDialogue | null : Dialogue de présentation du PNJ
 * @param dialogues : IDialogue[] : Liste des dialogues associés au PNJ
 * @param done : boolean : Indique si le PNJ a été rencontré ou non
 * @param accessible : boolean : Indique si le PNJ est accessible ou non
 *
 * @function addDialogue : void : Ajoute un dialogue au PNJ
 * @function addDialogueLine : void : Ajoute une ligne de dialogue à un dialogue spécifique du PNJ
 * @function getDialogueById : IDialogue | undefined : Retourne un dialogue spécifique du PNJ par son identifiant
 *
 * @implements INpc
 */

export class Npc implements INpc {
  id: string;
  name: string;
  color: string;
  job: string;
  jobSector: string;
  icon: string;
  portrait: string;
  latitude: number;
  longitude: number;
  relatedQuests: IQuest[] = [];
  backgroundVideo: string;
  jobVideoUrl: string;
  videoTitle: string;
  presentationDialogue: IDialogue | null;
  dialogues: IDialogue[];
  currentActiveDialogue: IDialogue | null | undefined;
  done: boolean = false;
  accessible: boolean = true;

  constructor(
    id: string,
    name: string,
    color: string,
    job: string,
    jobSector: string,
    icon: string,
    portrait: string,
    latitude: number,
    longitude: number,
    backgroundVideo: string,
    jobVideoUrl: string,
    videoTitle: string,
    presentationDialogue: IDialogue | null,
    dialogues: IDialogue[],
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.job = job;
    this.jobSector = jobSector;
    this.icon = icon;
    this.portrait = portrait;
    this.latitude = latitude;
    this.longitude = longitude;
    this.backgroundVideo = backgroundVideo;
    this.jobVideoUrl = jobVideoUrl;
    this.videoTitle = videoTitle;
    this.presentationDialogue = presentationDialogue ?? null;
    this.dialogues = dialogues;
    this.currentActiveDialogue = null;
  }

  static fromJson(data: NpcData): Npc {
    const latitude = data.latitude ?? data.lattitude ?? 0;

    return new Npc(
      data.id,
      data.name,
      data.color,
      data.job,
      data.jobSector,
      data.icon,
      data.portrait,
      latitude,
      data.longitude,
      data.backgroundVideo,
      data.jobVideoUrl,
      data.videoTitle,
      null,
      [],
    );
  }
}
