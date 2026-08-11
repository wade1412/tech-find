import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyze = process.env.ANALYZE === "true";

// https://vite.dev/config/
export default defineConfig({
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
