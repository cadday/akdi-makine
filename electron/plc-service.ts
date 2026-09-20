import { BrowserWindow, ipcMain } from "electron";
import Modbus from "jsmodbus";
import net from "net";

const PLC_IP = "192.168.0.100";
const PLC_PORT = 502;
const REG_START_ADDRESS = 4106;
const REG_COUNT = 11;

const COIL_START_ADDRESS = 2049;
const COIL_COUNT = 2;

let mainWindow: BrowserWindow | null = null;
let pollingInterval: NodeJS.Timeout | null = null;
let isReconnecting = false;
let socket: net.Socket | null = null;
let plcClient: any = null;
let isRegistered = false;

function sendToRenderer(channel: string, payload: unknown) {
  if (mainWindow) {
    mainWindow.webContents.send(channel, payload);
  }
}

function connectToPLC(): void {
  if (isReconnecting) return;

  console.log("Attempting to initialize communication line...");

  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.destroy();
    socket = null;
    plcClient = null;
  }

  socket = new net.Socket();
  plcClient = new Modbus.client.TCP(socket);

  socket.on("connect", () => {
    console.log("Delta PLC Connection Successful! Starting telemetry polling...");
    isReconnecting = false;
    startRealTimePolling();
  });

  socket.on("error", (err: Error) => {
    console.error(`Network Line Drop (${err.message}). Scheduling retry...`);
    sendToRenderer("plc-status", { error: `Disconnected: ${err.message}` });
    handleReconnectionDelay();
  });

  socket.on("close", () => {
    if (!isReconnecting && pollingInterval) {
      console.log("Network socket closed unexpectedly.");
      handleReconnectionDelay();
    }
  });

  socket.connect({ host: PLC_IP, port: PLC_PORT });
}

function handleReconnectionDelay(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }

  if (isReconnecting) return;
  isReconnecting = true;

  setTimeout(() => {
    isReconnecting = false;
    connectToPLC();
  }, 3000);
}

function startRealTimePolling(): void {
  if (pollingInterval) clearInterval(pollingInterval);

  pollingInterval = setInterval(async () => {
    if (!socket || !socket.writable || isReconnecting) return;

    try {
      const [regResponse, coilResponse] = await Promise.all([
        plcClient.readHoldingRegisters(REG_START_ADDRESS, REG_COUNT),
        plcClient.readCoils(COIL_START_ADDRESS, COIL_COUNT),
      ]);

      const rawRegs: number[] = regResponse.response.body.values;
      const uInt16D10 = rawRegs[0];
      const uInt16D20 = rawRegs[10];

      const rawCoils: boolean[] = coilResponse.response.body.valuesAsArray || coilResponse.response.body.values;
      const statusM1 = rawCoils && rawCoils.length > 0 ? rawCoils[0] : false;
      const statusM2 = rawCoils && rawCoils.length > 1 ? rawCoils[1] : false;

      sendToRenderer("plc-live-data", {
        timestamp: new Date().toLocaleTimeString(),
        d10Value: uInt16D10,
        d20Value: uInt16D20,
        m1Status: statusM1,
        m2Status: statusM2,
      });
    } catch (err: any) {
      console.warn("Register transaction lost. Tearing down line connection:", err?.message ?? err);
      handleReconnectionDelay();
    }
  }, 100);
}

export function initializePlcService(window: BrowserWindow | null): void {
  mainWindow = window;

  if (isRegistered) return;

  ipcMain.handle("write-plc-coil", async (_event, { address, value }: { address: number; value: boolean }) => {
    if (!socket || !socket.writable) {
      return { success: false, error: "PLC communication line down" };
    }

    try {
      await plcClient.writeSingleCoil(address, value);
      return { success: true, message: `Coil ${address} set to ${value}` };
    } catch (err: any) {
      return { success: false, error: err?.message ?? "Unknown PLC write error" };
    }
  });

  if (mainWindow) {
    mainWindow.webContents.on("did-finish-load", connectToPLC);
  }

  isRegistered = true;
}

export function shutdownPlcService(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.destroy();
    socket = null;
    plcClient = null;
  }
}
