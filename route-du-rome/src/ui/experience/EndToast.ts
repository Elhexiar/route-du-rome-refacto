import type { IBadgeService } from "#src/interfaces/services/IBadgeService.ts";
import type { IQuestService } from "#src/interfaces/services/IQuestService.ts";

export class EndToast {
  private readonly toastElement: HTMLElement;
  private readonly runtime: {
    experienceController?: {
      badgeService?: Pick<IBadgeService, "getAllBadges">;
      questService?: Pick<IQuestService, "levelData">;
    } | null;
  };

  constructor(
    container: HTMLElement,
    runtime: {
      experienceController?: {
        badgeService?: Pick<IBadgeService, "getAllBadges">;
        questService?: Pick<IQuestService, "levelData">;
      } | null;
    },
  ) {
    this.toastElement = document.createElement("div");
    this.toastElement.id = "end-overlay";
    container.appendChild(this.toastElement);
    this.runtime = runtime;
    this.render();
  }

  render(): void {
    const badgeService = this.runtime.experienceController?.badgeService;
    const questService = this.runtime.experienceController?.questService;
    const badges = badgeService?.getAllBadges?.() ?? [];

    const totalXP = badges.length * 150;

    const totalJobs = badges.length;
    const finalLevel = totalJobs + 1;

    const finalPlayerLevelIcon =
      questService?.levelData[finalLevel - 1]?.icon || "🌱";

    this.toastElement.innerHTML = `
        <div id="end-screen">
        <div class="end-header">
          <div class="end-header-stars">🏆🌟🏆</div>
          <div class="end-header-title">Aventure terminée !</div>
          <div class="end-header-sub">
            Tu as exploré tous les métiers du 35 — félicitations !
          </div>
        </div>
        <div class="end-body">
          <!-- Stats -->
          <div class="end-stats-row">
            <div class="end-stat">
              <div class="end-stat-val" id="end-xp">${totalXP}</div>
              <div class="end-stat-lbl">XP total</div>
            </div>
            <div class="end-stat">
              <div class="end-stat-val" id="end-jobs">${totalJobs}</div>
              <div class="end-stat-lbl">Métiers</div>
            </div>
            <div class="end-stat">
              <div class="end-stat-val" id="end-level">${finalLevel}</div>
              <div class="end-stat-lbl">Niveau final</div>
            </div>
          </div>
          <!-- Niveau obtenu -->
          <div class="end-level-row">
            <div class="end-level-icon" id="end-level-icon">${finalPlayerLevelIcon}</div>
            <div class="end-level-info">
              <div class="end-level-name" id="end-level-name">
                Expert des métiers du 35
              </div>
              <div class="end-level-sub">
                Tu maîtrises maintenant les filières de l'Ille-et-Vilaine
              </div>
            </div>
          </div>
          <!-- Badges collectés -->
          <div class="end-section-title">🎖️ Badges collectés</div>
          <div class="end-badges-grid" id="end-badges-grid"></div>
          <!-- CTAs -->
          <div class="end-cta">
          </div>
        </div>
      </div>
      `;

    const gridElement =
      this.toastElement.querySelector<HTMLElement>("#end-badges-grid");
    if (gridElement) {
      badges.forEach((badge) => {
        const card = document.createElement("div");
        card.className = "end-badge";
        card.style.setProperty("--badge-color", badge.color || "var(--violet)");
        card.innerHTML =
          '<span class="end-badge-icon">' +
          badge.icon +
          "</span>" +
          '<div class="end-badge-name">' +
          badge.name +
          "</div>" +
          '<div class="end-badge-npc">' +
          badge.description +
          "</div>" +
          '<span class="end-badge-xp">+' +
          150 +
          " XP</span>";
        gridElement.appendChild(card);
      });
    }
  }

  ShowToast(): void {
    // Update the toast content before showing it
    this.render();

    this.toastElement.classList.add("open");
  }

  HideToast(): void {
    this.toastElement.classList.remove("open");
  }

  ToggleToast(): void {
    this.toastElement.classList.toggle("open");
  }
}
