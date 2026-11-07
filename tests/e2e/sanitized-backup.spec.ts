import { _electron as electron, expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { strFromU8, unzipSync } from "fflate";
import { prepareBackupForE2E } from "./helpers/seed-backup";

const suppliedBackupPath = process.env.AKDI_E2E_SANITIZED_BACKUP;

test("restores an anonymized copy of the supplied backup without connecting a machine", async () => {
  test.skip(!suppliedBackupPath, "Set AKDI_E2E_SANITIZED_BACKUP to run this optional loaded-data restore check");

  const testDirectory = path.join(tmpdir(), "akdi-makine-e2e", `backup-${randomUUID()}`);
  const userDataPath = path.join(testDirectory, "profile");
  const backupPath = path.join(testDirectory, "sanitized.zip");
  await mkdir(testDirectory, { recursive: true });
  const sourceBytes = new Uint8Array(await readFile(path.resolve(suppliedBackupPath!)));
  const preparedBytes = prepareBackupForE2E(sourceBytes);
  await writeFile(backupPath, preparedBytes);
  const records = JSON.parse(strFromU8(unzipSync(preparedBytes)["records.json"]));

  let app: Awaited<ReturnType<typeof electron.launch>> | undefined;
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
    await app.evaluate(({ dialog }, selectedBackupPath) => {
      dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [selectedBackupPath] });
    }, backupPath);

    const appUrl = page.url().split("#")[0];
    await page.goto(`${appUrl}#/settings`);
    await page.getByRole("button", { name: "Select Backup" }).click();
    await page.getByRole("button", { name: "Replace and Restore" }).click();
    await expect(page).toHaveURL(/#\/overview$/);
    await expect(page.getByRole("button", { name: "No machine connected!" })).toBeVisible();

    await page.goto(`${appUrl}#/tests`);
    if (records.tests.length > 0) {
      await expect(page.getByRole("grid").getByRole("row").nth(1)).toBeVisible();
    }
  } finally {
    try {
      await app?.close();
    } finally {
      await rm(testDirectory, { recursive: true, force: true });
    }
  }
});