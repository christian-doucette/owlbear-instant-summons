import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        selector: resolve(__dirname, "monster-selector.html"),
        data: resolve(__dirname, "monster-data.json"),
      },
    },
  },
});
