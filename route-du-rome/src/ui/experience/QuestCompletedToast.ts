import { GameManager } from "#src/controllers/index.ts";
import type { ConfigData } from "#src/entities/Config.ts";
import type { INpc } from "#src/interfaces/entities/index.ts";

export class QuestCompletedToast {
  private readonly element: HTMLElement;

  private readonly levelData: ConfigData["Levels"] = null as any;

  constructor(root: HTMLElement, levelData: ConfigData["Levels"]) {
    this.element = root;
    this.levelData = levelData;

    this.element = document.createElement("div");
    this.element.className = "quest-completed-toast";

    root.appendChild(this.element);

    this.render();
  }

  render(): void {
    const currentLevel = GameManager.experienceController?.currentLevel ?? 1;
    const levelTitle = `Niveau ${currentLevel}`;

    this.element.innerHTML = `

    <div id="levelup-toast">
      <div class="lut-stars">⭐✨⭐</div>
      <div class="lut-title">Niveau supérieur !</div>
      <div class="lut-sub" id="lut-sub">Tu es maintenant au niveau ${currentLevel}</div>
      <div class="lut-badge" id="lut-badge">${levelTitle}</div>
    </div>
    `;
  }

  UpdateToast(): void {
    this.render();
  }

  ShowToast(): void {
    console.log("SHOWING QUEST COMPLETED TOAST");
    this.UpdateToast();

    const toast = this.element.querySelector<HTMLElement>("#levelup-toast");
    if (toast) {
      // Force the hidden state to be rendered before starting the enter transition.
      void toast.offsetWidth;
      toast.classList.add("show");
    }

    setTimeout(() => {
      toast?.classList.remove("show");
    }, 2000);
  }
}
