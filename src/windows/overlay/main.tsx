import React from "react";
import ReactDOM from "react-dom/client";
import { getSettings, subscribeSettings } from "../../shared/store/settings";

// MediaPipe Tasks Vision
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

declare global {
  interface Window {
    ideun?: {
      openSettings?: () => void;
    };
  }
}

type Mode = "normal" | "remind1" | "remind2";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}

// EAR using 6 points (FaceMesh landmark indices)
const LEFT_EYE = { p1: 33, p2: 160, p3: 158, p4: 133, p5: 153, p6: 144 };
const RIGHT_EYE = { p1: 362, p2: 385, p3: 387, p4: 263, p5: 373, p6: 380 };

function eyeEAR(
  lm: { x: number; y: number }[],
  idx: typeof LEFT_EYE,
  w: number,
  h: number
) {
  const P1 = lm[idx.p1], P2 = lm[idx.p2], P3 = lm[idx.p3], P4 = lm[idx.p4], P5 = lm[idx.p5], P6 = lm[idx.p6];
  const x1 = P1.x * w, y1 = P1.y * h;
  const x2 = P2.x * w, y2 = P2.y * h;
  const x3 = P3.x * w, y3 = P3.y * h;
  const x4 = P4.x * w, y4 = P4.y * h;
  const x5 = P5.x * w, y5 = P5.y * h;
  const x6 = P6.x * w, y6 = P6.y * h;

  const A = dist(x2, y2, x6, y6);
  const B = dist(x3, y3, x5, y5);
  const C = dist(x1, y1, x4, y4);
  if (C <= 0.0001) return 0;
  return (A + B) / (2.0 * C);
}

function Overlay() {
  const [s, setS] = React.useState(getSettings());

  const size = 120;
  const [pos, setPos] = React.useState({ x: 20, y: 40 });
  const vel = React.useRef({ x: 1.4, y: 1.1 });

  const [mode, setMode] = React.useState<Mode>("normal");
  const [scale, setScale] = React.useState(1);

  // "last blink time" used by reminder logic
  const lastBlinkAt = React.useRef<number>(Date.now());
  const missCount = React.useRef<number>(0);

  // Camera + ML refs
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const landmarkerRef = React.useRef<FaceLandmarker | null>(null);
  const loopRaf = React.useRef<number>(0);

  // Blink detection state
  const baselineEar = React.useRef<number | null>(null);
  const eyeClosed = React.useRef<boolean>(false);
  const closedStartedAt = React.useRef<number>(0);

  const [camStatus, setCamStatus] = React.useState<"off" | "starting" | "on" | "error">("off");

  React.useEffect(() => subscribeSettings(setS), []);

  // --- Reminder + movement loop ---
  React.useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const now = Date.now();
      const elapsed = now - lastBlinkAt.current;

      if (elapsed >= s.remindAfterMs) {
        if (missCount.current === 0) {
          missCount.current = 1;
          setMode("remind1");
          setScale(1.35);
        } else if (missCount.current === 1 && elapsed >= s.remindAfterMs * 2) {
          missCount.current = 2;
          setMode("remind2");
          setScale(1.45);
        }
      }

      setPos((p) => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (mode === "normal") {
          if (!s.movementEnabled) return p;

          let nx = p.x + vel.current.x;
          let ny = p.y + vel.current.y;

          if (nx < 0 || nx > w - size) vel.current.x *= -1;
          if (ny < 0 || ny > h - size) vel.current.y *= -1;

          nx = clamp(nx, 0, w - size);
          ny = clamp(ny, 0, h - size);

          return { x: nx, y: ny };
        } else {
          const cx = (w - size) / 2;
          const cy = (h - size) / 2;
          const t = 0.08;
          return { x: lerp(p.x, cx, t), y: lerp(p.y, cy, t) };
        }
      });
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [s.movementEnabled, s.remindAfterMs, mode]);

  // --- Blink tracking loop (MediaPipe) ---
  React.useEffect(() => {
    const start = async () => {
      if (!s.cameraEnabled) {
        setCamStatus("off");
        return;
      }

      setCamStatus("starting");

      try {
        // Create hidden video if not exists
        if (!videoRef.current) {
          const v = document.createElement("video");
          v.autoplay = true;
          v.muted = true;
          v.playsInline = true;
          v.style.position = "fixed";
          v.style.left = "-99999px";
          v.style.top = "-99999px";
          document.body.appendChild(v);
          videoRef.current = v;
        }

        // Get webcam stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        videoRef.current!.srcObject = stream;

        // Load MediaPipe (WASM from CDN). Later we can bundle locally for offline builds.
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });

        setCamStatus("on");

        // Reset calibration
        baselineEar.current = null;
        eyeClosed.current = false;
        closedStartedAt.current = 0;

        const loop = () => {
          loopRaf.current = requestAnimationFrame(loop);

          const v = videoRef.current!;
          const lmkr = landmarkerRef.current;
          if (!lmkr) return;
          if (v.readyState < 2) return;

          const w = v.videoWidth || 0;
          const h = v.videoHeight || 0;
          if (!w || !h) return;

          const res = lmkr.detectForVideo(v, performance.now());
          const face = res.faceLandmarks?.[0];
          if (!face) return;

          const left = eyeEAR(face, LEFT_EYE, w, h);
          const right = eyeEAR(face, RIGHT_EYE, w, h);
          const ear = (left + right) / 2;

          // Update baseline when eyes are likely open (ear higher)
          // EMA smoothing to adapt per user
          const base = baselineEar.current;
          if (base == null) {
            baselineEar.current = ear;
          } else {
            // Only pull baseline up slowly; avoids collapsing during blinks
            const target = Math.max(base, ear);
            baselineEar.current = base * 0.95 + target * 0.05;
          }

          const baseline = baselineEar.current ?? ear;

          // Closed if ear drops below baseline * ratio
          const closedNow = ear < baseline * s.blinkClosedRatio;

          // Blink detection: open -> closed -> open with sane duration
          const now = Date.now();

          if (!eyeClosed.current && closedNow) {
            eyeClosed.current = true;
            closedStartedAt.current = now;
          }

          const openAgain = eyeClosed.current && !closedNow && ear > baseline * 0.9;
          if (openAgain) {
            const dur = now - closedStartedAt.current;

            // Typical blink 60-600ms; tune later
            if (dur >= 60 && dur <= 600) {
              // ✅ Blink detected
              lastBlinkAt.current = now;
              missCount.current = 0;
              setMode("normal");
              setScale(1);
            }

            eyeClosed.current = false;
            closedStartedAt.current = 0;
          }
        };

        // start loop
        cancelAnimationFrame(loopRaf.current);
        loop();
      } catch (e) {
        console.error(e);
        setCamStatus("error");
      }
    };

    const stop = () => {
      cancelAnimationFrame(loopRaf.current);
      loopRaf.current = 0;

      landmarkerRef.current?.close?.();
      landmarkerRef.current = null;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      setCamStatus("off");
    };

    start();

    return () => stop();
    // re-run when these change
  }, [s.cameraEnabled, s.blinkClosedRatio]);

  const label =
    mode === "normal"
      ? "Ideun overlay"
      : mode === "remind1"
      ? "Blink please 👀"
      : "BLINK NOW 😤";

  return (
    <div style={{ width: "100vw", height: "100vh", background: "transparent" }}>
      <div
        onClick={() => window.ideun?.openSettings?.()}
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width: size,
          height: size,
          borderRadius: 24,
          display: "grid",
          placeItems: "center",
          userSelect: "none",
          cursor: "pointer",
          transform: `scale(${scale})`,
          transformOrigin: "center",
          transition: "transform 160ms ease",
          background:
            mode === "normal"
              ? "rgba(255,255,255,0.10)"
              : mode === "remind1"
              ? "rgba(255,255,255,0.16)"
              : "rgba(255,255,255,0.22)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: mode === "normal" ? "none" : "0 10px 30px rgba(0,0,0,0.35)",
        }}
        title={`${label} • camera: ${camStatus}`}
      >
        <img
          src={`/characters/${s.characterId}.svg`}
          alt={s.characterId}
          draggable={false}
          style={{ width: 110, height: 110, objectFit: "contain" }}
        />
      </div>

      {/* small camera status badge */}
      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          fontFamily: "system-ui",
          fontSize: 11,
          padding: "5px 8px",
          borderRadius: 999,
          background: "rgba(0,0,0,0.55)",
          color: "white",
          pointerEvents: "none",
        }}
      >
        cam: {camStatus}
      </div>

      {mode !== "normal" && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "72%",
            transform: "translateX(-50%)",
            fontFamily: "system-ui",
            fontSize: 12,
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.55)",
            color: "white",
            pointerEvents: "none",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Overlay />
  </React.StrictMode>
);
