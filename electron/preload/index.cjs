const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ideun", {
  setOverlayClickThrough: (enabled) =>
    ipcRenderer.send("overlay:setClickThrough", { enabled }),
  focusSettings: () => ipcRenderer.send("settings:focus"),
  openSettings: () => ipcRenderer.send("settings:open"),
});
