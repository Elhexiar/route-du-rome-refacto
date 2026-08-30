import type { IBadge } from "../entities";

export interface IBadgeService {
  badges: Map<string, IBadge>;
  collectedBadges: Set<string>;
  NotebookView: { ShowView(): void; HideView(): void } | null;

  onBadgeCollected(callback: () => void): void;
  onBadgeUncollected(callback: () => void): void;

  getBadgeById(badgeId: string): IBadge | null;
  getAllBadges(): IBadge[];
  getAllCollectedBadges(): IBadge[];
  createBadge(badgeData: IBadge): IBadge;
  updateBadge(badgeId: string, badgeData: Partial<IBadge>): IBadge | null;
  deleteBadge(badgeId: string): boolean;
  collectBadge(badgeId: string): boolean;
  uncollectBadge(badgeId: string): boolean;
}
