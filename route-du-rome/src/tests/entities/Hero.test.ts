import { describe, expect, it } from "vitest";

import { Hero } from "#Entities/Hero.ts";
import { Dialogue } from "#src/entities/dialogue/Dialogue.ts";

describe("Hero JSON DTO to runtime entity", () => {
  it("creates a runtime Hero from a config JSON payload and attaches the parsed presentation dialogue", () => {
    const heroJson = {
      id: "elio",
      name: "Élio",
      role: "Explorateur France Travail",
      description: "Un aventurier qui explore les métiers du 35.",
      bio: "Originaire de Rennes.",
      portrait: "/portraits/ElioPP.png",
      presentationVideo: "/videos/Elio1.mp4",
      presentationDialogue: {
        id: "elio-presentation-0",
        text: "Bonjour !",
        next: {
          id: "elio-presentation-1",
          text: "Je parcours les métiers du 35.",
        },
      },
      tags: ["⚡ Dynamique", "🗺️ Curieux"],
    };

    const hero = new Hero(
      heroJson.id,
      heroJson.name,
      heroJson.role,
      heroJson.description,
      heroJson.bio,
      heroJson.portrait,
      heroJson.presentationVideo,
      null,
      [],
      heroJson.tags,
    );

    const presentationDialogue = new Dialogue(
      hero,
      `${hero.name}-presentation-dialogue`,
      heroJson.presentationDialogue,
    );
    hero.presentationDialogue = presentationDialogue;
    hero.dialogues.unshift(presentationDialogue);

    expect(hero.id).toBe("elio");
    expect(hero.name).toBe("Élio");
    expect(hero.tags).toEqual(["⚡ Dynamique", "🗺️ Curieux"]);
    expect(hero.presentationDialogue).toBe(presentationDialogue);
    expect(hero.dialogues[0]).toBe(presentationDialogue);
    expect(hero.presentationDialogue?.rootNode?.id).toBe("elio-presentation-0");
    expect(hero.currentActiveDialogue).toBeNull();
  });

  it("keeps the runtime hero state empty when no dialogue payload is supplied", () => {
    const hero = new Hero(
      "elia",
      "Élia",
      "Exploratrice",
      "Une conseillère en herbe.",
      "Originaire de Saint-Malo.",
      "/portraits/EliaPP.png",
      "/videos/Elia1.mp4",
    );

    expect(hero.dialogues).toEqual([]);
    expect(hero.presentationDialogue).toBeUndefined;
    expect(hero.currentActiveDialogue).toBeNull();
  });
});
