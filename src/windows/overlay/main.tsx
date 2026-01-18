<<<<<<< HEAD
// C:\Users\User\Downloads\ideun v1\src\windows\overlay\main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { getSettings, subscribeSettings } from "../../shared/store/settings";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { getPack } from "../../shared/characters";
=======
import React from "react";
import ReactDOM from "react-dom/client";
import { getSettings, subscribeSettings } from "../../shared/store/settings";

// MediaPipe Tasks Vision
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660

declare global {
  interface Window {
    ideun?: {
      openSettings?: () => void;
<<<<<<< HEAD
      setOverlayIgnoreMouse?: (ignore: boolean) => void;
=======
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
    };
  }
}

<<<<<<< HEAD
type Mode = "normal" | "remind1" | "remind2" | "angry" | "furious";

/* ------------------------------ Math helpers ------------------------------ */
=======
type Mode = "normal" | "remind1" | "remind2";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function dist(ax: number, ay: number, bx: number, by: number) {
<<<<<<< HEAD
  return Math.hypot(ax - bx, ay - by);
}

function smoothStep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
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

function moveToward(
  from: { x: number; y: number },
  to: { x: number; y: number },
  maxStep: number
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const d = Math.hypot(dx, dy);
  if (d <= 0.00001) return { x: to.x, y: to.y, done: true };
  if (d <= maxStep) return { x: to.x, y: to.y, done: true };
  const k = maxStep / d;
  return { x: from.x + dx * k, y: from.y + dy * k, done: false };
}

/* ------------------------------ Blink helpers ----------------------------- */
const LEFT_EYE = { p1: 33, p2: 160, p3: 158, p4: 133, p5: 153, p6: 144 };
const RIGHT_EYE = { p1: 362, p2: 385, p3: 387, p4: 263, p5: 373, p6: 380 };

const NOSE_TIP = 1;
const NOSE_BRIDGE = 6;
const LEFT_EYE_INNER = 133;
const RIGHT_EYE_INNER = 362;

function eyeEAR(
  lm: { x: number; y: number; z: number }[],
=======
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}

// EAR using 6 points (FaceMesh landmark indices)
const LEFT_EYE = { p1: 33, p2: 160, p3: 158, p4: 133, p5: 153, p6: 144 };
const RIGHT_EYE = { p1: 362, p2: 385, p3: 387, p4: 263, p5: 373, p6: 380 };

function eyeEAR(
  lm: { x: number; y: number }[],
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
  idx: typeof LEFT_EYE,
  w: number,
  h: number
) {
<<<<<<< HEAD
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
=======
  const P1 = lm[idx.p1], P2 = lm[idx.p2], P3 = lm[idx.p3], P4 = lm[idx.p4], P5 = lm[idx.p5], P6 = lm[idx.p6];
  const x1 = P1.x * w, y1 = P1.y * h;
  const x2 = P2.x * w, y2 = P2.y * h;
  const x3 = P3.x * w, y3 = P3.y * h;
  const x4 = P4.x * w, y4 = P4.y * h;
  const x5 = P5.x * w, y5 = P5.y * h;
  const x6 = P6.x * w, y6 = P6.y * h;
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660

  const A = dist(x2, y2, x6, y6);
  const B = dist(x3, y3, x5, y5);
  const C = dist(x1, y1, x4, y4);
  if (C <= 0.0001) return 0;
  return (A + B) / (2.0 * C);
}

<<<<<<< HEAD
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
  private maxHistory = 6;

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

/* --------------------------- Click-through helpers ------------------------ */
function rectContains(r: DOMRect, x: number, y: number) {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

/* ------------------------------ RAF utilities ----------------------------- */
function useRafLoop(enabled: boolean, onFrame: (dt: number, now: number) => void) {
  const cbRef = React.useRef(onFrame);
  cbRef.current = onFrame;

  React.useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let last = performance.now();

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, Math.max(0, (t - last) / 1000));
      last = t;
      cbRef.current(dt, t);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);
}

function useFrameAnimation(params: {
  fps: number;
  framesLen: number;
  enabled: boolean;
  resetKey: string | number;
}) {
  const { fps, framesLen, enabled, resetKey } = params;

  const [frameF, setFrameF] = React.useState(0);
  const phaseRef = React.useRef(0);

  React.useEffect(() => {
    phaseRef.current = 0;
    setFrameF(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useRafLoop(enabled && framesLen > 0, (dt) => {
    phaseRef.current += dt * fps;
    const wrapped = phaseRef.current % framesLen;

    setFrameF((prev) => {
      const a = prev;
      const b = wrapped;

      let delta = b - a;
      if (delta > framesLen / 2) delta -= framesLen;
      if (delta < -framesLen / 2) delta += framesLen;

      const alpha = 1 - Math.pow(0.001, dt);
      let next = a + delta * alpha;
      next = ((next % framesLen) + framesLen) % framesLen;
      return next;
    });
  });

  return frameF;
}

function useSmoothScale(getTarget: () => number, mode: Mode) {
  const [scale, setScale] = React.useState(1);

  const xRef = React.useRef(1);
  const vRef = React.useRef(0);

  React.useEffect(() => {
    xRef.current = scale;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useRafLoop(true, (dt) => {
    const target = getTarget();

    const profile =
      mode === "furious"
        ? { k: 160, c: 18 }
        : mode === "angry"
        ? { k: 120, c: 16 }
        : mode === "remind2"
        ? { k: 95, c: 14 }
        : mode === "remind1"
        ? { k: 80, c: 13 }
        : { k: 70, c: 14 };

    const x = xRef.current;
    const v = vRef.current;

    const a = profile.k * (target - x) - profile.c * v;

    const v2 = v + a * dt;
    const x2 = x + v2 * dt;

    const close = Math.abs(target - x2) < 0.002 && Math.abs(v2) < 0.01;
    if (close) {
      xRef.current = target;
      vRef.current = 0;
      setScale(target);
      return;
    }

    xRef.current = x2;
    vRef.current = v2;

    setScale((prev) => (Math.abs(prev - x2) > 0.0005 ? x2 : prev));
  });

  return scale;
}

/* ------------------------------ Overlay UI ------------------------------- */
function Overlay() {
  const [s, setS] = React.useState(getSettings());

  const baseSize = 120;
  const imgSize = 110;

  const [pos, setPos] = React.useState({ x: 20, y: 40 });
  const posRef = React.useRef({ x: 20, y: 40 });
  const velRef = React.useRef({ x: 1.4, y: 1.1 });

  const [mode, setMode] = React.useState<Mode>("normal");
  const modeRef = React.useRef<Mode>("normal");
  React.useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const lastBlinkAt = React.useRef<number>(Date.now());
  const missCount = React.useRef<number>(0);

  const centeredEnoughRef = React.useRef(false);

=======
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
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const landmarkerRef = React.useRef<FaceLandmarker | null>(null);
  const loopRaf = React.useRef<number>(0);

<<<<<<< HEAD
  const baselineEar = React.useRef<number | null>(null);
  const earSmoother = React.useRef(new EARSmoother());
  const eyeClosed = React.useRef<boolean>(false);
  const closedStartedAt = React.useRef<number>(0);
  const lastCalibrateToken = React.useRef<number>(0);

  const [camStatus, setCamStatus] = React.useState<"off" | "starting" | "on" | "error">("off");

  // ✅ IMPORTANT: getPack() now normalizes, so pabo/yaong/angel always resolves correctly
  const pack = React.useMemo(() => getPack(s.characterId), [s.characterId]);

  const packKeyRef = React.useRef(pack.key);
  React.useEffect(() => {
    packKeyRef.current = pack.key;
  }, [pack.key]);

  const isFurious = mode === "furious";

  const clickableRef = React.useRef<HTMLDivElement | null>(null);
  const yaongSpecialClickableRef = React.useRef<HTMLDivElement | null>(null);

  const ignoreMouseRef = React.useRef(true);

  // Pabo border crawl + remind phases
  const paboBorderSRef = React.useRef(0);
  const paboRemindPhaseRef = React.useRef<1 | 2>(1);

  // Pabo furious shake
  const [screenShake, setScreenShake] = React.useState({ x: 0, y: 0, r: 0 });
  const shakeClockRef = React.useRef(0);
  const shakeUpdateAccRef = React.useRef(0);
  const remindIdxRef = React.useRef(0);
  const lastVibeIdxRef = React.useRef(-1);

  React.useEffect(() => subscribeSettings(setS), []);

  React.useEffect(() => {
    ignoreMouseRef.current = true;
    window.ideun?.setOverlayIgnoreMouse?.(true);
  }, []);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
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

      const nextIgnore = !over;
      if (nextIgnore !== ignoreMouseRef.current) {
        ignoreMouseRef.current = nextIgnore;
        window.ideun?.setOverlayIgnoreMouse?.(nextIgnore);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mode, pack.key]);

  const floatFrameF = useFrameAnimation({
    fps: 2,
    framesLen: Math.max(1, pack.floatFrames.length),
    enabled: mode === "normal",
    resetKey: `float:${pack.key}:${mode}`,
  });

  const reminderFps = mode === "furious" ? 6 : mode === "angry" ? 3.2 : 2.6;
  const reminderFramesLen =
    mode === "furious"
      ? pack.furiousFrames?.length ?? 0
      : mode === "angry"
      ? pack.angryFrames.length
      : pack.blinkFrames.length;

  const paboImmediateRemind = pack.key === "pabo" && (mode === "remind1" || mode === "remind2");

  const reminderFrameF = useFrameAnimation({
    fps: reminderFps,
    framesLen: Math.max(1, reminderFramesLen),
    enabled:
      mode !== "normal" &&
      !(mode === "furious" && pack.key === "yaong") &&
      (centeredEnoughRef.current || paboImmediateRemind),
    resetKey: `rem:${pack.key}:${mode}:${s.remindAfterMs}`,
  });

  const targetScaleRef = React.useRef(1);

  const scale = useSmoothScale(() => {
    return modeRef.current === "normal" ? 1 : targetScaleRef.current;
  }, mode);

  React.useEffect(() => {
    if (pack.key === "pabo" && (mode === "remind1" || mode === "remind2")) {
      paboRemindPhaseRef.current = 1;
    }
    if (pack.key !== "pabo") {
      setScreenShake({ x: 0, y: 0, r: 0 });
      lastVibeIdxRef.current = -1;
    }
  }, [mode, pack.key]);

  useRafLoop(true, (dt) => {
    const nowMs = Date.now();
    const elapsed = nowMs - lastBlinkAt.current;

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

    const { w, h } = getViewportSize();
    if (!w || !h) return;

    const p = posRef.current;
    const v = velRef.current;
    const key = packKeyRef.current;

    if (modeRef.current === "furious" && key === "pabo" && centeredEnoughRef.current) {
      shakeClockRef.current += dt;
      shakeUpdateAccRef.current += dt;

      const idx = remindIdxRef.current;
      let amp = 0;
      let rotAmp = 0;

      if (idx === 2) {
        amp = 12;
        rotAmp = 1.4;
      } else if (idx === 3) {
        amp = 18;
        rotAmp = 2.2;
      } else if (idx >= 4) {
        amp = 26;
        rotAmp = 3.0;
      } else {
        amp = 0;
        rotAmp = 0;
      }

      if (idx !== lastVibeIdxRef.current && idx >= 2) {
        lastVibeIdxRef.current = idx;
        try {
          const vib = (navigator as any).vibrate as undefined | ((p: number | number[]) => boolean);
          if (typeof vib === "function") {
            if (idx === 2) vib([40, 25, 40]);
            else if (idx === 3) vib([60, 25, 60]);
            else vib([90, 30, 90, 30, 90]);
          }
        } catch {}
      }

      if (shakeUpdateAccRef.current >= 1 / 30) {
        shakeUpdateAccRef.current = 0;

        if (amp <= 0.1) {
          setScreenShake((prev) =>
            prev.x !== 0 || prev.y !== 0 || prev.r !== 0 ? { x: 0, y: 0, r: 0 } : prev
          );
        } else {
          const t = shakeClockRef.current;
          const sx =
            (Math.sin(t * 73.1) + Math.sin(t * 109.7) + Math.sin(t * 181.3)) / 3;
          const sy =
            (Math.cos(t * 67.9) + Math.cos(t * 97.2) + Math.cos(t * 157.4)) / 3;
          const sr = (Math.sin(t * 55.3) + Math.sin(t * 121.9)) / 2;

          setScreenShake({ x: sx * amp, y: sy * amp, r: sr * rotAmp });
        }
      }
    } else {
      if (screenShake.x !== 0 || screenShake.y !== 0 || screenShake.r !== 0) {
        setScreenShake({ x: 0, y: 0, r: 0 });
      }
      lastVibeIdxRef.current = -1;
    }

    if (modeRef.current === "normal") {
      centeredEnoughRef.current = false;
      if (!s.movementEnabled) return;

      if (key === "pabo") {
        const margin = 6;
        const minX = margin;
        const minY = margin;
        const maxX = Math.max(minX, w - baseSize - margin);
        const maxY = Math.max(minY, h - baseSize - margin);

        const width = Math.max(0, maxX - minX);
        const height = Math.max(0, maxY - minY);
        const perim = 2 * (width + height);
        if (perim < 1) return;

        const crawlSpeed = 260;
        paboBorderSRef.current = (paboBorderSRef.current + crawlSpeed * dt) % perim;

        const s0 = paboBorderSRef.current;
        let nx = minX;
        let ny = minY;

        if (s0 < width) {
          nx = minX + s0;
          ny = minY;
        } else if (s0 < width + height) {
          nx = maxX;
          ny = minY + (s0 - width);
        } else if (s0 < 2 * width + height) {
          nx = maxX - (s0 - (width + height));
          ny = maxY;
        } else {
          nx = minX;
          ny = maxY - (s0 - (2 * width + height));
        }

        const smooth = 1 - Math.pow(0.0008, dt);
        const sx = p.x + (nx - p.x) * smooth;
        const sy = p.y + (ny - p.y) * smooth;

        posRef.current = { x: sx, y: sy };
        setPos((prev) =>
          Math.abs(prev.x - sx) + Math.abs(prev.y - sy) > 0.25 ? { x: sx, y: sy } : prev
        );
        return;
      }

      const step = dt * 60;
      let nx = p.x + v.x * step;
      let ny = p.y + v.y * step;

      let bounced = false;
      if (nx < 0 || nx > w - baseSize) {
        v.x *= -1;
        bounced = true;
      }
      if (ny < 0 || ny > h - baseSize) {
        v.y *= -1;
        bounced = true;
      }

      if (bounced) {
        const jitter = 0.08;
        const jx = 1 + (Math.random() * 2 - 1) * jitter;
        const jy = 1 + (Math.random() * 2 - 1) * jitter;
        v.x *= jx;
        v.y *= jy;

        v.x = clamp(v.x, -2.3, 2.3);
        v.y = clamp(v.y, -2.0, 2.0);
      }

      nx = clamp(nx, 0, w - baseSize);
      ny = clamp(ny, 0, h - baseSize);

      const smooth = 1 - Math.pow(0.0008, dt);
      const sx = p.x + (nx - p.x) * smooth;
      const sy = p.y + (ny - p.y) * smooth;

      posRef.current = { x: sx, y: sy };
      setPos((prev) =>
        Math.abs(prev.x - sx) + Math.abs(prev.y - sy) > 0.25 ? { x: sx, y: sy } : prev
      );
    } else {
      if (key === "pabo" && (modeRef.current === "remind1" || modeRef.current === "remind2")) {
        centeredEnoughRef.current = false;

        const cx = (w - baseSize) / 2;
        const cy = (h - baseSize) / 2;

        const bottomMargin = 10;
        const bottomMid = { x: cx, y: Math.max(0, h - baseSize - bottomMargin) };
        const center = { x: cx, y: cy };

        const phase = paboRemindPhaseRef.current;

        const runSpeed = modeRef.current === "remind2" ? 980 : 840;
        const riseSpeed = modeRef.current === "remind2" ? 760 : 640;

        if (phase === 1) {
          const res = moveToward(p, bottomMid, runSpeed * dt);
          posRef.current = { x: res.x, y: res.y };
          setPos((prev) =>
            Math.abs(prev.x - res.x) + Math.abs(prev.y - res.y) > 0.25 ? { x: res.x, y: res.y } : prev
          );
          if (res.done) paboRemindPhaseRef.current = 2;
          return;
        } else {
          const res = moveToward(p, center, riseSpeed * dt);
          const d = dist(res.x, res.y, center.x, center.y);
          centeredEnoughRef.current = d < 6;

          posRef.current = { x: res.x, y: res.y };
          setPos((prev) =>
            Math.abs(prev.x - res.x) + Math.abs(prev.y - res.y) > 0.25 ? { x: res.x, y: res.y } : prev
          );
          return;
        }
      }

      const cx = (w - baseSize) / 2;
      const cy = (h - baseSize) / 2;

      const speed = modeRef.current === "furious" ? 0.9 : modeRef.current === "angry" ? 0.75 : 0.65;

      const t = 1 - Math.exp(-speed * 7 * dt);
      const shaped = smoothStep(0, 1, t);

      const nx = p.x + (cx - p.x) * shaped;
      const ny = p.y + (cy - p.y) * shaped;

      const d = dist(nx, ny, cx, cy);
      centeredEnoughRef.current = d < 6;

      posRef.current = { x: nx, y: ny };
      setPos((prev) =>
        Math.abs(prev.x - nx) + Math.abs(prev.y - ny) > 0.25 ? { x: nx, y: ny } : prev
      );
    }
  });

=======
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
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
  React.useEffect(() => {
    const start = async () => {
      if (!s.cameraEnabled) {
        setCamStatus("off");
        return;
      }

      setCamStatus("starting");

      try {
<<<<<<< HEAD
=======
        // Create hidden video if not exists
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
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

<<<<<<< HEAD
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

=======
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
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
<<<<<<< HEAD
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
=======
          },
          runningMode: "VIDEO",
          numFaces: 1,
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });

        setCamStatus("on");

<<<<<<< HEAD
        baselineEar.current = null;
        earSmoother.current.reset();
        eyeClosed.current = false;
        closedStartedAt.current = 0;
        lastCalibrateToken.current = s.calibrateToken;
=======
        // Reset calibration
        baselineEar.current = null;
        eyeClosed.current = false;
        closedStartedAt.current = 0;
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660

        const loop = () => {
          loopRaf.current = requestAnimationFrame(loop);

<<<<<<< HEAD
          const v = videoRef.current;
          const lmkr = landmarkerRef.current;
          if (!lmkr) return;
          if (!v || v.readyState < 2) return;
=======
          const v = videoRef.current!;
          const lmkr = landmarkerRef.current;
          if (!lmkr) return;
          if (v.readyState < 2) return;
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660

          const w = v.videoWidth || 0;
          const h = v.videoHeight || 0;
          if (!w || !h) return;

          const res = lmkr.detectForVideo(v, performance.now());
          const face = res.faceLandmarks?.[0];
          if (!face) return;

<<<<<<< HEAD
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
            if (smoothedEAR > base) baselineEar.current = base * 0.85 + smoothedEAR * 0.15;
            else baselineEar.current = base * 0.98 + smoothedEAR * 0.02;
          }

          const baseline = baselineEar.current ?? smoothedEAR;
          const closedNow = smoothedEAR < baseline * s.blinkClosedRatio;

=======
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
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
          const now = Date.now();

          if (!eyeClosed.current && closedNow) {
            eyeClosed.current = true;
            closedStartedAt.current = now;
          }

<<<<<<< HEAD
          const openThreshold = baseline * (s.blinkClosedRatio + 0.15);
          const openAgain = eyeClosed.current && !closedNow && smoothedEAR > openThreshold;

          if (openAgain) {
            const dur = now - closedStartedAt.current;
            if (dur >= 50 && dur <= 500) {
              lastBlinkAt.current = now;
              missCount.current = 0;
              setMode("normal");
              targetScaleRef.current = 1;
              paboRemindPhaseRef.current = 1;
            }
            eyeClosed.current = false;
            closedStartedAt.current = 0;
          }

          if (eyeClosed.current && now - closedStartedAt.current > 1000) {
=======
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

>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
            eyeClosed.current = false;
            closedStartedAt.current = 0;
          }
        };

<<<<<<< HEAD
=======
        // start loop
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
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
<<<<<<< HEAD
    return () => stop();
  }, [s.cameraEnabled, s.blinkClosedRatio, s.calibrateToken]);

  const floatFrames = pack.floatFrames;
  const blinkFrames = pack.blinkFrames;
  const angryFrames = pack.angryFrames;
  const furiousFrames = pack.furiousFrames ?? [];

  const reminderFrames = mode === "furious" ? furiousFrames : mode === "angry" ? angryFrames : blinkFrames;

  const floatIdx = Math.floor(floatFrameF) % Math.max(1, floatFrames.length);
  const remindIdx = Math.floor(reminderFrameF) % Math.max(1, reminderFrames.length);

  React.useEffect(() => {
    remindIdxRef.current = remindIdx;
  }, [remindIdx]);

  const shouldAnimateReminders =
    mode !== "normal" &&
    (centeredEnoughRef.current || paboImmediateRemind) &&
    !(mode === "furious" && pack.key === "yaong");

  const normalImgSrc = floatFrames[floatIdx];
  const reminderImgSrc = shouldAnimateReminders ? reminderFrames[remindIdx] : reminderFrames[0];
  const imgSrc = mode === "normal" ? normalImgSrc : reminderImgSrc;
=======

    return () => stop();
    // re-run when these change
  }, [s.cameraEnabled, s.blinkClosedRatio]);
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660

  const label =
    mode === "normal"
      ? "Ideun overlay"
      : mode === "remind1"
      ? "Blink please 👀"
<<<<<<< HEAD
      : mode === "remind2"
      ? "BLINK NOW 😤"
      : mode === "angry"
      ? "ANGRY 😡 BLINK!!!"
      : "FURIOUS 🤬 BLINK!!!";

  const isYaongFuriousSpecial = mode === "furious" && pack.key === "yaong" && !!pack.furiousSpecial;

  const paboFuriousExtraScale =
    mode === "furious" && pack.key === "pabo"
      ? remindIdx === 1
        ? 1.06
        : remindIdx === 2
        ? 1.08
        : remindIdx === 3
        ? 1.1
        : remindIdx >= 4
        ? 1.12
        : 1
      : 1;

  const filterTransition = "filter 300ms ease-out";
  const usePaboScreenShake = isFurious && pack.key === "pabo" && !isYaongFuriousSpecial;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "transparent", overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        html, body, #root { background: transparent !important; margin: 0; padding: 0; overflow: hidden; }
        .smooth-character { image-rendering: pixelated; transform: translateZ(0); backface-visibility: hidden; will-change: transform, filter, opacity; }

        @keyframes ideunPulse {
          0% { opacity: 0.42; transform: scale(1); }
          40% { opacity: 0.82; transform: scale(1.04); }
          100% { opacity: 0.42; transform: scale(1); }
        }

        @keyframes ideunShakeHard {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          10%  { transform: translate(-6px, 3px) rotate(-0.8deg); }
          20%  { transform: translate(6px, -4px) rotate(0.9deg); }
          30%  { transform: translate(-7px, -3px) rotate(-0.7deg); }
          40%  { transform: translate(7px, 4px) rotate(0.8deg); }
          50%  { transform: translate(-6px, 2px) rotate(-0.6deg); }
          60%  { transform: translate(6px, -3px) rotate(0.6deg); }
          70%  { transform: translate(-5px, -2px) rotate(-0.5deg); }
          80%  { transform: translate(5px, 3px) rotate(0.5deg); }
          90%  { transform: translate(-3px, 1px) rotate(-0.3deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }

        @keyframes ideunScan { 0% { background-position: 0% 0%; } 100% { background-position: 0% 100%; } }

        @keyframes yaongPawsDropAndLand {
          0%   { transform: translate(-50%, -150%); opacity: 0; }
          10%  { opacity: 1; }
          55%  { transform: translate(-50%, 0%); }
          70%  { transform: translate(-50%, 10%); }
          82%  { transform: translate(-50%, -2%); }
          92%  { transform: translate(-50%, 3%); }
          100% { transform: translate(-50%, 0%); opacity: 1; }
        }

        @keyframes yaongRiseUp {
          0%   { transform: translate(-50%, 170%); opacity: 0; }
          30%  { opacity: 1; }
          70%  { transform: translate(-50%, -6%); }
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
            animation: "ideunPulse 900ms cubic-bezier(.2,.9,.2,1) infinite",
            willChange: "opacity, transform",
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
              willChange: "background-position, opacity",
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
          animation: isFurious && !usePaboScreenShake ? "ideunShakeHard 120ms linear infinite" : undefined,
          transform: usePaboScreenShake
            ? `translate(${screenShake.x}px, ${screenShake.y}px) rotate(${screenShake.r}deg)`
            : undefined,
          willChange: isFurious ? "transform" : undefined,
        }}
      >
        {isYaongFuriousSpecial && pack.furiousSpecial ? (
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2 }}>
            <img
              src={pack.furiousSpecial.paws}
              alt="yaong-paws"
              draggable={false}
              className="smooth-character"
              style={{
                position: "fixed",
                left: "50%",
                bottom: 0,
                width: "min(860px, 98vw)",
                transform: "translate(-50%, -150%)",
                animation: "yaongPawsDropAndLand 950ms cubic-bezier(.16,.92,.22,1) forwards",
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
                bottom: "8%",
                width: "min(640px, 86vw)",
                transform: "translate(-50%, 170%)",
                animation: "yaongRiseUp 560ms cubic-bezier(.18,.92,.22,1) forwards",
                cursor: "pointer",
                pointerEvents: "auto",
                display: "grid",
                placeItems: "center",
                userSelect: "none",
                willChange: "transform, opacity",
              }}
              title={`${label} • camera: ${camStatus}`}
            >
              <img
                src={pack.furiousSpecial.furious}
                alt="yaong-furious"
                draggable={false}
                className="smooth-character"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 26px rgba(255,0,0,0.38))",
                  transition: filterTransition,
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
              pointerEvents: "auto",
              transform: `translateZ(0) scale(${scale * paboFuriousExtraScale})`,
              transformOrigin: "center center",
              willChange: "transform",
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
              className="smooth-character"
              style={{
                width: imgSize,
                height: imgSize,
                objectFit: "contain",
                filter: isFurious ? "drop-shadow(0 0 18px rgba(255,0,0,0.35))" : undefined,
                transition: filterTransition,
              }}
            />
          </div>
        )}
      </div>

=======
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
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
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
<<<<<<< HEAD
          zIndex: 3,
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        cam: {camStatus} • char: {pack.key}
      </div>
=======
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
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Overlay />
  </React.StrictMode>
);
