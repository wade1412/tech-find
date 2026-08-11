import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "vite";

const fileEnv = loadEnv("e2e", process.cwd(), "");

for (const key of [
  "E2E_SUPABASE_URL",
  "E2E_SUPABASE_SERVICE_ROLE_KEY",
  "E2E_USER_EMAIL",
  "E2E_USER_PASSWORD",
] as const) {
  process.env[key] ??= fileEnv[key];
}

export default defineConfig({
  testDir: "./e2e",

  timeout: 60_000,

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 1 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL: "http://127.0.0.1:5173",

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command:
      "node ./node_modules/vite/bin/vite.js --host 127.0.0.1 --mode e2e",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
