<<<<<<< HEAD
// C:\Users\User\Downloads\ideun v1\src\shared\types\settings.ts

// ✅ Added "pabo-normal-a"
export type IdeunCharacterId = "angel-normal-a" | "yaong-normal-a" | "pabo-normal-a";

export type IdeunSettings = {
  enabled: boolean;
  characterId: IdeunCharacterId;

  overlayClickThrough: boolean;
  movementEnabled: boolean;
  onboardingDone: boolean;

  remindAfterMs: number;

  cameraEnabled: boolean;
  blinkClosedRatio: number;

  calibrateToken: number;
};

export const DEFAULT_SETTINGS: IdeunSettings = {
  enabled: true,
  characterId: "angel-normal-a",

  overlayClickThrough: false,
  movementEnabled: true,
  onboardingDone: false,

  remindAfterMs: 9000,

  cameraEnabled: true,
  blinkClosedRatio: 0.65,

  calibrateToken: 0,
};
=======
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
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
