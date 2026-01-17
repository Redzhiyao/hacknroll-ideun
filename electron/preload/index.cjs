// C:\Users\User\Downloads\ideun v1\electron\preload\index.cjs
const { contextBridge, ipcRenderer } = require("electron");

// Keep it small + serializable (avoid “object could not be cloned”)
contextBridge.exposeInMainWorld("ideun", {
  // windows
  openSettings: () => ipcRenderer.invoke("ideun:openSettings"),
  openCharacterSelect: () => ipcRenderer.invoke("ideun:openCharacterSelect"),
  closeCharacterSelect: () => ipcRenderer.invoke("ideun:closeCharacterSelect"),

  // overlay click-through toggle
  setOverlayIgnoreMouse: (ignore) => {
    ipcRenderer.send("ideun:overlay:setIgnoreMouse", !!ignore);
  },

  // settings sync
  broadcastSettings: (s) => ipcRenderer.send("ideun:broadcastSettings", s),
  onSettingsChanged: (cb) => {
    const handler = (_e, s) => cb(s);
    ipcRenderer.on("ideun:settingsChanged", handler);
    return () => ipcRenderer.removeListener("ideun:settingsChanged", handler);
  },
});
