// THIS IS JUST A TEST
import type { INpc } from "#IEntities/INpc";
import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { IDialogueView } from "#IUI/IDialogueView";

export class NPCDialogueView implements IDialogueView {
  npc: INpc | null = null;
  dialogue: IDialogue | null = null;
  currentVisibility: boolean = false;

  private readonly element: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement("section");
    this.element.className = "dialogue-view";
    container.appendChild(this.element);
    this.render();
  }

  ShowView(): void {
    this.element.style.display = "flex";
    this.currentVisibility = true;
  }

  HideView(): void {
    this.element.style.display = "none";
    this.currentVisibility = false;
  }

  ToggleView(): void {
    if (this.currentVisibility) {
      this.HideView();
    } else {
      this.ShowView();
    }
  }

  ResetForNewNPC(npc: INpc): void {
    this.npc = npc;
    this.dialogue = npc.presentationDialogue;
    this.render();

    console.log(
      "Réinitialisation de la vue de dialogue pour le PNJ :",
      npc.name,
    );
  }

  showDialogue(_node: any): void {
    this.render();
    console.log("Affichage du dialogue pour le PNJ :", this.npc?.name);
  }

  hideDialogue(): void {
    console.log("Masquage du dialogue pour le PNJ :", this.npc?.name);
  }

  updateDialogue(node: any): void {
    this.dialogue = node;
    this.render();
    console.log("Mise à jour du dialogue pour le PNJ :", this.npc?.name);
  }

  onChoiceSelected(_callback: (choiceId: string) => void): void {
    console.log(
      "Enregistrement du callback pour le choix du dialogue du PNJ :",
      this.npc?.name,
    );
  }

  private render(): void {
    const currentNpcName = this.npc?.name ?? "NPC";
    const currentDialogueText =
      this.dialogue?.rootNode?.text ??
      this.dialogue?.currentNode?.text ??
      "Aucun dialogue disponible.";

    this.element.innerHTML = `
      <div class="dialogue-view__body">
      </div>

      <div class="dialogue-view__dialogue-container">
        <p>Dialogue du NPC : ${currentNpcName}</p>
        <p>${currentDialogueText}</p>
        <div class="dialogue-view__choices-container">
          <button class="button choice-button">Continuer</button>
          <button class="button choice-button">Explorer</button>
        </div>
      </div>
    `;

    this.element.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.textContent?.trim() ?? "action";
        console.log(`Action choisie : ${action}`);
      });
    });
  }
}
