// C:\Users\User\Downloads\ideun v1\src\shared\types\settings.ts
export type IdeunCharacterId = "angel-normal-a" | "yaong-normal-a";

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
