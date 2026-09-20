import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Komut satırında verilen BASE_URL'i .env okunmadan önce yakala; böylece
// komuttaki değer her zaman .env dosyasındakini yener.
const inlineBaseUrl = process.env.BASE_URL;

loadEnv();

const authFile = process.env.AUTH_FILE || "playwright/.auth/user.json";

// DoseKey kaynak klasörü. Bu paket deponun içinde e2e/ olarak durduğu için
// varsayılan üst klasör; başka yerden koşmak istersen APP_DIR ile değiştir.
const appDir = process.env.APP_DIR || "..";
const here = dirname(fileURLToPath(import.meta.url));
const hasApp = existsSync(join(here, appDir, "vite.mobile.config.ts"));
const localUrl = "http://localhost:4173";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL:
      inlineBaseUrl ||
      (hasApp
        ? localUrl
        : process.env.BASE_URL ||
          "https://dosekey-tracker.batuhanegesahin.chatgpt.site"),
    actionTimeout: 15_000,
    locale: "tr-TR",
    timezoneId: "Europe/Istanbul",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    storageState: existsSync(authFile) ? authFile : undefined,
  },
  webServer: hasApp
    ? {
        command:
          "npx vite build --config vite.mobile.config.ts && npx vite preview --config vite.mobile.config.ts --port 4173 --strictPort",
        cwd: appDir,
        url: localUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
  projects: [
    {
      name: "android-chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
