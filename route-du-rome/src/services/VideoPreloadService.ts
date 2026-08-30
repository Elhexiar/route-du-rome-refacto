export class VideoPreloadService {
  private static readonly preloadedUrls = new Set<string>();
  private static readonly preloadElements = new Map<string, HTMLVideoElement>();
  private static readonly reportedReadyUrls = new Set<string>();

  static preloadVideos(urls: string[]): void {
    if (typeof document === "undefined") {
      return;
    }

    urls.forEach((url) => {
      const normalizedUrl = url.trim();
      if (!normalizedUrl) {
        return;
      }

      if (this.preloadedUrls.has(normalizedUrl)) {
        return;
      }

      const preloadVideo = document.createElement("video");
      preloadVideo.preload = "auto";
      preloadVideo.muted = true;
      preloadVideo.playsInline = true;
      preloadVideo.src = normalizedUrl;

      const reportReady = (source: "canplaythrough" | "loadeddata") => {
        if (this.reportedReadyUrls.has(normalizedUrl)) {
          return;
        }

        this.reportedReadyUrls.add(normalizedUrl);
        console.log(
          `[VideoPreloadService] ready (${source}): ${normalizedUrl}`,
        );
      };

      preloadVideo.addEventListener(
        "canplaythrough",
        () => reportReady("canplaythrough"),
        { once: true },
      );
      preloadVideo.addEventListener("loadeddata", () => {
        if (preloadVideo.readyState >= 3) {
          reportReady("loadeddata");
        }
      });
      preloadVideo.addEventListener("error", () => {
        console.warn(
          `[VideoPreloadService] failed to preload: ${normalizedUrl}`,
        );
      });

      preloadVideo.load();

      this.preloadedUrls.add(normalizedUrl);
      this.preloadElements.set(normalizedUrl, preloadVideo);
    });
  }
}
