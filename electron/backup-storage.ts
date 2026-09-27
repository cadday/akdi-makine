import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BACKUP_ARCHIVE_BYTES = 512 * 1024 * 1024;

export function registerBackupStorage(getWindow: () => BrowserWindow | null) {
  const assertTrustedRequest = (sender: Electron.WebContents) => {
    const window = getWindow();
    if (!window || window.isDestroyed() || sender !== window.webContents) {
      throw new Error("Unauthorized backup request");
    }
    return window;
  };

  ipcMain.handle("backup:save", async (event, input: unknown) => {
    const window = assertTrustedRequest(event.sender);
    if (!(input instanceof Uint8Array) || input.byteLength === 0 || input.byteLength > MAX_BACKUP_ARCHIVE_BYTES) {
      throw new Error("Backup archive is invalid or exceeds the 512 MB limit");
    }

    const { canceled, filePath } = await dialog.showSaveDialog(window, {
      title: "Export Database Backup",
      defaultPath: path.join(app.getPath("documents"), `AKDI-MAKINE-Backup-${new Date().toISOString().slice(0, 10)}.zip`),
      filters: [{ name: "AKDI MAKINE Backup", extensions: ["zip"] }],
    });
    if (canceled || !filePath) return { canceled: true };

    await writeFile(filePath, Buffer.from(input));
    return { canceled: false };
  });

  ipcMain.handle("backup:open", async (event) => {
    const window = assertTrustedRequest(event.sender);
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
      title: "Restore Database Backup",
      properties: ["openFile"],
      filters: [{ name: "AKDI MAKINE Backup", extensions: ["zip"] }],
    });
    if (canceled || filePaths.length === 0) return { canceled: true };

    const filePath = filePaths[0];
    const fileStats = await stat(filePath);
    if (fileStats.size === 0 || fileStats.size > MAX_BACKUP_ARCHIVE_BYTES) {
      throw new Error("Backup archive is empty or exceeds the 512 MB limit");
    }
    const bytes = await readFile(filePath);
    return { canceled: false, bytes: new Uint8Array(bytes) };
  });
}