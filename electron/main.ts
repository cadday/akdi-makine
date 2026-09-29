import { app, BrowserWindow, dialog, ipcMain, session, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { registerBackupStorage } from "./backup-storage";
import { registerImageStorage } from "./image-storage";
import { shutdownPlcService } from "./plc-service";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let mainWindow: BrowserWindow | null;
const activePdfImageReaders = new Set<number>();
registerImageStorage(() => mainWindow, (sender) => activePdfImageReaders.has(sender.id));
registerBackupStorage(() => mainWindow);

type PdfRecordType = "test" | "specimen" | "preset" | "data-field";
interface PdfRecordRequest {
  type: PdfRecordType;
  id: string;
  name: string;
}
interface PdfComparisonRequest {
  type: "test-comparison";
  testIds: string[];
  name: string;
}

const pdfReadyWaiters = new Map<number, { resolve: () => void; reject: (error: Error) => void; timeout: ReturnType<typeof setTimeout> }>();

function startAutoUpdates() {
  if (!app.isPackaged || process.platform !== "win32") return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on("checking-for-update", () => console.info("Checking for application updates"));
  autoUpdater.on("update-available", (info) => console.info(`Application update ${info.version} is available`));
  autoUpdater.on("update-not-available", () => console.info("Application is up to date"));
  autoUpdater.on("error", (error) => console.error("Application update failed:", error));
  autoUpdater.on("update-downloaded", (info) => {
    const options = {
      type: "info" as const,
      title: "Update ready to install",
      message: `Version ${info.version} has been downloaded. Restart the app now to install it?`,
      buttons: ["Restart now", "Later"],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    };
    const prompt = mainWindow && !mainWindow.isDestroyed() ? dialog.showMessageBox(mainWindow, options) : dialog.showMessageBox(options);
    void prompt
      .then(({ response }) => {
        if (response === 0) autoUpdater.quitAndInstall();
      })
      .catch((error: unknown) => console.error("Could not show update installation prompt:", error));
  });

  void autoUpdater.checkForUpdates().catch((error: unknown) => console.error("Could not check for application updates:", error));
}

ipcMain.handle("pdf:ready", (event, error?: unknown) => {
  const waiter = pdfReadyWaiters.get(event.sender.id);
  if (!waiter) throw new Error("Unexpected PDF ready signal");

  clearTimeout(waiter.timeout);
  pdfReadyWaiters.delete(event.sender.id);
  if (typeof error === "string" && error) waiter.reject(new Error(error));
  else waiter.resolve();
  return true;
});

ipcMain.handle("pdf:show-in-folder", (event, filePath: unknown) => {
  if (!mainWindow || mainWindow.isDestroyed() || event.sender !== mainWindow.webContents) {
    throw new Error("Unauthorized PDF request");
  }
  if (typeof filePath !== "string" || !filePath.trim()) throw new Error("Invalid PDF path");
  shell.showItemInFolder(filePath);
});

ipcMain.handle("window:minimize", () => {
  mainWindow?.minimize();
});

ipcMain.handle("window:maximize", () => {
  if (!mainWindow) return;

  if (mainWindow.isMaximized()) {
    mainWindow.restore();
    return;
  }
  mainWindow.maximize();
});

ipcMain.handle("window:close", () => {
  mainWindow?.close();
});

ipcMain.handle("window:is-maximized", () => {
  return !!mainWindow && mainWindow.isMaximized();
});

ipcMain.handle("pdf:save-record", async (event, input: unknown) => {
  if (!mainWindow || mainWindow.isDestroyed() || event.sender !== mainWindow.webContents) {
    throw new Error("Unauthorized PDF request");
  }

  if (!input || typeof input !== "object") throw new Error("Invalid PDF request");
  const request = input as Partial<PdfRecordRequest> & Partial<PdfComparisonRequest>;
  const recordTypes = new Set<PdfRecordType>(["test", "specimen", "preset", "data-field"]);
  let name: string;
  let printRoute: string;
  if (request.type === "test-comparison") {
    const comparisonRequest = input as Partial<PdfComparisonRequest>;
    const testIds = comparisonRequest.testIds;
    if (
      typeof comparisonRequest.name !== "string" ||
      !Array.isArray(testIds) ||
      testIds.length < 2 ||
      !testIds.every((id) => typeof id === "string" && id.trim().length > 0)
    ) {
      throw new Error("Invalid PDF comparison request");
    }
    name = comparisonRequest.name;
    const searchParams = new URLSearchParams();
    testIds.forEach((id) => searchParams.append("testId", id));
    printRoute = `/print/test-comparison?${searchParams.toString()}`;
  } else {
    const recordRequest = input as Partial<PdfRecordRequest>;
    if (
      !recordRequest.type ||
      !recordTypes.has(recordRequest.type) ||
      typeof recordRequest.id !== "string" ||
      !recordRequest.id ||
      typeof recordRequest.name !== "string"
    ) {
      throw new Error("Invalid PDF request");
    }
    name = recordRequest.name;
    printRoute = `/print/${recordRequest.type}/${encodeURIComponent(recordRequest.id)}`;
  }

  const safeName = Array.from(name.replace(/[<>:"/\\|?*]/g, "_"), (character) => (character.charCodeAt(0) < 32 ? "_" : character))
    .join("")
    .trim()
    .replace(/[. ]+$/, "") || "Test";

  const parentWindow = mainWindow;
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: request.type === "test-comparison" ? "Save Test Comparison as PDF" : "Save Record as PDF",
    defaultPath: path.join(app.getPath("documents"), `${safeName}.pdf`),
    filters: [{ name: "PDF", extensions: ["pdf"] }],
  });

  if (canceled || !filePath) return { canceled: true };

  if (parentWindow.isDestroyed()) throw new Error("The main window was closed before PDF export completed");
  event.sender.send("pdf:creating");

  const printWindow = new BrowserWindow({
    parent: parentWindow,
    width: 750,
    minWidth: 750,
    maxWidth: 750,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: !app.isPackaged,
      backgroundThrottling: false,
    },
  });

  const printWindowId = printWindow.webContents.id;
  activePdfImageReaders.add(printWindowId);
  const ready = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      pdfReadyWaiters.delete(printWindowId);
      reject(new Error("Timed out waiting for the PDF report to render"));
    }, 30_000);
    pdfReadyWaiters.set(printWindowId, { resolve, reject, timeout });
  });

  try {
    const load = VITE_DEV_SERVER_URL
      ? printWindow.loadURL(`${VITE_DEV_SERVER_URL.replace(/\/$/, "")}/#${printRoute}`)
      : printWindow.loadFile(path.join(RENDERER_DIST, "index.html"), { hash: printRoute });
    await Promise.all([load, ready]);

    const pdf = await printWindow.webContents.printToPDF({
      pageSize: "A4",
      printBackground: true,
      displayHeaderFooter: false,
    });
    await writeFile(filePath, pdf);

    return { canceled: false, filePath };
  } finally {
    activePdfImageReaders.delete(printWindowId);
    const waiter = pdfReadyWaiters.get(printWindowId);
    if (waiter) {
      clearTimeout(waiter.timeout);
      pdfReadyWaiters.delete(printWindowId);
    }
    if (!printWindow.isDestroyed()) printWindow.close();
  }
});

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) return;
  mainWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: !app.isPackaged,
    },
    minWidth: 1000,
    minHeight: 600,
    autoHideMenuBar: true,
    show: false,
    frame: false,
    titleBarStyle: "hidden",
  });

  // mainWindow.removeMenu();

  // External link handling
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Optionally check if the URL is external
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("maximize", () => {
    mainWindow?.webContents.send("window:maximized-state-changed", true);
  });

  mainWindow.on("unmaximize", () => {
    mainWindow?.webContents.send("window:maximized-state-changed", false);
  });

  mainWindow.maximize();
  mainWindow.show();

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  shutdownPlcService();

  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
  createWindow();
  startAutoUpdates();
});
