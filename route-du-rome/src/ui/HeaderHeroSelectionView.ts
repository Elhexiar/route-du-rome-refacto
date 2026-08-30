import type { BadgeService } from "#src/services/BadgeService.ts";
import type { DialogueController, HeroController } from "../controllers";
import type {
  IHeroController,
  IExperienceController,
  IDialogueController,
} from "#IControllers/index.ts";
import type { IHero } from "#IEntities/index.ts";

export class HeaderHeroSelectionView {
  private readonly element: HTMLElement;
  private readonly runtime: {
    heroController?: IHeroController | null;
    experienceController?: IExperienceController | null;
    dialogueController?: IDialogueController | null;
  };

  constructor(
    container: HTMLElement,
    runtime: {
      heroController?: IHeroController | null;
      experienceController?: IExperienceController | null;
      dialogueController?: IDialogueController | null;
    } | null = null,
  ) {
    this.element = document.createElement("section");
    this.element.className = "header-hero-selection-view";
    container.prepend(this.element);
    this.runtime = runtime ?? {};
    this.render();

    // Re-render when heroes are loaded asynchronously
    this.runtime.heroController?.onHeroesLoaded(() => this.render());

    // Re-render when the hero is switched
    this.runtime.heroController?.onHeroesSwitched(() => this.render());

    // Re-render when a badge is collected or uncollected
    this.runtime.experienceController?.badgeService.onBadgeCollected(() =>
      this.render(),
    );
    this.runtime.experienceController?.badgeService.onBadgeUncollected(() =>
      this.render(),
    );
  }

  render(): void {
    const currentHeroId = this.runtime.heroController?.currentHero?.id;
    const heroesButtons =
      this.runtime.heroController?.heroes
        .map(
          (hero: IHero) => `
        <div class="header-hero-selection-view__hero-button ${hero.id === currentHeroId ? "active" : "inactive"}" data-hero-id="${hero.id}">
          <img src="${hero.portrait}" alt="${hero.name}" class="header-hero-selection-view__hero-portrait" />
          <span>${hero.name}</span>
        </div>
      `,
        )
        .join("") ?? "";

    const experienceController = this.runtime.experienceController;
    const currentLevel = experienceController?.currentLevel ?? 1;
    const currentLevelDefinition =
      experienceController?.getCurrentLevelDefinition();

    const totalBadges =
      this.runtime.experienceController?.badgeService.getAllBadges().length ??
      0;

    const collectedBadges =
      this.runtime.experienceController?.badgeService.getAllCollectedBadges()
        .length ?? 0;

    const badgeProgressPercentage =
      totalBadges === 0
        ? 0
        : Math.min(100, (collectedBadges / totalBadges) * 100);

    this.element.innerHTML = `
            <div class="header header-hero-selection-view__body">
              <div class="header-hero-selection-view__start">
                <div class="header-hero-selection-view__backstart-button">
                  ← Accueil
                </div>
                <div class="header-hero-selection-view__location-signature">
                  FT · 35
                </div>
                <div class="header-hero-selection-view__title">
                    LA ROUTE<span> DU ROME</span>
                </div>
              </div>
              <div class="header-hero-selection-view__center">
                <p class="header-hero-selection-view__hero-selection-text-info">
                Perso : 
                </p>
                ${heroesButtons}
              </div>
              <div class="header-hero-selection-view__end">
                <p>Métiers</p>
                <div class="header-hero-selection-view__xp-bar">
                  <div class="header-hero-selection-view__xp-bar-fill" style="width: ${badgeProgressPercentage}%"></div>
                </div>
                <p>${collectedBadges}/${totalBadges}</p>
                <div class="header-hero-selection-view__level">${currentLevelDefinition?.icon ?? "🌱"} Niveau ${currentLevel}</div>
                <div class="header-hero-selection-view__notebook-button">📓 ${collectedBadges}</div>
                <div class="header-hero-selection-view__settings-button">⚙️ </div>
              </div>
            </div>
        `;

    const heroButtons = this.element.querySelectorAll(
      ".header-hero-selection-view__hero-button",
    );

    heroButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const heroId = (button as HTMLElement).dataset.heroId;
        if (heroId) {
          this.runtime.heroController?.SwitchHeroById(heroId);
        }
      });
    });

    const backStartButton = this.element.querySelector(
      ".header-hero-selection-view__backstart-button",
    );
    backStartButton?.addEventListener("click", () => {
      const heroController = this.runtime.heroController as HeroController;
      const dialogueController = this.runtime
        .dialogueController as DialogueController;
      dialogueController.dialogueView?.HideView();
      heroController.welcomeHeroSelectionView?.ShowView();
    });

    const notebookButton = this.element.querySelector(
      ".header-hero-selection-view__notebook-button",
    );
    notebookButton?.addEventListener("click", () => {
      const badgeService = this.runtime.experienceController
        ?.badgeService as BadgeService;
      badgeService.NotebookView?.ShowView();
    });

    const settingsButton = this.element.querySelector(
      ".header-hero-selection-view__settings-button",
    );
    settingsButton?.addEventListener("click", () => {
      // Implement the logic to open the settings view
      console.log("Opening the settings view...");
    });
  }
}
