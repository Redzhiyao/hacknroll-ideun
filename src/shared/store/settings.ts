<<<<<<< HEAD
// C:\Users\User\Downloads\ideun v1\src\shared\store\settings.ts
=======
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
import {
  DEFAULT_SETTINGS,
  type IdeunSettings,
  type IdeunCharacterId,
} from "../types/settings";

<<<<<<< HEAD
declare global {
  interface Window {
    ideun?: {
      broadcastSettings?: (s: IdeunSettings) => void;
      onSettingsChanged?: (cb: (s: IdeunSettings) => void) => () => void;
    };
  }
}

const KEY = "ideun_settings_v1";

// ✅ Added "pabo-normal-a"
const VALID_CHARACTERS: IdeunCharacterId[] = [
  "angel-normal-a",
  "yaong-normal-a",
  "pabo-normal-a"
];
=======
const KEY = "ideun_settings_v1";
const VALID_CHARACTERS: IdeunCharacterId[] = ["angel-normal-a"];
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660

function normalizeSettings(s: Partial<IdeunSettings>): IdeunSettings {
  const merged: IdeunSettings = { ...DEFAULT_SETTINGS, ...s } as IdeunSettings;

  if (!VALID_CHARACTERS.includes(merged.characterId)) {
<<<<<<< HEAD
    console.warn("⚠️ Invalid characterId:", merged.characterId, "defaulting to:", DEFAULT_SETTINGS.characterId);
    merged.characterId = DEFAULT_SETTINGS.characterId;
  } else {
    console.log("✅ Valid characterId:", merged.characterId);
  }

  merged.enabled = !!merged.enabled;
=======
    merged.characterId = DEFAULT_SETTINGS.characterId;
  }

>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
  merged.overlayClickThrough = !!merged.overlayClickThrough;
  merged.movementEnabled = !!merged.movementEnabled;
  merged.onboardingDone = !!merged.onboardingDone;

<<<<<<< HEAD
=======
  // remindAfterMs clamp
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
  const ms = Number(merged.remindAfterMs);
  merged.remindAfterMs = Number.isFinite(ms)
    ? Math.max(1500, Math.min(ms, 120000))
    : DEFAULT_SETTINGS.remindAfterMs;

  merged.cameraEnabled = !!merged.cameraEnabled;

<<<<<<< HEAD
  const r = Number(merged.blinkClosedRatio);
  merged.blinkClosedRatio = Number.isFinite(r)
    ? Math.max(0.45, Math.min(r, 0.85))
    : DEFAULT_SETTINGS.blinkClosedRatio;

  const t = Number((merged as any).calibrateToken);
  merged.calibrateToken = Number.isFinite(t)
    ? Math.max(0, Math.floor(t))
    : DEFAULT_SETTINGS.calibrateToken;

=======
  // blinkClosedRatio clamp
  const r = Number(merged.blinkClosedRatio);
  merged.blinkClosedRatio = Number.isFinite(r)
    ? Math.max(0.5, Math.min(r, 0.85))
    : DEFAULT_SETTINGS.blinkClosedRatio;

>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
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

<<<<<<< HEAD
export async function setSettings(next: Partial<IdeunSettings>) {
  console.log("💾 setSettings called with:", next);
  const merged = normalizeSettings({ ...getSettings(), ...next });
  console.log("💾 After normalization:", merged);

  localStorage.setItem(KEY, JSON.stringify(merged));

  // same-window listeners
  window.dispatchEvent(new Event("ideun-settings"));

  // ✅ cross-window (Electron) broadcast
  window.ideun?.broadcastSettings?.(merged);
=======
export function setSettings(next: Partial<IdeunSettings>) {
  const merged = normalizeSettings({ ...getSettings(), ...next });
  localStorage.setItem(KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event("ideun-settings"));
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
}

export function subscribeSettings(cb: (s: IdeunSettings) => void) {
  const handler = () => cb(getSettings());

  window.addEventListener("ideun-settings", handler);
<<<<<<< HEAD

  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) handler();
  };
  window.addEventListener("storage", onStorage);

  const offIpc = window.ideun?.onSettingsChanged?.((remote) => {
    const merged = normalizeSettings(remote);
    localStorage.setItem(KEY, JSON.stringify(merged));
    cb(merged);
=======
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) handler();
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
  });

  cb(getSettings());

  return () => {
    window.removeEventListener("ideun-settings", handler);
<<<<<<< HEAD
    window.removeEventListener("storage", onStorage);
    offIpc?.();
  };
}
=======
  };
}
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
