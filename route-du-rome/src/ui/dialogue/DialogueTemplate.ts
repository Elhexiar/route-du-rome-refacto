import type { IChoice } from "#src/interfaces/entities/dialogue/IDialogueNode.ts";

// This file contains utility functions and types for rendering dialogue templates in the UI.

// a dialogue layout consists of a text element and a choices container
export type DialogueLayoutRefs = {
  textElement: HTMLParagraphElement;
  choicesElement: HTMLDivElement;
};

export function initializeDialogueLayout(
  root: HTMLElement,
): DialogueLayoutRefs {
  // Clear the root element's content before initializing the layout
  root.innerHTML = `
    <div class="dialogue-view__body">
      <video class="dialogue-view__background-video" preload="auto" autoplay muted playsinline></video>
      <div class="dialogue-view__overlay"></div>
    </div>

    <div class="dialogue-view__dialogue-container">
      <div class="dialogue-view__header">
        <div class="dialogue-view__npc-info">
          <div class="dialogue-view__header-start">
            <img src="default-portrait.jpg" alt="Interlocuteur" class="dialogue-view__npc-portrait">
            <div class="dialogue-view__title-container">
              <h2 class="dialogue-view__npc-name">Interlocuteur</h2>
              <p class="dialogue-view__npc-role">Rôle inconnu</p>
            </div>
          </div>
          <div class="dialogue-view__header-end">
            <span class="dialogue-view__npc-job-icon">🎭</span>
            <button class="dialogue-view__exit-button">x</button>
          </div>
        </div>
      </div>
      <p class="dialogue-view__text"></p>
      <div class="dialogue-view__choices-container"></div>
    </div>
  `;

  return {
    textElement: root.querySelector<HTMLParagraphElement>(
      ".dialogue-view__text",
    ) as HTMLParagraphElement,
    choicesElement: root.querySelector<HTMLDivElement>(
      ".dialogue-view__choices-container",
    ) as HTMLDivElement,
  };
}

export function renderChoicesHtml(
  choices: IChoice[],
  escapeHtml: (text: string) => string,
): string {
  if (!choices.length) {
    return "";
  }

  return choices
    .map(
      (choice, index) => `
        <button class="button choice-button" data-choice-id="${escapeHtml(choice.id)}">
          <div class="choice-button__index">${escapeHtml((index + 1).toString())}</div>
          <div class="choice-button__text">${escapeHtml(choice.text)}</div>
        </button>
      `,
    )
    .join("");
}
