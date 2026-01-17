import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // ✅ CRITICAL for Electron production (file://). Prevents /assets/ breaking.
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        launcher: path.resolve(__dirname, "launcher.html"),
        settings: path.resolve(__dirname, "settings.html"),
        overlay: path.resolve(__dirname, "overlay.html"),
        characterSelect: path.resolve(__dirname, "character-select.html"),
      },
    },
  },
});
