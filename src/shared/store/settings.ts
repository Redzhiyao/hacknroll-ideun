import {
  DEFAULT_SETTINGS,
  type IdeunSettings,
  type IdeunCharacterId,
} from "../types/settings";

const KEY = "ideun_settings_v1";
const VALID_CHARACTERS: IdeunCharacterId[] = ["angel-normal-a"];

function normalizeSettings(s: Partial<IdeunSettings>): IdeunSettings {
  const merged: IdeunSettings = { ...DEFAULT_SETTINGS, ...s } as IdeunSettings;

  if (!VALID_CHARACTERS.includes(merged.characterId)) {
    merged.characterId = DEFAULT_SETTINGS.characterId;
  }

  merged.overlayClickThrough = !!merged.overlayClickThrough;
  merged.movementEnabled = !!merged.movementEnabled;
  merged.onboardingDone = !!merged.onboardingDone;

  // remindAfterMs clamp
  const ms = Number(merged.remindAfterMs);
  merged.remindAfterMs = Number.isFinite(ms)
    ? Math.max(1500, Math.min(ms, 120000))
    : DEFAULT_SETTINGS.remindAfterMs;

  merged.cameraEnabled = !!merged.cameraEnabled;

  // blinkClosedRatio clamp
  const r = Number(merged.blinkClosedRatio);
  merged.blinkClosedRatio = Number.isFinite(r)
    ? Math.max(0.5, Math.min(r, 0.85))
    : DEFAULT_SETTINGS.blinkClosedRatio;

  return merged;
}

export function getSettings(): IdeunSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<IdeunSettings>;
    return normalizeSettings(parsed);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function setSettings(next: Partial<IdeunSettings>) {
  const merged = normalizeSettings({ ...getSettings(), ...next });
  localStorage.setItem(KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event("ideun-settings"));
}

export function subscribeSettings(cb: (s: IdeunSettings) => void) {
  const handler = () => cb(getSettings());

  window.addEventListener("ideun-settings", handler);
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) handler();
  });

  cb(getSettings());

  return () => {
    window.removeEventListener("ideun-settings", handler);
  };
}
