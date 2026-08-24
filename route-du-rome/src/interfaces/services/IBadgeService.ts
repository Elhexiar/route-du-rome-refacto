import type { IBadge } from "../entities";

export interface IBadgeService {
  badges: Map<string, IBadge>;

  getBadgeById(badgeId: string): Promise<IBadge | null>;
  getAllBadges(): Promise<IBadge[]>;
  createBadge(badgeData: IBadge): Promise<IBadge>;
  updateBadge(
    badgeId: string,
    badgeData: Partial<IBadge>,
  ): Promise<IBadge | null>;
  deleteBadge(badgeId: string): Promise<boolean>;
}
