// C:\Users\User\Downloads\ideun v1\src\shared\store\settings.ts
import {
  DEFAULT_SETTINGS,
  type IdeunSettings,
  type IdeunCharacterId,
} from "../types/settings";

declare global {
  interface Window {
    ideun?: {
      broadcastSettings?: (s: IdeunSettings) => void;
      onSettingsChanged?: (cb: (s: IdeunSettings) => void) => () => void;
    };
  }
}

const KEY = "ideun_settings_v1";
const VALID_CHARACTERS: IdeunCharacterId[] = ["angel-normal-a", "yaong-normal-a"];

function normalizeSettings(s: Partial<IdeunSettings>): IdeunSettings {
  const merged: IdeunSettings = { ...DEFAULT_SETTINGS, ...s } as IdeunSettings;

  if (!VALID_CHARACTERS.includes(merged.characterId)) {
    merged.characterId = DEFAULT_SETTINGS.characterId;
  }

  merged.enabled = !!merged.enabled;
  merged.overlayClickThrough = !!merged.overlayClickThrough;
  merged.movementEnabled = !!merged.movementEnabled;
  merged.onboardingDone = !!merged.onboardingDone;

  const ms = Number(merged.remindAfterMs);
  merged.remindAfterMs = Number.isFinite(ms)
    ? Math.max(1500, Math.min(ms, 120000))
    : DEFAULT_SETTINGS.remindAfterMs;

  merged.cameraEnabled = !!merged.cameraEnabled;

  const r = Number(merged.blinkClosedRatio);
  merged.blinkClosedRatio = Number.isFinite(r)
    ? Math.max(0.45, Math.min(r, 0.85))
    : DEFAULT_SETTINGS.blinkClosedRatio;

  const t = Number((merged as any).calibrateToken);
  merged.calibrateToken = Number.isFinite(t)
    ? Math.max(0, Math.floor(t))
    : DEFAULT_SETTINGS.calibrateToken;

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

export async function setSettings(next: Partial<IdeunSettings>) {
  const merged = normalizeSettings({ ...getSettings(), ...next });

  localStorage.setItem(KEY, JSON.stringify(merged));

  // same-window listeners
  window.dispatchEvent(new Event("ideun-settings"));

  // ✅ cross-window (Electron) broadcast
  window.ideun?.broadcastSettings?.(merged);
}

export function subscribeSettings(cb: (s: IdeunSettings) => void) {
  const handler = () => cb(getSettings());

  window.addEventListener("ideun-settings", handler);

  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) handler();
  };
  window.addEventListener("storage", onStorage);

  const offIpc = window.ideun?.onSettingsChanged?.((remote) => {
    const merged = normalizeSettings(remote);
    localStorage.setItem(KEY, JSON.stringify(merged));
    cb(merged);
  });

  cb(getSettings());

  return () => {
    window.removeEventListener("ideun-settings", handler);
    window.removeEventListener("storage", onStorage);
    offIpc?.();
  };
}