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

    // If the video has already ended, we don't want to restart it.
    if (videoElement.ended) {
      return;
    }

    const markReadyAndPlay = () => {
      // Mark the video as ready and attempt to play it.
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

    // If the video is not ready, we need to load it and wait for it to be ready.
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
