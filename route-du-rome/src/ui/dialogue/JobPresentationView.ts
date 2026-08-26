import type { DialogueView } from "./DialogueView";

export class JobPresentationView {
  private dialogueView: DialogueView;

  private readonly element: HTMLElement;
  private closeCallback: (() => void) | null = null;

  constructor(container: HTMLElement, dialogueView: DialogueView) {
    this.dialogueView = dialogueView;

    this.element = document.createElement("section");
    this.element.className = "job-presentation-view";
    container.appendChild(this.element);
    this.render();
  }

  render(): void {
    this.element.innerHTML = `
    <div id="voverlay">
      <div class="vmodal">
        <div class="vmod-head">
          <div class="vmod-icon" id="vi">⚓</div>
          <div>
            <div class="vmod-title" id="vt">Métier</div>
            <div class="vmod-sub" id="vs">Découverte · Ille-et-Vilaine</div>
          </div>
          <button class="vmod-x" type="button">✕</button>
        </div>
        <div class="vmod-body">
          <!-- Zone vidéo (iframe YouTube ou placeholder) -->
          <div class="vplayer" id="vpl">
            <iframe
              id="vyt"
              frameborder="0"
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
              "
              allowfullscreen
              style="
                display: none;
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                border-radius: 8px;
              "
            ></iframe>
            <video
              id="vvid"
              controls
              loop
              style="
                display: none;
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                border-radius: 8px;
                object-fit: cover;
              "
            ></video>
            <div class="vph" id="vph">
              <div class="pr">▶</div>
              <strong id="vvt">Vidéo du métier</strong>
              <p>Vidéo disponible prochainement</p>
            </div>
          </div>
          <!-- Dialogue avec choix -->
          <div class="vdlg-wrap">
            <div class="vdlg-question" id="vdq">
              Qu'est-ce qui t'intéresse dans ce métier ?
            </div>
            <div class="vchoices" id="vcs"></div>
            <div class="vdlg-reply" id="vdr"></div>
          </div>
          <!-- Récompense -->
          <div class="vreward">
            <div class="vri">🏆</div>
            <div>
              <div class="vrt" id="vrt">+150 XP</div>
              <div class="vrs">Valide la quête pour gagner ta récompense</div>
            </div>
          </div>
          <div class="vactions">
            <button class="btn btn-g" type="button">Fermer</button>
            <button
              class="btn btn-v"
              id="v-validate-btn"
              
            >
              ✅ Quête accomplie !
            </button>
          </div>
        </div>
      </div>
    </div>

    `;

    const overlay = this.element.querySelector<HTMLElement>("#voverlay");
    const closeButtons = this.element.querySelectorAll<HTMLButtonElement>(
      ".vmod-x, .btn-g, .btn-v",
    );

    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.closeCallback?.();

        this.HideView();
        this.dialogueView?.HideView();
      });
    });

    overlay?.classList.remove("open");
  }

  ShowView(): void {
    this.element.style.display = "block";
    this.element.querySelector<HTMLElement>("#voverlay")?.classList.add("open");
  }

  onClosed(callback: () => void): void {
    this.closeCallback = callback;
  }

  HideView(): void {
    this.element.style.display = "none";
    this.element
      .querySelector<HTMLElement>("#voverlay")
      ?.classList.remove("open");
  }

  ToggleView(): void {
    if (this.element.style.display === "none") {
      this.ShowView();
    } else {
      this.HideView();
    }
  }
}
