import { GameManager } from "#Controllers/GameManager";
import type { BadgeService } from "#src/services/BadgeService.ts";

export class HeaderHeroSelectionView {
  private readonly element: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement("section");
    this.element.className = "header-hero-selection-view";
    container.prepend(this.element);
    this.render();

    // Re-render when heroes are loaded asynchronously
    GameManager.heroController?.onHeroesLoaded(() => this.render());

    // Re-render when the hero is switched
    GameManager.heroController?.onHeroesSwitched(() => this.render());

    // Re-render when a badge is collected or uncollected
    GameManager.experienceController?.badgeService.onBadgeCollected(() =>
      this.render(),
    );
    GameManager.experienceController?.badgeService.onBadgeUncollected(() =>
      this.render(),
    );
  }

  render(): void {
    const currentHeroId = GameManager.heroController?.currentHero?.id;
    const heroesButtons =
      GameManager.heroController?.heroes
        .map(
          (hero) => `
        <div class="header-hero-selection-view__hero-button ${hero.id === currentHeroId ? "active" : "inactive"}" data-hero-id="${hero.id}">
          <img src="${hero.portrait}" alt="${hero.name}" class="header-hero-selection-view__hero-portrait" />
          <span>${hero.name}</span>
        </div>
      `,
        )
        .join("") ?? "";

    const nbBadgeTotal =
      GameManager.experienceController?.badgeService.getAllBadges().length ?? 0;

    const nbBadgeCollected =
      GameManager.experienceController?.badgeService.getAllCollectedBadges()
        .length ?? 0;

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
                <p>XP</p>
                <div class="header-hero-selection-view__xp-bar">
                  <div class="header-hero-selection-view__xp-bar-fill"></div>
                </div>
                <p>0/150</p>
                <div class="header-hero-selection-view__level"></div>
                <p>Métiers : </p>
                <p>${nbBadgeCollected}/${nbBadgeTotal}</p>
                <div class="header-hero-selection-view__notebook-button">📓 ${nbBadgeCollected}</div>
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
          GameManager.heroController?.SwitchHeroById(heroId);
        }
      });
    });

    const backStartButton = this.element.querySelector(
      ".header-hero-selection-view__backstart-button",
    );
    backStartButton?.addEventListener("click", () => {
      // Implement the logic to navigate back to the home screen
      console.log("Navigating back to the home screen...");
    });

    const notebookButton = this.element.querySelector(
      ".header-hero-selection-view__notebook-button",
    );
    notebookButton?.addEventListener("click", () => {
      const badgeService = GameManager.experienceController
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
