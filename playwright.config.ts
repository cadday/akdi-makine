import { defineConfig } from "@playwright/test";
import { tmpdir } from "node:os";
import path from "node:path";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: path.join(tmpdir(), "akdi-makine-playwright-results"),
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: "list",
  use: {
    headless: true,
    screenshot: "off",
    video: "off",
    trace: "off",
  },
});
