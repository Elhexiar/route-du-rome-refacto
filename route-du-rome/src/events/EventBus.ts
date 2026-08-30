/**
 * Simple pub/sub message bus for typed application events.
 */
import type { AppEventPayloads, AppEventType } from "./AppEvents";

export type AppEvent<T extends AppEventType = AppEventType> = {
  [EventType in T]: {
    type: EventType;
    data: AppEventPayloads[EventType];
    timestamp?: number;
  };
}[T];

export type EventListener<T extends AppEventType = AppEventType> = (
  event: AppEvent<T>,
) => void;

export type GameEvent = AppEvent;

export class EventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();

  on<T extends AppEventType>(eventType: T, listener: EventListener<T>): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener as EventListener);
  }

  once<T extends AppEventType>(
    eventType: T,
    listener: EventListener<T>,
  ): void {
    const wrappedListener: EventListener<T> = (event) => {
      listener(event);
      this.off(eventType, wrappedListener);
    };
    this.on(eventType, wrappedListener);
  }

  off<T extends AppEventType>(eventType: T, listener: EventListener<T>): void {
    this.listeners.get(eventType)?.delete(listener as EventListener);
  }

  emit<T extends AppEventType>(event: AppEvent<T>): void {
    event.timestamp = event.timestamp ?? Date.now();
    this.listeners.get(event.type)?.forEach((listener) => {
      try {
        (listener as EventListener<T>)(event);
      } catch (error) {
        console.error(`Error in listener for event ${event.type}:`, error);
      }
    });
  }

  clear(): void {
    this.listeners.clear();
  }

  listenerCount(eventType: AppEventType): number {
    return this.listeners.get(eventType)?.size ?? 0;
  }
}
