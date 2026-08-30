import { GameManager } from "#Controllers/GameManager";
import type { IBadgeService } from "#src/interfaces/services";
import type { IHeroController } from "#IControllers/index.ts";

export class NotebookView {
  private readonly element: HTMLElement;
  private readonly runtime: {
    badgeService?: IBadgeService | null;
    heroController?: IHeroController | null;
  };

  constructor(
    container: HTMLElement,
    runtime: {
      badgeService?: IBadgeService | null;
      heroController?: IHeroController | null;
    } | null = null,
  ) {
    this.element = document.createElement("section");
    this.element.className = "notebook-view";
    container.appendChild(this.element);
    this.runtime = runtime ?? {
      badgeService: GameManager.experienceController?.badgeService,
      heroController: GameManager.heroController,
    };
    this.render();
  }

  render(): void {
    const badges = this.runtime.badgeService?.getAllBadges() ?? [];
    const completedBadges =
      this.runtime.badgeService?.getAllCollectedBadges() ?? [];
    const collectedBadgeIds = Array.from(
      this.runtime.badgeService?.collectedBadges ?? [],
    );

    // used to highlight the latest collected badge
    const latestBadgeId = collectedBadgeIds.at(-1);

    const badgesElement = badges
      .map((badge) => {
        const isLatestBadge = badge.id === latestBadgeId;
        return `
                    <div class="notebook-view__badge ${badge.collected ? "active" : "inactive"} ${isLatestBadge ? "new" : ""}">
                        <div class="notebook-view__badge__color" style="background: ${badge.collected ? badge.color : "#ccc"};"></div>
                        <div class="notebook-view__badge__icon ${badge.collected ? "active" : "inactive"}">
                            ${badge.collected ? badge.icon : "🔒"}
                        </div>
                        <div class="notebook-view__badge__sector">
                        ${badge.name}
                    </div>
                    <div class="notebook-view__badge__description">
                        ${badge.description}
                    </div>
                    <div class="notebook-view__badge__reward" style= "background: ${badge.collected ? badge.color : "#ccc"};">
                        ${badge.collected ? "+150 XP" : "? XP"}
                    </div>
                </div>
            `;
      })
      .join("");

    const levelProgressionPercentage =
      completedBadges.length > 0
        ? (completedBadges.length / badges.length) * 100
        : 0;

    const levelTitle = `Niveau ${completedBadges.length}`;
    // Calculate the level progression as a percentage ( to the 2 decimal places)
    const levelProgression = `${(badges.length > 0 ? completedBadges.length / badges.length : 0).toFixed(2)}%`;
    const totalBadgesCounter = badges.length;
    const badgeCounter = completedBadges.length;

    const currentDate = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    this.element.innerHTML = `
              <div class="notebook-view__notebook">
                <div class="notebook-view__header">
                    <p>◯◯◯◯◯◯◯◯</p>
                    <div class="notebook-view__title">📓 Mon carnet de bord</div>
                    <div class="notebook-view__close-button">X</div>
                </div>
                <div class="notebook-view__body">
                    <div class="notebook-view__body__header">
                        <div class="notebook-view__body__header__start">
                          <img class="notebook-view__body__header__start__portrait" src="${this.runtime.heroController?.currentHero?.portrait ?? "chemin/vers/portrait.jpg"}" alt="Portrait du joueur" />
                          <div class="notebook-view__body__header__start__player-info">
                            <div class="notebook-view__body__header__start__player-info__name">
                                ${this.runtime.heroController?.currentHero?.name ?? "Nom du joueur"}
                            </div>
                            <div class="notebook-view__body__header__start__player-info__job">
                                ${this.runtime.heroController?.currentHero?.role ?? "Métier du joueur"}
                            </div>
                          </div>
                        </div>
                        <div class="notebook-view__body__header__end">
                                ${completedBadges.length * 150} XP
                        </div>
                    </div>
                    <div class="notebook-view__body__separator"></div>
                    <div class="notebook-view__body__content">
                        <div class="notebook-view__body__title">
                        ✏️ Badges collectés
                        </div>
                        <div class="notebook-view__body__badges">
                        ${badgesElement}
                        </div>
                    </div>
                    <div class="notebook-view__body__separator"></div>
                    <div class="notebook-view__body__footer">
                        <div class="notebook-view__body__footer__title">
                        📊 Progression
                        </div>
                        <div class="notebook-view__body__footer__level-title">
                            <div class="notebook-view__body__footer__level-title__label">
                            ${levelTitle}
                            </div>
                            <div class="notebook-view__body__footer__level-progression">
                            ${levelProgression}
                            </div>
                        </div>
                        <div class="notebook-view__body__footer__level-bar">
                            <div class="notebook-view__body__footer__level-bar__fill" style="width: ${levelProgressionPercentage}%"></div>
                        </div>
                        <div class="notebook-view__body__footer__quest-counter">
                            ${badgeCounter} métier découverts sur ${totalBadgesCounter}
                        </div>
                    </div>
                </div>
                <div class="notebook-view__footer">
                    <div class="notebook-view__footer__start">
                        <p>La Route du Rome · France Travail · Ille-et-Vilaine</p>
                    </div>
                    <div class="notebook-view__footer__end">
                        ${currentDate}
                    </div>
                </div>
              </div>
            `;

    const closeButton = this.element.querySelector(
      ".notebook-view__close-button",
    );
    closeButton?.addEventListener("click", () => {
      this.HideView();
    });
  }

  ShowView(): void {
    this.render(); // Re-render the view to update the badges and progress
    this.element.style.display = "flex";
  }

  HideView(): void {
    this.element.style.display = "none";
  }

  ToggleView(): void {
    if (
      this.element.style.display === "none" ||
      this.element.style.display === ""
    ) {
      this.ShowView();
    } else {
      this.HideView();
    }
  }
}
