import type { INpcController } from "#IControllers/index.ts";
import type { INpc } from "#IEntities/INpc.ts";
import type { ConfigData } from "#Entities/Config.ts";
import { Npc, type NpcData } from "#Entities/Npc.ts";
import { Dialogue } from "#src/entities/dialogue/Dialogue.ts";
import { VideoPreloadService } from "#Services/VideoPreloadService.ts";

export class NpcController implements INpcController {
  Npcs: INpc[] = [];
  private onNpcsLoadedCallbacks: Array<(npcs: INpc[]) => void> = [];

  constructor(configPath: string = "/config.json") {
    void this.LoadNpcsFromConfig(configPath);
  }

  private async LoadNpcsFromConfig(configPath?: string): Promise<void> {
    const safeConfigPath = configPath ?? "/config.json";

    const response = await fetch(safeConfigPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load config: ${response.status} ${response.statusText}`,
      );
    }

    const configData: ConfigData = await response.json();

    VideoPreloadService.preloadVideos(
      configData.Npcs.map((npcData) => npcData.backgroundVideo),
    );

    this.AddNpcsFromJSON(configData);
    this.onNpcsLoadedCallbacks.forEach((callback) => callback(this.Npcs));
  }

  AddNpc(npc: INpc): void {
    this.Npcs.push(npc);
  }

  AddNpcsFromJSON(data: ConfigData): void {
    data.Npcs.forEach((npcData: NpcData) => {
      const npc: INpc = new Npc(
        npcData.id,
        npcData.name,
        npcData.color,
        npcData.job,
        npcData.jobSector,
        npcData.icon,
        npcData.portrait,
        npcData.lattitude,
        npcData.longitude,
        npcData.backgroundVideo,
        npcData.jobVideoUrl,
        npcData.videoTitle,
        null, // presentationDialogue will be set later
        [],
      );

      // building the presentation dialogue for the NPC if it exists
      if (npcData.presentationDialogue) {
        const parsedDialogue = new Dialogue(
          npc,
          npc.name + "-presentation-dialogue",
          npcData.presentationDialogue,
        );
        npc.presentationDialogue = parsedDialogue;
      }

      this.AddNpc(npc);
    });
    console.log("NPCs added from JSON:", this.Npcs);
  }

  RemoveNpc(npc: INpc): void {
    const index = this.Npcs.findIndex((n) => n.id === npc.id);
    if (index !== -1) {
      this.Npcs.splice(index, 1);
    }
  }

  GetNpcById(id: string): INpc | undefined {
    return this.Npcs.find((npc) => npc.id === id);
  }
  GetAllNpcs(): INpc[] {
    return this.Npcs;
  }

  onNpcsLoaded(callback: (npcs: INpc[]) => void): void {
    this.onNpcsLoadedCallbacks.push(callback);
  }
}
