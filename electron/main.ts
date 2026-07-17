import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url);
import Modbus from "jsmodbus";
import net from "net";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "akdi.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    autoHideMenuBar: true,
    show: false,
  });
  mainWindow.maximize();
  mainWindow.show();

  mainWindow.webContents.on("did-finish-load", connectToPLC);

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// --- PLC NETWORKING & POLLING LOGIC ---
const PLC_IP = "192.168.0.100";
const PLC_PORT = 502;
const REG_START_ADDRESS = 4106; // D10
const REG_COUNT = 11; // Span to D20

const COIL_START_ADDRESS = 2049; // Modbus address for M1
const COIL_COUNT = 2; // Read 2 consecutive items (M1 at 2049, M2 at 2050)

const socket = new net.Socket();
let plcClient;
let pollingInterval;

function connectToPLC() {
  plcClient = new Modbus.client.TCP(socket);

  socket.on("connect", () => {
    console.log("🔌 Industrial networking active. Connected to PLC.");
    startRealTimePolling();
  });

  socket.on("error", (err) => {
    console.error("❌ Network Connection failed:", err.message);
    if (mainWindow) mainWindow.webContents.send("plc-status", { error: `Disconnected: ${err.message}` });
    // Attempt reconnection after 5 seconds
    setTimeout(connectToPLC, 5000);
  });

  socket.connect({ host: PLC_IP, port: PLC_PORT });
}

function startRealTimePolling(): void {
  if (pollingInterval) clearInterval(pollingInterval);

  pollingInterval = setInterval(async () => {
    if (!socket.writable) return;

    try {
      // Execute both industrial queries concurrently via Promise.all
      const [regResponse, coilResponse] = await Promise.all([
        plcClient.readHoldingRegisters(REG_START_ADDRESS, REG_COUNT),
        plcClient.readCoils(COIL_START_ADDRESS, COIL_COUNT),
      ]);

      // 1. Parse Register Block Values
      const rawRegs: number[] = regResponse.response.body.values;
      const uInt16D10 = rawRegs[0];
      const uInt16D20 = rawRegs[10];

      // 2. Parse Coil Block Status Safely
      // jsmodbus populates bit arrays under valuesAsArray or values depending on version
      const rawCoils: boolean[] = coilResponse.response.body.valuesAsArray || coilResponse.response.body.values;

      // Check if array exists and has elements to protect against runtime exceptions
      const statusM1 = rawCoils && rawCoils.length > 0 ? rawCoils[0] : false;
      const statusM2 = rawCoils && rawCoils.length > 1 ? rawCoils[1] : false; // 👈 Fixed index assignment

      if (mainWindow) {
        mainWindow.webContents.send("plc-live-data", {
          timestamp: new Date().toLocaleTimeString(),
          d10Value: uInt16D10,
          d20Value: uInt16D20,
          m1Status: statusM1,
          m2Status: statusM2,
        });
      }
    } catch (err: any) {
      console.error("Polling transaction dropped:", err.message);
    }
  }, 50);
}

// On-demand command execution remains accessible via separate channel
ipcMain.handle("write-plc-coil", async (_event, { address, value }) => {
  if (!socket.writable) return { success: false, error: "PLC communication line down" };
  try {
    await plcClient.writeSingleCoil(address, value);
    return { success: true, message: `Coil ${address} set to ${value}` };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
