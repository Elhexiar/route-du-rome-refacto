import type { IBadgeService } from "#IServices/index";
import type { IBadge } from "../interfaces/entities";
import { GameManager } from "#Controllers/GameManager";
import { NotebookView } from "#UI/experience/NotebookView.ts";

export class BadgeService implements IBadgeService {
  badges: Map<string, IBadge>;
  collectedBadges: Set<string>;
  onBadgeCollectedCallbacks: (() => void)[] = [];
  onBadgeUncollectedCallbacks: (() => void)[] = [];

  notebookView: NotebookView | null = null;

  get NotebookView(): NotebookView | null {
    return this.notebookView;
  }

  set NotebookView(value: NotebookView | null) {
    this.notebookView = value;
  }

  constructor() {
    this.badges = new Map<string, IBadge>();
    this.collectedBadges = new Set<string>();

    const app = GameManager.app;
    if (app) {
      this.notebookView = new NotebookView(app);
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
    this.notebookView?.ShowView();

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

    return true;
  }
}
