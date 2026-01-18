<<<<<<< HEAD
// C:\Users\User\Downloads\ideun v1\electron\main\index.cjs
const path = require("path");
const { app, BrowserWindow, ipcMain, screen } = require("electron");
=======
const path = require("path");
const { app, BrowserWindow, screen, ipcMain } = require("electron");
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660

const isDev = !app.isPackaged;

function getDevUrl(page) {
  return `http://localhost:5173/${page}`;
}

function getProdUrl(page) {
  return `file://${path.join(__dirname, "..", "..", "dist", page)}`;
}

<<<<<<< HEAD
const PRELOAD = path.join(__dirname, "..", "preload", "index.cjs");

let launcherWin = null;
let settingsWin = null;
let overlayWin = null;
let characterSelectWin = null;

function createWindow({ page, width, height, resizable = false, title }) {
  const win = new BrowserWindow({
    width,
    height,
    resizable,
    title,
    webPreferences: {
      preload: PRELOAD,
=======
function createSettingsWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 640,
    resizable: false,
    title: "Ideun Settings",
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.cjs"),
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

<<<<<<< HEAD
  const url = isDev ? getDevUrl(page) : getProdUrl(page);
  win.loadURL(url);

  // ✅ DO NOT auto-open DevTools (you asked to remove the console popup)
  // If you ever need it, use: View > Toggle Developer Tools
  return win;
}

function createLauncherWindow() {
  if (launcherWin && !launcherWin.isDestroyed()) {
    launcherWin.focus();
    return launcherWin;
  }
  launcherWin = createWindow({
    page: "launcher.html",
    width: 420,
    height: 640,
    title: "Ideun Launcher",
    resizable: false,
  });
  launcherWin.on("closed", () => (launcherWin = null));
  return launcherWin;
}

function createSettingsWindow() {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.focus();
    return settingsWin;
  }
  settingsWin = createWindow({
    page: "settings.html",
    width: 420,
    height: 640,
    title: "Ideun Settings",
    resizable: false,
  });
  settingsWin.on("closed", () => (settingsWin = null));
  return settingsWin;
}

function createOverlayWindow() {
  if (overlayWin && !overlayWin.isDestroyed()) return overlayWin;

  const { workArea } = screen.getPrimaryDisplay();

  overlayWin = new BrowserWindow({
    x: workArea.x,
    y: workArea.y,
    width: workArea.width,
    height: workArea.height,

    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    hasShadow: false,
    skipTaskbar: true,
    alwaysOnTop: true,

    // ✅ key for “overlay pet” feel
    focusable: false,

    webPreferences: {
      preload: PRELOAD,
=======
  const url = isDev ? getDevUrl("settings.html") : getProdUrl("settings.html");
  win.loadURL(url);

  return win;
}

function createOverlayWindow() {
  const { workArea } = screen.getPrimaryDisplay();

  const win = new BrowserWindow({
    width: 260,
    height: 260,
    x: workArea.x + workArea.width - 280,
    y: workArea.y + 40,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.cjs"),
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

<<<<<<< HEAD
  overlayWin.setAlwaysOnTop(true, "screen-saver");
  overlayWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // ✅ Start click-through, BUT still forward mouse-move so renderer can detect hover
  overlayWin.setIgnoreMouseEvents(true, { forward: true });

  const url = isDev ? getDevUrl("overlay.html") : getProdUrl("overlay.html");
  overlayWin.loadURL(url);

  overlayWin.on("closed", () => (overlayWin = null));
  return overlayWin;
}

function createCharacterSelectWindow() {
  if (characterSelectWin && !characterSelectWin.isDestroyed()) {
    characterSelectWin.focus();
    return characterSelectWin;
  }

  characterSelectWin = createWindow({
    page: "character-select.html",
    width: 520,
    height: 860,
    title: "Choose Character",
    resizable: false,
  });

  characterSelectWin.on("closed", () => (characterSelectWin = null));
  return characterSelectWin;
}

/* ---------------- IPC ---------------- */

ipcMain.handle("ideun:openSettings", () => {
  createSettingsWindow();
});

ipcMain.handle("ideun:openCharacterSelect", () => {
  createCharacterSelectWindow();
});

ipcMain.handle("ideun:closeCharacterSelect", () => {
  if (characterSelectWin && !characterSelectWin.isDestroyed()) {
    characterSelectWin.close();
  }
});

// ✅ Renderer -> Main: toggle overlay click-through
ipcMain.on("ideun:overlay:setIgnoreMouse", (_event, ignore) => {
  if (!overlayWin || overlayWin.isDestroyed()) return;

  if (ignore) {
    overlayWin.setIgnoreMouseEvents(true, { forward: true });
  } else {
    overlayWin.setIgnoreMouseEvents(false);
  }
});

// ✅ Settings broadcast (you already use this pattern)
ipcMain.on("ideun:broadcastSettings", (_event, settings) => {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      win.webContents.send("ideun:settingsChanged", settings);
    }
  }
});

/* -------------- App lifecycle -------------- */

app.whenReady().then(() => {
  createLauncherWindow();
  createOverlayWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLauncherWindow();
      createOverlayWindow();
=======
  win.setAlwaysOnTop(true, "screen-saver");
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Default: click-through ON (we'll toggle via settings)
  win.setIgnoreMouseEvents(true, { forward: true });

  const url = isDev ? getDevUrl("overlay.html") : getProdUrl("overlay.html");
  win.loadURL(url);

  return win;
}

let settingsWin = null;
let overlayWin = null;

app.whenReady().then(() => {
  settingsWin = createSettingsWindow();
  overlayWin = createOverlayWindow();

  // IPC: Toggle overlay click-through
  ipcMain.on("overlay:setClickThrough", (_evt, { enabled }) => {
    if (!overlayWin) return;
    overlayWin.setIgnoreMouseEvents(!!enabled, { forward: true });
  });

  // IPC: Focus/open settings
  ipcMain.on("settings:focus", () => {
    if (!settingsWin) return;
    settingsWin.show();
    settingsWin.focus();
  });

  ipcMain.on("settings:open", () => {
    if (!settingsWin) return;
    settingsWin.show();
    settingsWin.focus();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      settingsWin = createSettingsWindow();
      overlayWin = createOverlayWindow();
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
    }
  });
});

app.on("window-all-closed", () => {
<<<<<<< HEAD
  if (process.platform !== "darwin") app.quit();
=======
  app.quit();
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
});
