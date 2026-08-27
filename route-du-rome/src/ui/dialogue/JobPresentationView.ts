import type { INpc } from "#IEntities/INpc.ts";
import type { DialogueView } from "./DialogueView";

export class JobPresentationView {
  private dialogueView: DialogueView;

  private npc: INpc;

  private reply: string | null = null;

  private readonly element: HTMLElement;
  private closeCallback: (() => void) | null = null;

  constructor(container: HTMLElement, dialogueView: DialogueView, npc: INpc) {
    this.dialogueView = dialogueView;
    this.npc = npc;

    this.element = document.createElement("section");
    this.element.className = "job-presentation-view";
    container.appendChild(this.element);
    this.render();
  }

  render(): void {
    // if already open, keep it open after re-rendering
    const wasOpen = this.element
      .querySelector<HTMLElement>("#voverlay")
      ?.classList.contains("open");

    // reset reply on new render
    this.reply = "";

    this.element.innerHTML = `
    <div id="voverlay">
      <div class="vmodal">
        <div class="vmod-head">
          <div class="vmod-icon" id="vi">${this.npc.icon}</div>
          <div>
            <div class="vmod-title" id="vt">${this.npc.jobSector}</div>
            <div class="vmod-sub" id="vs">${this.npc.name} · Ille-et-Vilaine</div>
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
            <div class="vchoices" id="vcs">
              <div class="vc" id="vc0">
              <span class="vcl">1</span>
              ${this.npc.presentationDialogue?.rootNode?.nextNode?.choices?.[0].text}</div>
              <div class="vc" id="vc1">
                <span class="vcl">2</span>
                ${this.npc.presentationDialogue?.rootNode?.nextNode?.choices?.[1].text}
              </div>
              <div class="vc" id="vc2">
                <span class="vcl">3</span>
                ${this.npc.presentationDialogue?.rootNode?.nextNode?.choices?.[2].text}
              </div>
            </div>
            <div class="vdlg-reply show" id="vdr">
              ${this.reply ?? ""}
            </div>
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

    this.configureJobVideo();

    if (wasOpen) {
      this.element
        .querySelector<HTMLElement>("#voverlay")
        ?.classList.add("open");
    }

    const choices = this.element.querySelectorAll<HTMLElement>(".vc");
    choices.forEach((choice, index) => {
      choice.addEventListener("click", () => {
        this.reply =
          this.npc.presentationDialogue?.rootNode?.nextNode?.choices?.[index]
            .next?.text ?? null;

        // Update the reply instead of re-rendering the entire view to avoid losing the open state
        this.element.querySelector<HTMLElement>("#vdr")!.textContent =
          this.reply ?? "";
      });
    });

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
  }

  private configureJobVideo(): void {
    const iframe = this.element.querySelector<HTMLIFrameElement>("#vyt");
    const placeholder = this.element.querySelector<HTMLElement>("#vph");
    const title = this.element.querySelector<HTMLElement>("#vvt");

    if (!iframe || !placeholder) {
      return;
    }

    if (title) {
      title.textContent = this.npc.videoTitle || "Vidéo du métier";
    }

    const showPlaceholder = () => {
      iframe.style.display = "none";
      placeholder.style.display = "block";
    };

    const videoUrl = this.npc.jobVideoUrl?.trim();
    if (!videoUrl) {
      showPlaceholder();
      return;
    }

    iframe.addEventListener(
      "load",
      () => {
        iframe.style.display = "block";
        placeholder.style.display = "none";
      },
      { once: true },
    );
    iframe.addEventListener("error", showPlaceholder, { once: true });
    iframe.src = videoUrl;
  }

  UpdateNPC(npc: INpc): void {
    this.npc = npc;
    this.render();
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
