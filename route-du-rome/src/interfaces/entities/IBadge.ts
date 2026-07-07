export interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;

  checkUnlockCondition(): boolean;
  Unlock(): void;
  onUnlock: () => void;
  Reward(): void;
}
