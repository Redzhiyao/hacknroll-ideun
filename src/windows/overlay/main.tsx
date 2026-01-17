// C:\Users\User\Downloads\ideun v1\src\windows\overlay\main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { getSettings, subscribeSettings } from "../../shared/store/settings";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { getPack } from "../../shared/characters";

declare global {
  interface Window {
    ideun?: {
      openSettings?: () => void;
      setOverlayIgnoreMouse?: (ignore: boolean) => void;
    };
  }
}

type Mode = "normal" | "remind1" | "remind2" | "angry" | "furious";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function getViewportSize() {
  const vv = window.visualViewport;
  const w =
    (vv?.width ??
      document.documentElement.clientWidth ??
      window.innerWidth ??
      0) || 0;
  const h =
    (vv?.height ??
      document.documentElement.clientHeight ??
      window.innerHeight ??
      0) || 0;
  return { w, h };
}

// EAR indices
const LEFT_EYE = { p1: 33, p2: 160, p3: 158, p4: 133, p5: 153, p6: 144 };
const RIGHT_EYE = { p1: 362, p2: 385, p3: 387, p4: 263, p5: 373, p6: 380 };

// Pose indices
const NOSE_TIP = 1;
const NOSE_BRIDGE = 6;
const LEFT_EYE_INNER = 133;
const RIGHT_EYE_INNER = 362;

function eyeEAR(
  lm: { x: number; y: number; z: number }[],
  idx: typeof LEFT_EYE,
  w: number,
  h: number
) {
  const P1 = lm[idx.p1],
    P2 = lm[idx.p2],
    P3 = lm[idx.p3],
    P4 = lm[idx.p4],
    P5 = lm[idx.p5],
    P6 = lm[idx.p6];

  const x1 = P1.x * w,
    y1 = P1.y * h;
  const x2 = P2.x * w,
    y2 = P2.y * h;
  const x3 = P3.x * w,
    y3 = P3.y * h;
  const x4 = P4.x * w,
    y4 = P4.y * h;
  const x5 = P5.x * w,
    y5 = P5.y * h;
  const x6 = P6.x * w,
    y6 = P6.y * h;

  const A = dist(x2, y2, x6, y6);
  const B = dist(x3, y3, x5, y5);
  const C = dist(x1, y1, x4, y4);
  if (C <= 0.0001) return 0;
  return (A + B) / (2.0 * C);
}

function getHeadPose(lm: { x: number; y: number; z: number }[]) {
  const noseTip = lm[NOSE_TIP];
  const noseBridge = lm[NOSE_BRIDGE];
  const leftEye = lm[LEFT_EYE_INNER];
  const rightEye = lm[RIGHT_EYE_INNER];

  const pitch = Math.atan2(noseTip.z - noseBridge.z, noseTip.y - noseBridge.y);
  const eyeMidX = (leftEye.x + rightEye.x) / 2;
  const yaw = (noseTip.x - eyeMidX) * 3;

  return { pitch, yaw, roll: 0 };
}

function normalizeEAR(rawEAR: number, pitch: number, yaw: number): number {
  const pitchComp = 1 + Math.max(0, pitch * 1.5);
  const yawComp = 1 + Math.abs(yaw) * 0.3;
  return rawEAR * pitchComp * yawComp;
}

class EARSmoother {
  private history: number[] = [];
  private maxHistory = 5;

  add(value: number): number {
    this.history.push(value);
    if (this.history.length > this.maxHistory) this.history.shift();

    let sum = 0;
    let weightSum = 0;
    for (let i = 0; i < this.history.length; i++) {
      const w = i + 1;
      sum += this.history[i] * w;
      weightSum += w;
    }
    return sum / weightSum;
  }

  reset() {
    this.history = [];
  }
}

function rectContains(r: DOMRect, x: number, y: number) {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

function Overlay() {
  const [s, setS] = React.useState(getSettings());

  const baseSize = 120;
  const imgSize = 110;

  const [pos, setPos] = React.useState({ x: 20, y: 40 });
  const vel = React.useRef({ x: 1.4, y: 1.1 });

  const [mode, setMode] = React.useState<Mode>("normal");

  const [scale, setScale] = React.useState(1);
  const targetScaleRef = React.useRef(1);

  const lastBlinkAt = React.useRef<number>(Date.now());
  const missCount = React.useRef<number>(0);

  const centeredEnoughRef = React.useRef(false);
  const scaleReadyRef = React.useRef(false);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const landmarkerRef = React.useRef<FaceLandmarker | null>(null);
  const loopRaf = React.useRef<number>(0);

  const baselineEar = React.useRef<number | null>(null);
  const earSmoother = React.useRef(new EARSmoother());
  const eyeClosed = React.useRef<boolean>(false);
  const closedStartedAt = React.useRef<number>(0);
  const lastCalibrateToken = React.useRef<number>(0);

  const [camStatus, setCamStatus] = React.useState<
    "off" | "starting" | "on" | "error"
  >("off");

  const [remindFrame, setRemindFrame] = React.useState(0);
  const [floatFrame, setFloatFrame] = React.useState(0);

  const pack = React.useMemo(() => getPack(s.characterId), [s.characterId]);

  const isFurious = mode === "furious";

  // Refs to clickable zones (normal character + yaong special)
  const clickableRef = React.useRef<HTMLDivElement | null>(null);
  const yaongSpecialClickableRef = React.useRef<HTMLDivElement | null>(null);

  // Track current ignore state so we don’t spam IPC
  const ignoreMouseRef = React.useRef(true);

  React.useEffect(() => subscribeSettings(setS), []);

  // ✅ Start click-through on mount
  React.useEffect(() => {
    ignoreMouseRef.current = true;
    window.ideun?.setOverlayIgnoreMouse?.(true);
  }, []);

  // ✅ Option 1 logic: click-through always, EXCEPT when cursor is over the character
  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // if user explicitly wants FULL click-through (optional)
      // if (s.overlayClickThrough) return;

      const x = e.clientX;
      const y = e.clientY;

      let over = false;

      const a = clickableRef.current;
      if (a) {
        const r = a.getBoundingClientRect();
        if (rectContains(r, x, y)) over = true;
      }

      const b = yaongSpecialClickableRef.current;
      if (!over && b) {
        const r = b.getBoundingClientRect();
        if (rectContains(r, x, y)) over = true;
      }

      const nextIgnore = !over; // ignore if NOT over character
      if (nextIgnore !== ignoreMouseRef.current) {
        ignoreMouseRef.current = nextIgnore;
        window.ideun?.setOverlayIgnoreMouse?.(nextIgnore);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [s.overlayClickThrough, mode, pack.key]);

  React.useEffect(() => {
    setRemindFrame(0);
    setFloatFrame(0);
  }, [mode, pack.key]);

  // normal float loop
  React.useEffect(() => {
    if (mode !== "normal") return;

    const fps = 2;
    const ms = Math.floor(1000 / fps);

    const id = window.setInterval(() => {
      setFloatFrame((f) => (f + 1) % Math.max(1, pack.floatFrames.length));
    }, ms);

    return () => window.clearInterval(id);
  }, [mode, pack.key, pack.floatFrames.length]);

  // reminder loop (skip yaong furious special)
  React.useEffect(() => {
    if (mode === "normal") return;
    if (mode === "furious" && pack.key === "yaong") return;

    const framesLen =
      mode === "furious"
        ? pack.furiousFrames?.length ?? 0
        : mode === "angry"
        ? pack.angryFrames.length
        : pack.blinkFrames.length;

    const fps = mode === "furious" ? 5 : 2.5;
    const ms = Math.floor(1000 / fps);

    const id = window.setInterval(() => {
      if (!centeredEnoughRef.current) return;
      if (!scaleReadyRef.current) return;
      setRemindFrame((f) => (f + 1) % Math.max(1, framesLen));
    }, ms);

    return () => window.clearInterval(id);
  }, [
    mode,
    pack.key,
    pack.blinkFrames.length,
    pack.angryFrames.length,
    pack.furiousFrames?.length,
  ]);

  // movement + scaling + escalation
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
          targetScaleRef.current = 3.6;
        } else if (missCount.current === 1 && elapsed >= s.remindAfterMs * 2) {
          missCount.current = 2;
          setMode("remind2");
          targetScaleRef.current = 6.0;
        } else if (missCount.current === 2 && elapsed >= s.remindAfterMs * 3) {
          missCount.current = 3;
          setMode("angry");
          targetScaleRef.current = 7.2;
        } else if (missCount.current === 3 && elapsed >= s.remindAfterMs * 4) {
          missCount.current = 4;
          setMode("furious");
          targetScaleRef.current = 9.2;
        }
      }

      setScale((cur) => {
        const target = mode === "normal" ? 1 : targetScaleRef.current;
        const speed = mode === "furious" ? 0.06 : 0.04;
        const next = lerp(cur, target, speed);
        scaleReadyRef.current = Math.abs(next - target) < 0.04;
        return next;
      });

      setPos((p) => {
        const { w, h } = getViewportSize();
        if (!w || !h) return p;

        if (mode === "normal") {
          centeredEnoughRef.current = false;
          if (!s.movementEnabled) return p;

          let nx = p.x + vel.current.x;
          let ny = p.y + vel.current.y;

          if (nx < 0 || nx > w - baseSize) vel.current.x *= -1;
          if (ny < 0 || ny > h - baseSize) vel.current.y *= -1;

          nx = clamp(nx, 0, w - baseSize);
          ny = clamp(ny, 0, h - baseSize);
          return { x: nx, y: ny };
        } else {
          const cx = (w - baseSize) / 2;
          const cy = (h - baseSize) / 2;

          const flySpeed = mode === "furious" ? 0.03 : 0.022;
          const nx = lerp(p.x, cx, flySpeed);
          const ny = lerp(p.y, cy, flySpeed);

          const d = dist(nx, ny, cx, cy);
          centeredEnoughRef.current = d < 8;
          return { x: nx, y: ny };
        }
      });
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [s.movementEnabled, s.remindAfterMs, mode]);

  // camera + blink detection
  React.useEffect(() => {
    const start = async () => {
      if (!s.cameraEnabled) {
        setCamStatus("off");
        return;
      }

      setCamStatus("starting");

      try {
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

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });

        setCamStatus("on");

        baselineEar.current = null;
        earSmoother.current.reset();
        eyeClosed.current = false;
        closedStartedAt.current = 0;
        lastCalibrateToken.current = s.calibrateToken;

        const loop = () => {
          loopRaf.current = requestAnimationFrame(loop);

          const v = videoRef.current;
          const lmkr = landmarkerRef.current;
          if (!lmkr) return;
          if (!v || v.readyState < 2) return;

          const w = v.videoWidth || 0;
          const h = v.videoHeight || 0;
          if (!w || !h) return;

          const res = lmkr.detectForVideo(v, performance.now());
          const face = res.faceLandmarks?.[0];
          if (!face) return;

          const leftRaw = eyeEAR(face, LEFT_EYE, w, h);
          const rightRaw = eyeEAR(face, RIGHT_EYE, w, h);
          const rawEAR = (leftRaw + rightRaw) / 2;

          const pose = getHeadPose(face);
          const normalizedEAR = normalizeEAR(rawEAR, pose.pitch, pose.yaw);
          const smoothedEAR = earSmoother.current.add(normalizedEAR);

          if (s.calibrateToken !== lastCalibrateToken.current) {
            baselineEar.current = null;
            earSmoother.current.reset();
            lastCalibrateToken.current = s.calibrateToken;
          }

          const base = baselineEar.current;
          if (base == null) baselineEar.current = smoothedEAR;
          else {
            if (smoothedEAR > base)
              baselineEar.current = base * 0.85 + smoothedEAR * 0.15;
            else baselineEar.current = base * 0.98 + smoothedEAR * 0.02;
          }

          const baseline = baselineEar.current ?? smoothedEAR;
          const closedNow = smoothedEAR < baseline * s.blinkClosedRatio;

          const now = Date.now();

          if (!eyeClosed.current && closedNow) {
            eyeClosed.current = true;
            closedStartedAt.current = now;
          }

          const openThreshold = baseline * (s.blinkClosedRatio + 0.15);
          const openAgain =
            eyeClosed.current && !closedNow && smoothedEAR > openThreshold;

          if (openAgain) {
            const dur = now - closedStartedAt.current;
            if (dur >= 50 && dur <= 500) {
              lastBlinkAt.current = now;
              missCount.current = 0;
              setMode("normal");
              targetScaleRef.current = 1;
            }
            eyeClosed.current = false;
            closedStartedAt.current = 0;
          }

          if (eyeClosed.current && now - closedStartedAt.current > 1000) {
            eyeClosed.current = false;
            closedStartedAt.current = 0;
          }
        };

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
  }, [s.cameraEnabled, s.blinkClosedRatio, s.calibrateToken]);

  const label =
    mode === "normal"
      ? "Ideun overlay"
      : mode === "remind1"
      ? "Blink please 👀"
      : mode === "remind2"
      ? "BLINK NOW 😤"
      : mode === "angry"
      ? "ANGRY 😡 BLINK!!!"
      : "FURIOUS 🤬 BLINK!!!";

  const shouldAnimateReminders =
    mode !== "normal" && centeredEnoughRef.current && scaleReadyRef.current;

  const floatFrames = pack.floatFrames;
  const blinkFrames = pack.blinkFrames;
  const angryFrames = pack.angryFrames;
  const furiousFrames = pack.furiousFrames ?? [];

  const reminderFrames =
    mode === "furious" ? furiousFrames : mode === "angry" ? angryFrames : blinkFrames;

  const normalImgSrc = floatFrames[floatFrame % Math.max(1, floatFrames.length)];
  const reminderImgSrc = shouldAnimateReminders
    ? reminderFrames[remindFrame % Math.max(1, reminderFrames.length)]
    : reminderFrames[0];

  const imgSrc = mode === "normal" ? normalImgSrc : reminderImgSrc;

  const isYaongFuriousSpecial =
    mode === "furious" && pack.key === "yaong" && !!pack.furiousSpecial;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "transparent",
        overflow: "hidden",
        pointerEvents: "none", // ✅ DOM click-through by default
      }}
    >
      <style>{`
        html, body, #root {
          background: transparent !important;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        @keyframes ideunPulse {
          0% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.80; transform: scale(1.03); }
          100% { opacity: 0.45; transform: scale(1); }
        }
        @keyframes ideunShakeHard {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          15% { transform: translate(-4px, 2px) rotate(-0.5deg); }
          30% { transform: translate(4px, -2px) rotate(0.5deg); }
          45% { transform: translate(-4px, -2px) rotate(-0.5deg); }
          60% { transform: translate(4px, 2px) rotate(0.5deg); }
          75% { transform: translate(-3px, 1px) rotate(-0.3deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes ideunScan {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
        @keyframes yaongPawsDrop {
          0% { transform: translate(-50%, -120%); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(-50%, 120%); opacity: 1; }
        }
        @keyframes yaongRiseUp {
          0% { transform: translate(-50%, 160%); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translate(-50%, 0%); opacity: 1; }
        }
      `}</style>

      {isFurious && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,0,0,0.35), rgba(0,0,0,0.92) 60%), " +
              "linear-gradient(180deg, rgba(255,0,0,0.16), rgba(0,0,0,0.92))",
            animation: "ideunPulse 900ms ease-in-out infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.06) 100%)",
              backgroundSize: "100% 18px",
              opacity: 0.22,
              mixBlendMode: "overlay",
              animation: "ideunScan 700ms linear infinite",
            }}
          />
        </div>
      )}

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          animation: isFurious ? "ideunShakeHard 110ms linear infinite" : undefined,
        }}
      >
        {isYaongFuriousSpecial && pack.furiousSpecial ? (
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2 }}>
            <img
              src={pack.furiousSpecial.paws}
              alt="yaong-paws"
              draggable={false}
              style={{
                position: "fixed",
                left: "50%",
                top: 0,
                width: "min(720px, 92vw)",
                transform: "translate(-50%, -120%)",
                animation: "yaongPawsDrop 900ms cubic-bezier(.2,.9,.2,1) infinite",
                imageRendering: "pixelated",
                userSelect: "none",
                WebkitUserDrag: "none",
                pointerEvents: "none",
              }}
            />

            <div
              ref={yaongSpecialClickableRef}
              onClick={() => window.ideun?.openSettings?.()}
              style={{
                position: "fixed",
                left: "50%",
                bottom: "10%",
                width: "min(520px, 72vw)",
                transform: "translate(-50%, 160%)",
                animation: "yaongRiseUp 520ms cubic-bezier(.2,.9,.2,1) forwards",
                cursor: "pointer",
                pointerEvents: "auto", // ✅ clickable area
                display: "grid",
                placeItems: "center",
                userSelect: "none",
              }}
              title={`${label} • camera: ${camStatus}`}
            >
              <img
                src={pack.furiousSpecial.furious}
                alt="yaong-furious"
                draggable={false}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  imageRendering: "pixelated",
                  filter: "drop-shadow(0 0 22px rgba(255,0,0,0.35))",
                  userSelect: "none",
                  WebkitUserDrag: "none",
                }}
              />
            </div>
          </div>
        ) : (
          <div
            ref={clickableRef}
            onClick={() => window.ideun?.openSettings?.()}
            style={{
              position: "fixed",
              left: pos.x,
              top: pos.y,
              width: baseSize,
              height: baseSize,
              display: "grid",
              placeItems: "center",
              userSelect: "none",
              cursor: "pointer",

              // ✅ only this area is intended to be interactive
              pointerEvents: "auto",

              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 160ms ease",

              background: "transparent",
              border: "none",

              boxShadow:
                mode === "normal"
                  ? "none"
                  : isFurious
                  ? "0 22px 70px rgba(255,0,0,0.22)"
                  : "0 16px 45px rgba(0,0,0,0.20)",
            }}
            title={`${label} • camera: ${camStatus}`}
          >
            <img
              src={imgSrc}
              alt={`${mode}-${pack.key}`}
              draggable={false}
              style={{
                width: imgSize,
                height: imgSize,
                objectFit: "contain",
                imageRendering: "pixelated",
                filter: isFurious ? "drop-shadow(0 0 18px rgba(255,0,0,0.35))" : undefined,
              }}
            />
          </div>
        )}
      </div>

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
          zIndex: 3,
        }}
      >
        cam: {camStatus} • char: {pack.key}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Overlay />
  </React.StrictMode>
);
