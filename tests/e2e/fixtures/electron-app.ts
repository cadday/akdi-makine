import { _electron as electron, expect, test as base, type ElectronApplication, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { createSeedBackup } from "../helpers/seed-backup";

interface ElectronFixtures {
  electronApp: ElectronApplication;
  appPage: Page;
  appUrl: string;
}

const e2eRoot = path.join(tmpdir(), "akdi-makine-e2e");

export const test = base.extend<ElectronFixtures>({
  // Playwright requires an object pattern when no fixture dependencies are used.
  // eslint-disable-next-line no-empty-pattern
  electronApp: async ({}, use, testInfo) => {
    const testDirectory = path.join(e2eRoot, `${testInfo.testId}-${randomUUID()}`);
    const userDataPath = path.join(testDirectory, "profile");
    const backupPath = path.join(testDirectory, "seed.zip");
    await mkdir(testDirectory, { recursive: true });
    await writeFile(backupPath, createSeedBackup());

    let app: ElectronApplication | undefined;
    try {
      app = await electron.launch({
        args: [path.resolve("dist-electron/main.js")],
        env: {
          ...process.env,
          AKDI_E2E: "1",
          AKDI_E2E_USER_DATA: userDataPath,
        },
      });
      const page = await app.firstWindow();
      await expect(page).toHaveTitle("AKDI MAKINE");
      await app.evaluate(({ app: electronApp }) => electronApp.getPath("userData"), userDataPath).then((actualPath) => {
        expect(actualPath).toBe(userDataPath);
      });
      await app.evaluate(({ dialog }, selectedBackupPath) => {
        dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [selectedBackupPath] });
      }, backupPath);

      const appUrl = page.url().split("#")[0];
      await page.goto(`${appUrl}#/settings`);
      await page.getByRole("button", { name: "Select Backup" }).click();
      await page.getByRole("button", { name: "Replace and Restore" }).click();
      await expect(page).toHaveURL(/#\/overview$/);
      await expect(page.getByRole("button", { name: "No machine connected!" })).toBeVisible();
      await use(app);
    } finally {
      try {
        await app?.close();
      } finally {
        await rm(testDirectory, { recursive: true, force: true });
      }
    }
  },
  appPage: async ({ electronApp }, use) => {
    await use(await electronApp.firstWindow());
  },
  appUrl: async ({ appPage }, use) => {
    await use(appPage.url().split("#")[0]);
  },
});

export { expect } from "@playwright/test";
