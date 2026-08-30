import type { INpcController } from "#IControllers/index.ts";
import type { INpc } from "#IEntities/INpc.ts";
import type { ConfigData } from "#Entities/Config.ts";
import { Npc, type NpcData } from "#Entities/Npc.ts";
import { Dialogue } from "#src/entities/dialogue/Dialogue.ts";
import { VideoPreloadService } from "#Services/VideoPreloadService.ts";

export class NpcController implements INpcController {
  npcs: INpc[] = [];
  private onNpcsLoadedCallbacks: Array<(npcs: INpc[]) => void> = [];

  get Npcs(): INpc[] {
    return this.npcs;
  }

  set Npcs(value: INpc[]) {
    this.npcs = value;
  }

  constructor(configPath: string = "/config.json") {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      void this.loadNpcsFromConfig(configPath);
    }
  }

  private async loadNpcsFromConfig(configPath?: string): Promise<void> {
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

    this.addNpcsFromJson(configData);
    this.onNpcsLoadedCallbacks.forEach((callback) => callback(this.npcs));
  }

  async LoadNpcsFromConfig(configPath?: string): Promise<void> {
    return this.loadNpcsFromConfig(configPath);
  }

  addNpc(npc: INpc): void {
    this.npcs.push(npc);
  }

  addNpcsFromJson(data: ConfigData): void {
    data.Npcs.forEach((npcData: NpcData) => {
      const npc: INpc = Npc.fromJson(npcData);

      if (npcData.presentationDialogue) {
        const parsedDialogue = new Dialogue(
          npc,
          `${npc.name}-presentation-dialogue`,
          npcData.presentationDialogue,
        );
        npc.presentationDialogue = parsedDialogue;
      }

      this.addNpc(npc);
    });
    console.log("NPCs added from JSON:", this.npcs);
  }

  removeNpc(npc: INpc): void {
    const index = this.npcs.findIndex((n) => n.id === npc.id);
    if (index !== -1) {
      this.npcs.splice(index, 1);
    }
  }

  getNpcById(id: string): INpc | undefined {
    return this.npcs.find((npc) => npc.id === id);
  }

  getAllNpcs(): INpc[] {
    return this.npcs;
  }

  onNpcsLoaded(callback: (npcs: INpc[]) => void): void {
    this.onNpcsLoadedCallbacks.push(callback);
  }
}
