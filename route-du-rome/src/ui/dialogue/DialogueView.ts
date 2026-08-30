// THIS IS JUST A TEST
import type { IHero } from "#IEntities/IHero";
import type { INpc } from "#IEntities/INpc";
import type { IDialogue } from "#IEntities/dialogue/IDialogue";
import type { IDialogueView } from "#IUI/IDialogueView";
import type { IChoice } from "#src/interfaces/entities/dialogue/IDialogueNode.ts";
import type {
  IExperienceController,
  IDialogueController,
} from "#IControllers/index.ts";
import { DialogueBackgroundVideoController } from "./DialogueBackgroundVideoController.ts";
import {
  initializeDialogueLayout,
  renderChoicesHtml,
} from "./DialogueTemplate.ts";
import { DialogueTypingAnimator } from "./DialogueTypingAnimator.ts";
import { JobPresentationView } from "./JobPresentationView.ts";

// TODO : I Replaced the NPCDialogueView with a more generic DialogueView that can handle both NPCs and Heroes.
// But it still has a lot of legacy code from the NPCDialogueView

export class DialogueView implements IDialogueView {
  speaker: INpc | IHero | null = null;
  dialogue: IDialogue | null = null;
  currentVisibility: boolean = false;

  jobPresentationView: JobPresentationView | null = null;

  private choiceSelectedCallback: ((choiceId: string) => void) | null = null;
  private readonly textElement: HTMLParagraphElement;
  private readonly choicesElement: HTMLDivElement;

  private readonly element: HTMLElement;
  private readonly typingAnimator = new DialogueTypingAnimator(24);
  private readonly backgroundVideoController: DialogueBackgroundVideoController;
  private readonly runtime: {
    experienceController?: IExperienceController | null;
    dialogueController?: IDialogueController | null;
  };

  constructor(
    container: HTMLElement,
    runtime: {
      experienceController?: IExperienceController | null;
      dialogueController?: IDialogueController | null;
    },
  ) {
    this.element = document.createElement("section");
    this.element.className = "dialogue-view";
    container.appendChild(this.element);
    this.runtime = runtime;

    const layoutRefs = initializeDialogueLayout(this.element);
    this.textElement = layoutRefs.textElement;
    this.choicesElement = layoutRefs.choicesElement;

    this.backgroundVideoController = new DialogueBackgroundVideoController(
      this.element,
    );
    this.bindDialogueContainerClick();
    this.bindKeyboardEvents();
    this.bindCloseButton();

    this.render();
  }

  ShowView(): void {
    this.element.style.display = "flex";
    this.backgroundVideoController.ensurePlayback();
    this.currentVisibility = true;
  }

  HideView(): void {
    this.typingAnimator.stop();
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

    // make sure its an NPC with a job, not a hero or other type of speaker
    if ("job" in speaker) {
      if (this.jobPresentationView) {
        this.jobPresentationView.UpdateNPC(speaker);
      } else {
        this.jobPresentationView = new JobPresentationView(
          this.element.parentElement ?? document.body,
          this,
          speaker,
        );

        this.jobPresentationView.onClosed(() => {
          const currentSpeaker = this.speaker;
          if (currentSpeaker && "job" in currentSpeaker) {
            this.runtime.dialogueController?.completeQuestForSpeaker(
              currentSpeaker,
            );
          }
        });
      }
    }

    if (this.runtime.dialogueController) {
      this.runtime.dialogueController.currentActiveDialogue = this.dialogue;
    }
    this.render();
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
    this.notifyController();
  }

  // TODO: inverse the logic here, have the dialogue controller hook on a callback from the view, instead of the view notifying the controller
  notifyController() {
    if (this.runtime.dialogueController) {
      console.log(
        "Mise à jour du dialogue actif dans le DialogueController :",
        this.speaker?.name,
      );
      this.runtime.dialogueController.currentActiveDialogue = this.dialogue;
    }
  }

  onChoiceSelected(callback: (choiceId: string) => void): void {
    this.choiceSelectedCallback = callback;
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

  private onTypingFinished(): void {
    this.dialogue?.currentNode?.OnEndActions?.forEach((action) => action());
  }

  private startTypingAnimation(text: string): void {
    this.typingAnimator.start(text, this.textElement, this.choicesElement, () =>
      this.onTypingFinished(),
    );
  }

  private finishTypingAnimation(): void {
    this.typingAnimator.finish(this.textElement, this.choicesElement, () =>
      this.onTypingFinished(),
    );
  }

  private tryForwardingText(): void {
    if (!this.currentVisibility) {
      return;
    }

    if (this.typingAnimator.typing) {
      this.finishTypingAnimation();
      return;
    }

    console.log("Dialogue container clicked. Continuing dialogue...");
    if (this.dialogue?.Continue()) {
      console.log(`Dialogue après la continuation :`, this.dialogue);
      this.updateDialogue(this.dialogue);
    }
  }

  private bindDialogueContainerClick(): void {
    const dialogueContainer = this.element.querySelector<HTMLDivElement>(
      ".dialogue-view__dialogue-container",
    );

    if (!dialogueContainer) {
      return;
    }

    dialogueContainer.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      // If the click is on a choice button, we don't want to continue the dialogue, so we return early.
      if (target.closest(".dialogue-view__choices-container")) {
        return;
      }

      this.tryForwardingText();
    });
  }

  private bindKeyboardEvents(): void {
    document.addEventListener("keydown", (event) => {
      if (event.code !== "Space" || !this.currentVisibility) {
        return;
      }

      event.preventDefault();
      this.tryForwardingText();
    });
  }

  private bindChoiceButtons(): void {
    this.choicesElement
      .querySelectorAll<HTMLButtonElement>(".choice-button")
      .forEach((choiceButton) => {
        choiceButton.addEventListener("click", (event) => {
          event.stopPropagation();

          const choiceId = choiceButton.dataset.choiceId?.trim() ?? "";
          const choiceText = choiceButton.textContent?.trim() ?? "action";

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
  }

  private bindCloseButton(): void {
    const closeButton = this.element.querySelector<HTMLButtonElement>(
      ".dialogue-view__exit-button",
    );

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        this.HideView();
      });
    }
  }

  private getBackgroundVideoSource(): string {
    if (!this.speaker) {
      return "/videos/default-background.mp4";
    }

    return "backgroundVideo" in this.speaker
      ? this.speaker.backgroundVideo
      : this.speaker.presentationVideo;
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
    const currentSpeakerPortrait =
      this.speaker?.portrait || "default-portrait.jpg";
    const currentDialogueText =
      currentNode?.text ?? "Aucun dialogue disponible.";
    const currentChoices = (currentNode?.choices ?? []) as IChoice[];
    const rawBackgroundMediaSrc = this.getBackgroundVideoSource();

    const choicesHTML = renderChoicesHtml(currentChoices, (text) =>
      this.escapeHtml(text),
    );

    this.backgroundVideoController.setSource(rawBackgroundMediaSrc);

    const portraitElement = this.element.querySelector<HTMLImageElement>(
      ".dialogue-view__npc-portrait",
    );
    if (portraitElement) {
      portraitElement.src = currentSpeakerPortrait;
      portraitElement.alt = currentSpeakerName;
    }

    const nameElement = this.element.querySelector<HTMLElement>(
      ".dialogue-view__npc-name",
    );
    if (nameElement) {
      nameElement.textContent = currentSpeakerName;
    }

    const roleElement = this.element.querySelector<HTMLElement>(
      ".dialogue-view__npc-role",
    );
    if (roleElement) {
      roleElement.textContent = currentSpeakerRole || "Rôle inconnu";
    }

    const iconElement = this.element.querySelector<HTMLElement>(
      ".dialogue-view__npc-job-icon",
    );
    if (iconElement) {
      iconElement.textContent = currentSpeakerIcon || "🎭";
    }

    this.choicesElement.innerHTML = choicesHTML;

    this.bindChoiceButtons();

    this.startTypingAnimation(currentDialogueText);

    if (this.currentVisibility) {
      this.backgroundVideoController.ensurePlayback();
    }
  }
}
