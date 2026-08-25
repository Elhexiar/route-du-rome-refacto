export interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;

  collected: boolean;

  // onUnlock is now an array of functions to allow multiple actions to be executed when the badge is unlocked
  onUnlock: (() => void)[];

  checkUnlockCondition(): boolean;
  Unlock(): void;
}
