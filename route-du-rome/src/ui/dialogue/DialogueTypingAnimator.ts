export class DialogueTypingAnimator {
  private readonly typingSpeedMs: number;
  private typingIntervalId: number | null = null;
  private isTyping = false;
  private fullText = "";

  constructor(typingSpeedMs: number) {
    this.typingSpeedMs = typingSpeedMs;
  }

  get typing(): boolean {
    return this.isTyping;
  }

  stop(): void {
    if (this.typingIntervalId !== null) {
      window.clearInterval(this.typingIntervalId);
      this.typingIntervalId = null;
    }

    this.isTyping = false;
  }

  finish(
    textElement: HTMLParagraphElement | null,
    choicesElement: HTMLDivElement | null,
    onFinished?: () => void,
  ): void {
    this.stop();

    if (textElement) {
      textElement.textContent = this.fullText;
    }

    if (choicesElement) {
      choicesElement.style.visibility = "visible";
      choicesElement.style.pointerEvents = "auto";
    }

    onFinished?.();
  }

  start(
    text: string,
    textElement: HTMLParagraphElement | null,
    choicesElement: HTMLDivElement | null,
    onFinished?: () => void,
  ): void {
    this.stop();
    this.fullText = text;

    if (!textElement) {
      return;
    }

    textElement.textContent = text.length > 0 ? text[0] : "";

    if (choicesElement) {
      choicesElement.style.visibility = "hidden";
      choicesElement.style.pointerEvents = "none";
    }

    if (!text.length) {
      this.finish(textElement, choicesElement, onFinished);
      return;
    }

    this.isTyping = true;
    let characterIndex = 1;

    this.typingIntervalId = window.setInterval(() => {
      characterIndex += 1;

      if (!textElement) {
        this.stop();
        return;
      }

      textElement.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        this.finish(textElement, choicesElement, onFinished);
      }
    }, this.typingSpeedMs);
  }
}
