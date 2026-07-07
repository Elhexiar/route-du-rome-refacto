import type { IChoice } from "./IChoice";

/**
 * @param id : string : Identifiant unique de la ligne de dialogue
 * @param text : string : Texte de la ligne de dialogue
 * @param hasChoice : boolean : Indique si la ligne de dialogue a des choix
 * @param choices : IChoice[] : Liste des choix disponibles pour cette ligne de dialogue
 *
 * @function onBeginDisplayLine : () => void : Callback appelé lorsque la ligne de dialogue commence à s'afficher
 * @function onEndDisplayLine : () => void : Callback appelé lorsque la ligne de dialogue a fini de s'afficher
 */

export interface IDialogueLine {
  id: string;
  text: string;
  hasChoice: boolean;
  choices: IChoice[];
  onBeginDisplayLine: () => void;
  onEndDisplayLine: () => void;
}
