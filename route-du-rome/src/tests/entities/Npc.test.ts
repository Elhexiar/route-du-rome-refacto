import { describe, expect, it } from "vitest";

import { Npc } from "#Entities/Npc.ts";
import { Dialogue } from "#src/entities/dialogue/Dialogue.ts";

describe("Npc JSON DTO to runtime entity", () => {
  it("creates a runtime NPC from the canonical latitude field", () => {
    const npc = Npc.fromJson({
      id: "maritime",
      name: "Morgane",
      color: "#406BDE",
      job: "Officière de pêche · Saint-Malo",
      jobSector: "Maritime",
      icon: "⚓",
      portrait: "/portraits/MorganePP.png",
      latitude: 48.649,
      longitude: -2.025,
      backgroundVideo: "/videos/Morgane1.mp4",
      jobVideoUrl: "https://www.youtube.com/embed/hlov7EFUT7E",
      videoTitle: "Les métiers de la mer en Bretagne",
      presentationDialogue: null,
      relatedQuestsIds: [],
    });

    expect(npc.latitude).toBe(48.649);
    expect(npc.longitude).toBe(-2.025);
  });

  it("accepts the legacy lattitude field from the existing config payload", () => {
    const npc = Npc.fromJson({
      id: "maritime",
      name: "Morgane",
      color: "#406BDE",
      job: "Officière de pêche · Saint-Malo",
      jobSector: "Maritime",
      icon: "⚓",
      portrait: "/portraits/MorganePP.png",
      lattitude: 48.649,
      longitude: -2.025,
      backgroundVideo: "/videos/Morgane1.mp4",
      jobVideoUrl: "https://www.youtube.com/embed/hlov7EFUT7E",
      videoTitle: "Les métiers de la mer en Bretagne",
      presentationDialogue: null,
      relatedQuestsIds: [],
    });

    expect(npc.latitude).toBe(48.649);
    expect(npc.longitude).toBe(-2.025);
  });

  it("creates a runtime NPC from a config JSON payload and binds its presentation dialogue", () => {
    const npcJson = {
      id: "maritime",
      name: "Morgane",
      color: "#406BDE",
      job: "Officière de pêche · Saint-Malo",
      jobSector: "Maritime",
      icon: "⚓",
      portrait: "/portraits/MorganePP.png",
      latitude: 48.649,
      longitude: -2.025,
      backgroundVideo: "/videos/Morgane1.mp4",
      jobVideoUrl: "https://www.youtube.com/embed/hlov7EFUT7E",
      videoTitle: "Les métiers de la mer en Bretagne",
      presentationDialogue: {
        id: "morgane-intro-0",
        text: "Salut ! Moi c'est Morgane.",
        next: {
          id: "morgane-intro-1",
          text: "Le secteur maritime breton offre des milliers d'emplois.",
        },
      },
    };

    const npc = new Npc(
      npcJson.id,
      npcJson.name,
      npcJson.color,
      npcJson.job,
      npcJson.jobSector,
      npcJson.icon,
      npcJson.portrait,
      npcJson.latitude,
      npcJson.longitude,
      npcJson.backgroundVideo,
      npcJson.jobVideoUrl,
      npcJson.videoTitle,
      null,
      [],
    );

    const presentationDialogue = new Dialogue(
      npc,
      `${npc.name}-presentation-dialogue`,
      npcJson.presentationDialogue,
    );
    npc.presentationDialogue = presentationDialogue;
    npc.dialogues.unshift(presentationDialogue);

    expect(npc.id).toBe("maritime");
    expect(npc.name).toBe("Morgane");
    expect(npc.jobSector).toBe("Maritime");
    expect(npc.icon).toBe("⚓");
    expect(npc.latitude).toBe(48.649);
    expect(npc.longitude).toBe(-2.025);
    expect(npc.presentationDialogue).toBe(presentationDialogue);
    expect(npc.dialogues[0]).toBe(presentationDialogue);
    expect(npc.presentationDialogue?.rootNode?.id).toBe("morgane-intro-0");
    expect(npc.done).toBe(false);
    expect(npc.accessible).toBe(true);
    expect(npc.currentActiveDialogue).toBeNull();
  });

  it("creates a valid NPC runtime object even when the JSON lacks a presentation dialogue", () => {
    const npc = new Npc(
      "agriculture",
      "Sarah",
      "#8B5BB8",
      "Agricultrice bio",
      "Agriculture",
      "🌾",
      "/portraits/SarahPP.png",
      48.554,
      -1.75,
      "/videos/Sarah.mp4",
      "https://example.test/agriculture",
      "L'agriculture bio en Bretagne",
      null,
      [],
    );

    expect(npc.presentationDialogue).toBeNull();
    expect(npc.dialogues).toEqual([]);
    expect(npc.done).toBe(false);
    expect(npc.accessible).toBe(true);
  });
});
