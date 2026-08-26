export class DialogueBackgroundVideoController {
  private readonly root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  setSource(src: string): void {
    const videoElement = this.getVideoElement();
    if (!videoElement) {
      return;
    }

    if (videoElement.getAttribute("src") === src) {
      return;
    }

    videoElement.classList.remove("is-ready");
    videoElement.src = src;
  }

  ensurePlayback(): void {
    const videoElement = this.getVideoElement();
    if (!videoElement) {
      return;
    }

    const markReadyAndPlay = () => {
      videoElement.classList.add("is-ready");
      void videoElement.play().catch(() => {
        // Autoplay may still be blocked on some browsers despite muted=true.
      });
    };

    videoElement.preload = "auto";

    if (videoElement.readyState >= 2) {
      markReadyAndPlay();
      return;
    }

    videoElement.load();
    videoElement.addEventListener("loadeddata", markReadyAndPlay, {
      once: true,
    });
  }

  private getVideoElement(): HTMLVideoElement | null {
    return this.root.querySelector<HTMLVideoElement>(
      ".dialogue-view__background-video",
    );
  }
}
