import { GameManager } from "#Controllers/GameManager";
import type { DialogueController } from "#Controllers/DialogueController";
import type {
  IHeroController,
  IDialogueController,
} from "#IControllers/index.ts";
import { TutorialView } from "./TutorialView";

export class WelcomeHeroSelectionView {
  private readonly element: HTMLElement;
  private readonly runtime: {
    heroController?: IHeroController | null;
    dialogueController?: IDialogueController | null;
  };

  tutorialView: TutorialView | null = null;

  constructor(
    container: HTMLElement,
    runtime: {
      heroController?: IHeroController | null;
      dialogueController?: IDialogueController | null;
    } | null = null,
  ) {
    this.element = document.createElement("section");
    this.element.className = "welcome-hero-selection-view";
    container.appendChild(this.element);
    this.runtime = runtime ?? {
      heroController: GameManager.heroController,
      dialogueController: GameManager.dialogueController,
    };

    this.render();
    this.tutorialView = new TutorialView(this.element);
  }

  render(): void {
    const heroCards =
      this.runtime.heroController?.heroes
        .map(
          (hero) => `
            <div class="hero-card" data-hero-id="${hero.id}">
            <img src="${hero.portrait}" alt="${hero.name}" class="hero-card__portrait" />
            <div class="card-info">
                <div class="card-name">${hero.name}</div>
                <div class="card-role">${hero.role} · Niveau 1</div>
                <div class="card-tags">
                ${hero.tags.map((tag) => `<span class="card-tag">${tag}</span>`).join("")}
                </div>
            </div>
            </div>
        `,
        )
        .join("") ?? "";

    this.element.innerHTML = `
    <div class="ft-badge">France Travail · Ille-et-Vilaine</div>
    <div class="game-title">LA ROUTE<br><span>DU ROME</span></div>
    <div class="game-sub">Découvre les métiers du 35</div>
      <div class="cards-row">
        ${heroCards}
      </div>
      <div class="pick-hint">👆 Clique sur ton personnage pour commencer</div>
 `;

    this.element.querySelectorAll<HTMLElement>(".hero-card").forEach((card) => {
      card.addEventListener("click", () => {
        const heroId = card.dataset.heroId;
        if (heroId) {
          this.ClickCard(heroId);
        }
      });
    });
  }

  ClickCard(heroId: string): void {
    const heroController = this.runtime.heroController;
    if (heroController) {
      const hero = heroController.heroes.find((h) => h.id === heroId);
      if (hero) {
        heroController.SwitchHero(hero);
        this.HideView();
        const dialogueController = this.runtime
          .dialogueController as DialogueController;

        dialogueController.dialogueView?.ResetForNewSpeaker(hero);
        dialogueController.dialogueView?.ShowView();
      }
    }
  }

  ShowView(): void {
    this.element.style.display = "flex";
  }

  HideView(): void {
    this.element.style.display = "none";
  }

  ToggleView(): void {
    if (this.element.style.display === "none") {
      this.ShowView();
    } else {
      this.HideView();
    }
  }
}
