export class TutorialView {
  private readonly element: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement("section");
    this.element.className = "tutorial-view";
    container.appendChild(this.element);
    this.render();
  }

  render(): void {
    this.element.innerHTML = `


        <div id="tuto-overlay">
      <div id="tuto-bubble">
        <div id="tuto-header">
          <span class="tuto-emoji">🗺️</span>
          <h2>Bienvenue sur La Route du Rome !</h2>
          <p>Voici comment jouer en quelques étapes :</p>
        </div>

        <div id="tuto-body">
          <div class="tuto-steps">
            <div class="tuto-step">
              <div class="tuto-step-icon">🧭</div>
              <div class="tuto-step-text">
                <div class="tuto-step-title">Explore la carte</div>
                <div class="tuto-step-desc">
                  Navigue sur la carte de l'Ille-et-Vilaine en la faisant
                  glisser. Des personnages t'attendent un peu partout !
                </div>
              </div>
            </div>

            <div class="tuto-step">
              <div class="tuto-step-icon">💬</div>
              <div class="tuto-step-text">
                <div class="tuto-step-title">Parle aux personnages</div>
                <div class="tuto-step-desc">
                  Clique sur un personnage pour lui parler. Réponds à ses
                  questions pour découvrir son métier et avancer dans la quête.
                </div>
              </div>
            </div>

            <div class="tuto-step">
              <div class="tuto-step-icon">🏆</div>
              <div class="tuto-step-text">
                <div class="tuto-step-title">Gagne des XP et des badges</div>
                <div class="tuto-step-desc">
                  Complète chaque quête pour remporter des points d'XP, monter
                  de niveau et débloquer des badges dans ton carnet de bord.
                </div>
              </div>
            </div>

            <div class="tuto-step">
              <div class="tuto-step-icon">📓</div>
              <div class="tuto-step-text">
                <div class="tuto-step-title">Consulte ton carnet</div>
                <div class="tuto-step-desc">
                  Le bouton <b style="color: var(--plum)">📓</b> en haut à
                  droite affiche les métiers découverts et ta progression
                  globale.
                </div>
              </div>
            </div>
          </div>

          <div class="tuto-tip">
            <span>💡</span>
            <span
              >Choisis ton personnage — Élio ou Élia — en haut au centre avant
              de commencer l'aventure !</span
            >
          </div>
        </div>

        <div id="tuto-footer">
          <button id="tuto-start-btn" type="button">
            🚀 C'est parti !
          </button>
          <button id="tuto-skip" type="button">
            Ne plus afficher ce message
          </button>
        </div>
      </div>
    </div>

        `;

    const overlay = this.element.querySelector<HTMLElement>("#tuto-overlay");
    const closeButtons = this.element.querySelectorAll<HTMLButtonElement>(
      "#tuto-start-btn, #tuto-skip",
    );

    // Show the overlay when the view is rendered
    overlay?.classList.add("open");

    // close the overlay when any of the close buttons are clicked
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        overlay?.classList.remove("open");
      });
    });
  }
}
