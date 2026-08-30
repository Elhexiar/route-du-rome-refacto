import type { IBadgeService } from "#IServices/index";
import type { IBadge } from "../interfaces/entities";
import { NotebookView } from "#UI/experience/NotebookView.ts";
import type { IHeroController } from "#IControllers/index.ts";
import type { EventBus } from "../events/EventBus";
import { AppEvents } from "../events/AppEvents";

export class BadgeService implements IBadgeService {
  badges: Map<string, IBadge>;
  collectedBadges: Set<string>;
  onBadgeCollectedCallbacks: (() => void)[] = [];
  onBadgeUncollectedCallbacks: (() => void)[] = [];

  notebookView: NotebookView | null = null;
  private readonly runtime: {
    app?: HTMLElement | null;
    heroController?: IHeroController | null;
    eventBus?: EventBus | null;
  };

  get NotebookView(): NotebookView | null {
    return this.notebookView;
  }

  set NotebookView(value: NotebookView | null) {
    this.notebookView = value;
  }

  constructor(
    runtime: {
      app?: HTMLElement | null;
      heroController?: IHeroController | null;
      eventBus?: EventBus | null;
    } | null = null,
  ) {
    this.badges = new Map<string, IBadge>();
    this.collectedBadges = new Set<string>();
    this.runtime = runtime ?? {};

    const app = this.runtime.app;
    if (app && !this.runtime.eventBus) {
      this.notebookView = new NotebookView(app, {
        badgeService: this,
        heroController: this.runtime.heroController,
      });
    }
  }

  onBadgeCollected(callback: () => void): void {
    this.onBadgeCollectedCallbacks.push(callback);
  }

  onBadgeUncollected(callback: () => void): void {
    this.onBadgeUncollectedCallbacks.push(callback);
  }

  getBadgeById(badgeId: string): IBadge | null {
    return this.badges.get(badgeId) ?? null;
  }

  getAllBadges(): IBadge[] {
    return Array.from(this.badges.values());
  }

  getAllCollectedBadges(): IBadge[] {
    return Array.from(this.badges.values()).filter(
      (badge): badge is IBadge => badge.collected,
    );
  }

  createBadge(badgeData: IBadge): IBadge {
    this.badges.set(badgeData.id, badgeData);
    return badgeData;
  }

  updateBadge(badgeId: string, badgeData: Partial<IBadge>): IBadge | null {
    const badge = this.getBadgeById(badgeId);
    if (!badge) {
      return null;
    }

    Object.assign(badge, badgeData);
    return badge;
  }

  deleteBadge(badgeId: string): boolean {
    return this.badges.delete(badgeId);
  }

  collectBadge(badgeId: string): boolean {
    const badge = this.getBadgeById(badgeId);
    if (!badge || badge.collected) {
      return false;
    }

    badge.Unlock();
    this.collectedBadges.add(badgeId);
    this.onBadgeCollectedCallbacks.forEach((callback) => callback());
    this.emitBadgeCollected(badgeId);
    if (!this.runtime.eventBus) {
      this.notebookView?.ShowView();
    }

    return true;
  }

  uncollectBadge(badgeId: string): boolean {
    const badge = this.getBadgeById(badgeId);
    if (!badge?.collected) {
      return false;
    }

    badge.collected = false;
    this.collectedBadges.delete(badgeId);
    this.onBadgeUncollectedCallbacks.forEach((callback) => callback());
    this.emitBadgeUncollected(badgeId);

    return true;
  }

  /**
   * Emit event when a badge is collected.
   * This is called alongside the existing callback logic.
   * Future: UI components will listen to events instead of relying on callbacks.
   */
  emitBadgeCollected(badgeId: string): void {
    this.runtime.eventBus?.emit({
      type: AppEvents.BADGE_COLLECTED,
      data: { badgeId },
    });
  }

  /**
   * Emit event when a badge is uncollected.
   * This is called alongside the existing callback logic.
   */
  emitBadgeUncollected(badgeId: string): void {
    this.runtime.eventBus?.emit({
      type: AppEvents.BADGE_UNCOLLECTED,
      data: { badgeId },
    });
  }
}
