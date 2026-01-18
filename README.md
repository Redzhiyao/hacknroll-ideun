# Ideun — Blink Tracker Pet (Desktop Overlay)

Ideun is a lightweight desktop app that helps you blink more while using your computer. It tracks your blink behaviour locally (webcam-based) and displays an always-on-top “pet” overlay that gently reminds you when you haven’t blinked for too long.

The pet has different moods/animations depending on how long it has been since your last blink. You can also switch between characters (Angel / Yaong) in Character Select / Settings.

## Key Features

- Local blink tracking (webcam-based; runs on-device)
- Transparent always-on-top pet overlay across your screen
- Floating pet movement (optional) + click-to-open settings
- Reminder escalation states:
  - normal → remind1 → remind2 → angry → furious
- Character selection (Angel / Yaong)
- Configurable settings:
  - “No blink” reminder threshold (`remindAfterMs`)
  - Blink detection sensitivity (`blinkClosedRatio`)
  - Movement toggle (movementEnabled)
  - Camera toggle (cameraEnabled)
  - Calibration trigger (calibrateToken)

## Privacy

- Camera access is used only for blink detection
- Processing happens locally on your machine
- No video is uploaded or stored
- Ideun does not collect personal data

## Tech Stack

- Electron (desktop app, multiple windows)
- Vite + React + TypeScript (UI + overlay rendering)
- MediaPipe Tasks Vision (FaceLandmarker) for blink detection
- Local settings store shared across windows (Launcher / Settings / Character Select / Overlay)

## Project Structure (High-level)

- `electron/`
  - Electron main process: creates windows (launcher, settings, character select, overlay)
  - IPC: opens windows + broadcasts settings updates
- `src/windows/launcher/`
  - Launcher UI (entry point)
- `src/windows/characterSelect/`
  - Character selection UI
- `src/windows/settings/`
  - Settings UI (camera, movement, thresholds, calibration)
- `src/windows/overlay/`
  - Full-screen transparent overlay that renders the pet + animations
  - Blink detection loop + reminder escalation logic
- `src/shared/store/`
  - Shared settings store + subscribe/get helpers
- `src/shared/characters/`
  - Character packs + frame lists (`getPack(characterId)`)
- `public/characters/`
  - Character sprite assets (Angel / Yaong, including special furious assets)

## How to Run (Local Development)
npm run dev:app

### 1) Install dependencies

```bash
npm install
