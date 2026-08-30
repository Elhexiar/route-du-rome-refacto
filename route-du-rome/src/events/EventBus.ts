/**
 * Simple pub/sub event bus for decoupled communication between services and views.
 * Replaces direct dependencies with event-based communication.
 */

export interface GameEvent {
  type: string;
  data?: Record<string, any>;
  timestamp?: number;
}

export type EventListener = (event: GameEvent) => void;

export class EventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();

  /**
   * Subscribe to an event type
   */
  on(eventType: string, listener: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
  }

  /**
   * Subscribe to an event once, then automatically unsubscribe
   */
  once(eventType: string, listener: EventListener): void {
    const wrappedListener: EventListener = (event: GameEvent) => {
      listener(event);
      this.off(eventType, wrappedListener);
    };
    this.on(eventType, wrappedListener);
  }

  /**
   * Unsubscribe from an event type
   */
  off(eventType: string, listener: EventListener): void {
    this.listeners.get(eventType)?.delete(listener);
  }

  /**
   * Emit an event to all listeners
   */
  emit(event: GameEvent): void {
    event.timestamp = event.timestamp ?? Date.now();
    this.listeners.get(event.type)?.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in listener for event ${event.type}:`, error);
      }
    });
  }

  /**
   * Clear all listeners (useful for testing)
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Get count of listeners for an event type (useful for debugging)
   */
  listenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.size ?? 0;
  }
}
