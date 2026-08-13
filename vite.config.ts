import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyze = process.env.ANALYZE === "true";

// https://vite.dev/config/
export default defineConfig({
  // Brand assets are static PWA files. Serving this directory as Vite's
  // public root keeps manifest icon URLs stable instead of hashing only the
  // HTML references while leaving manifest-internal URLs unresolved.
  publicDir: "brand",
  plugins: [
    react(),
    tailwindcss(),
    shouldAnalyze &&
      visualizer({
        filename: "bundle-report.html",
        template: "sunburst",
        gzipSize: true,
        brotliSize: true,
        open: true,
      }),
  ],
  test: {
    clearMocks: true,
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
