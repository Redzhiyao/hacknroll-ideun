import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
<<<<<<< HEAD
import path from "path";

export default defineConfig({
  // ✅ CRITICAL for Electron production (file://). Prevents /assets/ breaking.
  base: "./",
=======
import { resolve } from "path";

export default defineConfig({
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
<<<<<<< HEAD
        main: path.resolve(__dirname, "index.html"),
        launcher: path.resolve(__dirname, "launcher.html"),
        settings: path.resolve(__dirname, "settings.html"),
        overlay: path.resolve(__dirname, "overlay.html"),
        characterSelect: path.resolve(__dirname, "character-select.html"),
      },
    },
  },
=======
        main: resolve(__dirname, "index.html"),
        settings: resolve(__dirname, "settings.html"),
        overlay: resolve(__dirname, "overlay.html")
      }
    }
  }
>>>>>>> 822c7754301e2b7d24d32487830561c1ef7cf660
});
