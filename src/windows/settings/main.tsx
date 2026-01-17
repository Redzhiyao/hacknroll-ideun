import React from "react";
import ReactDOM from "react-dom/client";
import { getSettings, setSettings, subscribeSettings } from "../../shared/store/settings";

declare global {
  interface Window {
    ideun?: {
      setOverlayClickThrough?: (enabled: boolean) => void;
      focusSettings?: () => void;
      openSettings?: () => void;
    };
  }
}

async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

function App() {
  const [s, setS] = React.useState(getSettings());
  const [camMsg, setCamMsg] = React.useState<string>("");

  React.useEffect(() => subscribeSettings(setS), []);

  React.useEffect(() => {
    window.ideun?.setOverlayClickThrough?.(getSettings().overlayClickThrough);
  }, []);

  const finishOnboarding = () => setSettings({ onboardingDone: true });

  const onToggleCamera = async (next: boolean) => {
    if (!next) {
      setSettings({ cameraEnabled: false });
      setCamMsg("Camera tracking disabled.");
      return;
    }

    setCamMsg("Requesting camera permission…");
    const ok = await requestCameraPermission();

    if (!ok) {
      setSettings({ cameraEnabled: false });
      setCamMsg("Camera permission denied. Enable it in Windows/Browser permissions, then try again.");
      return;
    }

    setSettings({ cameraEnabled: true });
    setCamMsg("Camera permission granted ✅ Blink tracking is ON.");
  };

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <h2 style={{ margin: 0 }}>Ideun</h2>
      <p style={{ marginTop: 6, opacity: 0.8 }}>
        Settings + onboarding (camera is processed locally only).
      </p>

      {!s.onboardingDone ? (
        <div style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Get Started</h3>
          <ol style={{ paddingLeft: 18 }}>
            <li>Enable camera (local processing)</li>
            <li>Choose character</li>
            <li>Adjust sensitivity</li>
          </ol>
          <button onClick={finishOnboarding} style={{ padding: "10px 12px", borderRadius: 10 }}>
            Finish onboarding (temp)
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Controls</h3>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={s.movementEnabled}
              onChange={(e) => setSettings({ movementEnabled: e.target.checked })}
            />
            Movement enabled (overlay will move)
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
            <input
              type="checkbox"
              checked={s.overlayClickThrough}
              onChange={(e) => {
                const v = e.target.checked;
                setSettings({ overlayClickThrough: v });
                window.ideun?.setOverlayClickThrough?.(v);
              }}
            />
            Overlay click-through (ignore mouse)
          </label>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Character</div>
            <select
              value={s.characterId}
              onChange={(e) => setSettings({ characterId: e.target.value as any })}
              style={{ marginTop: 6, padding: 10, borderRadius: 10, width: "100%" }}
            >
              <option value="angel-normal-a">Angel (Normal A)</option>
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Remind me if I don’t blink for</div>
            <input
              type="number"
              min={2}
              max={120}
              value={Math.round(s.remindAfterMs / 1000)}
              onChange={(e) => {
                const secs = Number(e.target.value);
                if (!Number.isFinite(secs)) return;
                setSettings({ remindAfterMs: Math.max(2, Math.min(120, secs)) * 1000 });
              }}
              style={{ marginTop: 6, padding: 10, borderRadius: 10, width: "100%" }}
            />
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>seconds</div>
          </div>

          <div style={{ marginTop: 12, borderTop: "1px solid #eee", paddingTop: 12 }}>
            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={s.cameraEnabled}
                onChange={(e) => onToggleCamera(e.target.checked)}
              />
              Enable real blink tracking (camera)
            </label>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Blink sensitivity</div>
              <input
                type="range"
                min={0.45}
                max={0.80}
                step={0.01}
                value={s.blinkClosedRatio}
                onChange={(e) => setSettings({ blinkClosedRatio: Number(e.target.value) })}
                style={{ width: "100%", marginTop: 6 }}
              />
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {s.blinkClosedRatio.toFixed(2)} (lower = more sensitive)
              </div>
            </div>

            {camMsg && <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>{camMsg}</div>}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
        Tip: If you get false blinks, increase the ratio a bit. If it misses blinks, lower it.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
