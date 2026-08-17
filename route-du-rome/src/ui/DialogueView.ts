// THIS IS JUST A TEST

export class DialogueView {
  private readonly element: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement("section");
    this.element.className = "dialogue-view";
    container.appendChild(this.element);
    this.render();
  }

  private render(): void {
    this.element.innerHTML = `
      <header class="dialogue-view__header">
        <h2>Route du Rome</h2>
        <p>Bienvenue dans votre aventure narrative.</p>
      </header>

      <div class="dialogue-view__body">
        <p>Choisissez la prochaine action de votre héros.</p>
        <div class="dialogue-view__actions">
          <button class="button button--primary">Continuer</button>
          <button class="button button--secondary">Explorer</button>
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
