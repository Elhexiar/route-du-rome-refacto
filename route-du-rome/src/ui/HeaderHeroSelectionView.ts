import { GameManager } from "#Controllers/GameManager";

export class HeaderHeroSelectionView {
  private readonly element: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement("section");
    this.element.className = "header-hero-selection-view";
    container.prepend(this.element);
    this.render();

    // Re-render when heroes are loaded asynchronously
    GameManager.heroController?.onHeroesLoaded(() => this.render());
  }

  render(): void {
    const heroesButtons =
      GameManager.heroController?.heroes
        .map(
          (hero) => `
        <div class="header-hero-selection-view__hero-button" data-hero-id="${hero.id}">
          <img src="${hero.portrait}" alt="${hero.name}" class="header-hero-selection-view__hero-portrait" />
          <span>${hero.name}</span>
        </div>
      `,
        )
        .join("") ?? "";

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
                    <h1>Route du Rome</h1>
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
                <p>0/10</p>
                <div class="header-hero-selection-view__notebook-button"></div>
                <div class="header-hero-selection-view__settings-button"></div>
              </div>
            </div>
        `;

    const heroButtons = this.element.querySelectorAll(
      ".header-hero-selection-view__hero-button",
    );

    heroButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const heroId = button.getAttribute("data-hero-id");
        if (heroId) {
          GameManager.heroController?.SwitchHeroById(heroId);
        }
      });
    });
  }
}
