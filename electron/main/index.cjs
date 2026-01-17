const path = require("path");
const { app, BrowserWindow, screen, ipcMain } = require("electron");

const isDev = !app.isPackaged;

function getDevUrl(page) {
  return `http://localhost:5173/${page}`;
}

function getProdUrl(page) {
  return `file://${path.join(__dirname, "..", "..", "dist", page)}`;
}

function createSettingsWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 640,
    resizable: false,
    title: "Ideun Settings",
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

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
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

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
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
