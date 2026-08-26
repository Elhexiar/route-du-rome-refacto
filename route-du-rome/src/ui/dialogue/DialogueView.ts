// THIS IS JUST A TEST
import type { IHero } from "#IEntities/IHero";
import type { INpc } from "#IEntities/INpc";
import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { IDialogueView } from "#IUI/IDialogueView";
import { GameManager } from "#Controllers/GameManager";

// TODO : I Replaced the NPCDialogueView with a more generic DialogueView that can handle both NPCs and Heroes.
// But it still has a lot of legacy code from the NPCDialogueView

export class DialogueView implements IDialogueView {
  speaker: INpc | IHero | null = null;
  dialogue: IDialogue | null = null;
  currentVisibility: boolean = false;
  private choiceSelectedCallback: ((choiceId: string) => void) | null = null;
  private typingIntervalId: number | null = null;
  private isTyping: boolean = false;
  private fullDialogueText: string = "";
  private textElement: HTMLParagraphElement | null = null;
  private choicesElement: HTMLDivElement | null = null;

  private readonly element: HTMLElement;
  private readonly typingSpeedMs: number = 24;

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
    this.stopTypingAnimation();
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

  // kept in case
  ResetForNewNPC(npc: INpc): void {
    this.ResetForNewSpeaker(npc);
  }

  ResetForNewSpeaker(speaker: INpc | IHero): void {
    this.speaker = speaker;
    this.dialogue = speaker.presentationDialogue ?? null;
    if (GameManager.dialogueController) {
      console.log(
        "Mise à jour du dialogue actif dans le DialogueController :",
        this.speaker.name,
      );
      GameManager.dialogueController.currentActiveDialogue = this.dialogue;
    }
    this.render();

    console.log("Réinitialisation de la vue de dialogue pour :", speaker.name);
  }

  // probably not needed anymore
  showDialogue(_node: any): void {
    this.render();
    console.log("Affichage du dialogue pour :", this.speaker?.name);
  }

  // same
  hideDialogue(): void {
    console.log("Masquage du dialogue pour :", this.speaker?.name);
  }

  updateDialogue(node: any): void {
    this.dialogue = node;
    this.render();
    console.log("Mise à jour du dialogue pour :", this.speaker?.name);
    this.notifyController();
  }

  // TODO: inverse the logic here, have the dialogue controller hook on a callback from the view, instead of the view notifying the controller
  notifyController() {
    if (GameManager.dialogueController) {
      console.log(
        "Mise à jour du dialogue actif dans le DialogueController :",
        this.speaker?.name,
      );
      GameManager.dialogueController.currentActiveDialogue = this.dialogue;
    }
  }

  onChoiceSelected(callback: (choiceId: string) => void): void {
    this.choiceSelectedCallback = callback;
    console.log(
      "Enregistrement du callback pour le choix du dialogue :",
      this.speaker?.name,
    );
  }

  // Makes sure to escape HTML special characters to prevent XSS attacks, who knows
  private escapeHtml(text: string): string {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  private stopTypingAnimation(): void {
    if (this.typingIntervalId !== null) {
      window.clearInterval(this.typingIntervalId);
      this.typingIntervalId = null;
    }

    this.isTyping = false;
  }

  private finishTypingAnimation(): void {
    this.stopTypingAnimation();

    if (this.textElement) {
      this.textElement.textContent = this.fullDialogueText;
    }

    if (this.choicesElement) {
      this.choicesElement.style.visibility = "visible";
      this.choicesElement.style.pointerEvents = "auto";
    }

    this.dialogue?.currentNode?.OnEndActions?.forEach((action) => action());
  }

  private startTypingAnimation(text: string): void {
    this.stopTypingAnimation();

    this.fullDialogueText = text;

    if (!this.textElement) {
      return;
    }

    this.textElement.textContent = "";

    if (this.choicesElement) {
      this.choicesElement.style.visibility = "hidden";
      this.choicesElement.style.pointerEvents = "none";
    }

    if (!text.length) {
      this.finishTypingAnimation();
      return;
    }

    this.isTyping = true;
    let characterIndex = 0;

    this.typingIntervalId = window.setInterval(() => {
      characterIndex += 1;

      if (!this.textElement) {
        this.stopTypingAnimation();
        return;
      }

      this.textElement.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        this.finishTypingAnimation();
      }
    }, this.typingSpeedMs);
  }

  private render(): void {
    const currentNode = this.dialogue?.currentNode ?? this.dialogue?.rootNode;
    const currentSpeakerName = this.speaker?.name ?? "Interlocuteur";
    let currentSpeakerRole = "Rôle inconnu";
    if (this.speaker) {
      currentSpeakerRole =
        "job" in this.speaker ? this.speaker.job : this.speaker.role;
    }
    const currentSpeakerIcon =
      this.speaker && "icon" in this.speaker ? this.speaker.icon : null;
    const currentDialogueText =
      currentNode?.text ?? "Aucun dialogue disponible.";
    const currentChoices = currentNode?.choices ?? [];

    const choicesHTML =
      currentChoices.length > 0
        ? currentChoices
            .map(
              (choice, index) =>
                `<button class="button choice-button" data-choice-id="${this.escapeHtml(choice.id)}">
                  <div class="choice-button__index">${this.escapeHtml((index + 1).toString())}</div>
                  <div class="choice-button__text">${this.escapeHtml(choice.text)}</div>
                </button>`,
            )
            .join("")
        : "";

    this.element.innerHTML = `
      <div class="dialogue-view__body">
      </div>

      <div class="dialogue-view__dialogue-container">
        <div class="dialogue-view__header">
            <div class="dialogue-view__npc-info">
              <div class="dialogue-view__header-start">
                <img src="${this.speaker?.portrait || "default-portrait.jpg"}" alt="${this.escapeHtml(currentSpeakerName)}" class="dialogue-view__npc-portrait">
                <div class="dialogue-view__title-container">
                  <h2 class="dialogue-view__npc-name">${this.escapeHtml(currentSpeakerName)}</h2>
                  <p class="dialogue-view__npc-role">${this.escapeHtml(currentSpeakerRole || "Rôle inconnu")}</p>              
                </div>
              </div>
              <div class="dialogue-view__header-end">
                <span class="dialogue-view__npc-job-icon">${currentSpeakerIcon || "🎭"}</span>
                <button class="dialogue-view__exit-button">x</button>
              </div>
            </div>
        </div>
        <p class="dialogue-view__text"></p>
        <div class="dialogue-view__choices-container">
          ${choicesHTML}
        </div>
      </div>
    `;

    this.textElement = this.element.querySelector<HTMLParagraphElement>(
      ".dialogue-view__text",
    );
    this.choicesElement = this.element.querySelector<HTMLDivElement>(
      ".dialogue-view__choices-container",
    );

    this.startTypingAnimation(currentDialogueText);

    // Choices event listeners
    this.element
      .querySelectorAll<HTMLButtonElement>(".choice-button")
      .forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent the click from bubbling up to the dialogue container
          const choiceId = button.dataset.choiceId?.trim() ?? "";
          const choiceText = button.textContent?.trim() ?? "action";

          if (choiceId) {
            this.choiceSelectedCallback?.(choiceId);
          }

          console.log(
            `Choix sélectionné : ${choiceText} (id: ${choiceId || "N/A"})`,
          );

          this.dialogue?.Choose(choiceId);
          console.log(`Dialogue après le choix :`, this.dialogue);

          this.updateDialogue(this.dialogue);
        });
      });

    // Dialogue container click event listener for Continue
    this.element
      .querySelector<HTMLDivElement>(".dialogue-view__dialogue-container")
      ?.addEventListener("click", (event) => {
        const target = event.target;
        if (
          target instanceof HTMLElement &&
          target.closest(".dialogue-view__choices-container")
        ) {
          return;
        }

        if (this.isTyping) {
          this.finishTypingAnimation();
          return;
        }

        console.log("Dialogue container clicked. Continuing dialogue...");
        if (this.dialogue?.Continue()) {
          console.log(`Dialogue après la continuation :`, this.dialogue);
          this.updateDialogue(this.dialogue);
        }
      });
  }
}
