/**
 * Typed event definitions for game events.
 * These are the events that services, controllers, and views can emit/listen to.
 */

export const AppEvents = {
  // Quest events
  QUEST_STARTED: "QUEST_STARTED",
  QUEST_COMPLETED: "QUEST_COMPLETED",

  // Experience/Level events
  EXPERIENCE_GAINED: "EXPERIENCE_GAINED",
  LEVEL_UP: "LEVEL_UP",

  // Badge events
  BADGE_COLLECTED: "BADGE_COLLECTED",
  BADGE_UNCOLLECTED: "BADGE_UNCOLLECTED",

  // Hero events
  HERO_SWITCHED: "HERO_SWITCHED",
  HEROES_LOADED: "HEROES_LOADED",

  // Dialogue events
  DIALOGUE_STARTED: "DIALOGUE_STARTED",
  DIALOGUE_ENDED: "DIALOGUE_ENDED",

  // NPC events
  NPCS_LOADED: "NPCS_LOADED",
  NPC_VISITED: "NPC_VISITED",

  // UI events
  NOTIFICATION_SHOW: "NOTIFICATION_SHOW",
  NOTIFICATION_HIDE: "NOTIFICATION_HIDE",

  // Game state
  GAME_STARTED: "GAME_STARTED",
  GAME_ENDED: "GAME_ENDED",
} as const;

export type AppEventType = (typeof AppEvents)[keyof typeof AppEvents];

/**
 * Type-safe event payload definitions.
 * When adding events, define the payload structure here.
 */
export interface AppEventPayloads {
  [AppEvents.QUEST_STARTED]: { questId: string; npcId: string };
  [AppEvents.QUEST_COMPLETED]: { questId: string; xpReward: number };
  [AppEvents.EXPERIENCE_GAINED]: { amount: number; totalExperience: number };
  [AppEvents.LEVEL_UP]: { newLevel: number; totalExperience: number };
  [AppEvents.BADGE_COLLECTED]: { badgeId: string };
  [AppEvents.BADGE_UNCOLLECTED]: { badgeId: string };
  [AppEvents.HERO_SWITCHED]: { heroId: string; heroName: string };
  [AppEvents.HEROES_LOADED]: { count: number };
  [AppEvents.DIALOGUE_STARTED]: { speakerId: string; speakerName: string };
  [AppEvents.DIALOGUE_ENDED]: { speakerId: string };
  [AppEvents.NPCS_LOADED]: { count: number };
  [AppEvents.NPC_VISITED]: { npcId: string; npcName: string };
  [AppEvents.NOTIFICATION_SHOW]: {
    type: "toast" | "toast-quest" | "toast-end";
    message: string;
    duration?: number;
  };
  [AppEvents.NOTIFICATION_HIDE]: { notificationType?: string };
  [AppEvents.GAME_STARTED]: Record<string, never>;
  [AppEvents.GAME_ENDED]: Record<string, never>;
}
