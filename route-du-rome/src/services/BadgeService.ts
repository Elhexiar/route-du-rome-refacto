import type { IBadgeService } from "#IServices/index";
import type { IBadge } from "../interfaces/entities";

export class BadgeService implements IBadgeService {
  badges: Map<string, IBadge> = new Map<string, IBadge>();
  getBadgeById(badgeId: string): Promise<IBadge | null> {
    throw new Error("Method not implemented.");
  }
  getAllBadges(): Promise<IBadge[]> {
    throw new Error("Method not implemented.");
  }
  createBadge(badgeData: IBadge): Promise<IBadge> {
    throw new Error("Method not implemented.");
  }
  updateBadge(
    badgeId: string,
    badgeData: Partial<IBadge>,
  ): Promise<IBadge | null> {
    throw new Error("Method not implemented.");
  }
  deleteBadge(badgeId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
