export type IdeunCharacterId = "angel-normal-a";

export type IdeunSettings = {
  onboardingDone: boolean;
  movementEnabled: boolean;
  characterId: IdeunCharacterId;
  overlayClickThrough: boolean;

  // Reminder logic
  remindAfterMs: number;

  // ✅ Real blink tracking
  cameraEnabled: boolean;
  blinkClosedRatio: number; // lower = more sensitive (detects "closed" easier)
};

export const DEFAULT_SETTINGS: IdeunSettings = {
  onboardingDone: false,
  movementEnabled: true,
  characterId: "angel-normal-a",
  overlayClickThrough: true,

  remindAfterMs: 8000,

  cameraEnabled: true,
  blinkClosedRatio: 0.68,
};
