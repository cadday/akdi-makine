import { BrowserWindow, ipcMain } from "electron";
import { randomUUID } from "node:crypto";
import Modbus from "jsmodbus";
import net from "node:net";
import {
  readPlcAdjustments,
  readPlcOverviewValues,
  readPlcWorkingStatus,
  setMoveDown,
  setMoveUp,
  triggerResetLoad,
  triggerResetStroke,
  writePlcAdjustments,
} from "./plc-operations";

const PLC_PORT = 502;
const CONNECTION_TIMEOUT_MS = 5000;
const PREPARED_CONNECTION_TIMEOUT_MS = 60_000;
const PLC_HEALTH_POLL_INTERVAL_MS = 1000;

export interface PlcConnectionStatus {
  state: "disconnected" | "connecting" | "online" | "offline";
  ipAddress: string | null;
  plcWorking?: boolean | null;
  clearSelection?: boolean;
  error?: string;
}

interface PreparedConnection {
  ipAddress: string;
  socket: net.Socket;
  client: InstanceType<typeof Modbus.client.TCP>;
  timeout: NodeJS.Timeout;
}

let mainWindow: BrowserWindow | null = null;
let activeSocket: net.Socket | null = null;
let activeClient: InstanceType<typeof Modbus.client.TCP> | null = null;
let activeIpAddress: string | null = null;
let healthPollTimeout: NodeJS.Timeout | null = null;
let connectionStatus: PlcConnectionStatus = { state: "disconnected", ipAddress: null };
let isRegistered = false;
const preparedConnections = new Map<string, PreparedConnection>();

function sendStatus(status: PlcConnectionStatus) {
  const unchanged =
    connectionStatus.state === status.state &&
    connectionStatus.ipAddress === status.ipAddress &&
    connectionStatus.plcWorking === status.plcWorking &&
    connectionStatus.clearSelection === status.clearSelection &&
    connectionStatus.error === status.error;
  connectionStatus = status;
  if (!unchanged && mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("plc:status", status);
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error !== "object" || error === null) return String(error);

  const details = error as Record<string, unknown>;
  const response = details.response;
  const responseBody = typeof response === "object" && response !== null ? (response as Record<string, unknown>).body : null;
  const responseMessage =
    typeof responseBody === "object" && responseBody !== null
      ? (responseBody as Record<string, unknown>).message
      : null;
  const parts = [
    typeof details.err === "string" ? details.err : null,
    typeof details.message === "string" ? details.message : null,
    typeof responseMessage === "string" ? responseMessage : null,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(": ") : "Unknown PLC error";
}

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(getErrorMessage(error));
}

function assertTrustedRequest(sender: Electron.WebContents) {
  if (!mainWindow || mainWindow.isDestroyed() || sender !== mainWindow.webContents) {
    throw new Error("Unauthorized PLC request");
  }
}

function normalizeIpAddress(value: unknown) {
  if (typeof value !== "string" || !net.isIPv4(value.trim())) {
    throw new Error("Enter a valid IPv4 address");
  }

  return value
    .trim()
    .split(".")
    .map((octet) => String(Number(octet)))
    .join(".");
}

function clearPreparedConnection(token: string, closeSocket: boolean) {
  const prepared = preparedConnections.get(token);
  if (!prepared) return;

  clearTimeout(prepared.timeout);
  preparedConnections.delete(token);
  if (closeSocket) {
    prepared.socket.removeAllListeners();
    prepared.socket.destroy();
  }
}

function removePreparedSocket(socket: net.Socket) {
  for (const [token, prepared] of preparedConnections) {
    if (prepared.socket === socket) {
      clearPreparedConnection(token, false);
      return;
    }
  }
}

type ModbusTcpClient = InstanceType<typeof Modbus.client.TCP>;

function stopHealthPolling() {
  if (!healthPollTimeout) return;
  clearTimeout(healthPollTimeout);
  healthPollTimeout = null;
}

function disconnectActiveSocket(socket: net.Socket, error?: Error) {
  if (activeSocket !== socket) return;

  const ipAddress = activeIpAddress;
  stopHealthPolling();
  activeSocket = null;
  activeClient = null;
  activeIpAddress = null;
  socket.removeAllListeners();
  socket.destroy();
  sendStatus({
    state: "offline",
    ipAddress,
    plcWorking: null,
    clearSelection: true,
    ...(error ? { error: error.message } : {}),
  });
}

function handleSocketError(socket: net.Socket, error: Error) {
  removePreparedSocket(socket);
  disconnectActiveSocket(socket, error);
}

function handleSocketClose(socket: net.Socket) {
  removePreparedSocket(socket);
  if (activeSocket === socket) {
    const ipAddress = activeIpAddress;
    stopHealthPolling();
    activeSocket = null;
    activeClient = null;
    activeIpAddress = null;
    sendStatus({
      state: "offline",
      ipAddress,
      plcWorking: null,
      clearSelection: true,
      error: "PLC connection closed unexpectedly",
    });
  }
}

function openSocket(ipAddress: string) {
  return new Promise<{ socket: net.Socket; client: ModbusTcpClient }>((resolve, reject) => {
    const socket = new net.Socket();
    const client = new Modbus.client.TCP(socket, 1, CONNECTION_TIMEOUT_MS);
    let connected = false;
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      socket.destroy();
      reject(new Error(`Connection to ${ipAddress}:${PLC_PORT} timed out`));
    }, CONNECTION_TIMEOUT_MS);

    socket.on("connect", () => {
      connected = true;
      settled = true;
      clearTimeout(timeout);
      resolve({ socket, client });
    });

    socket.on("error", (error: Error) => {
      if (!connected) {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(new Error(`Could not connect to ${ipAddress}:${PLC_PORT}: ${error.message}`));
        return;
      }

      handleSocketError(socket, error);
    });

    socket.on("close", () => {
      if (!connected) {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(new Error(`Connection to ${ipAddress}:${PLC_PORT} closed before it was established`));
        return;
      }

      handleSocketClose(socket);
    });

    try {
      socket.connect({ host: ipAddress, port: PLC_PORT });
    } catch (error) {
      settled = true;
      clearTimeout(timeout);
      socket.removeAllListeners();
      socket.destroy();
      reject(toError(error));
    }
  });
}

async function prepareConnection(value: unknown) {
  const ipAddress = normalizeIpAddress(value);
  const { socket, client } = await openSocket(ipAddress);
  const token = randomUUID();
  const timeout = setTimeout(() => clearPreparedConnection(token, true), PREPARED_CONNECTION_TIMEOUT_MS);

  preparedConnections.set(token, { ipAddress, socket, client, timeout });
  return { token, ipAddress };
}

function startHealthPolling(socket: net.Socket, client: InstanceType<typeof Modbus.client.TCP>, ipAddress: string) {
  const poll = async () => {
    if (activeSocket !== socket || activeClient !== client) return;

    try {
      const plcWorking = await readPlcWorkingStatus(client);
      if (activeSocket !== socket || activeClient !== client) return;

      sendStatus({
        state: "online",
        ipAddress,
        plcWorking,
      });
    } catch (error) {
      disconnectActiveSocket(socket, toError(error));
      return;
    }

    if (activeSocket === socket && activeClient === client) {
      healthPollTimeout = setTimeout(() => {
        healthPollTimeout = null;
        void poll();
      }, PLC_HEALTH_POLL_INTERVAL_MS);
    }
  };

  void poll();
}

function activateConnection(token: unknown): PlcConnectionStatus {
  if (typeof token !== "string") throw new Error("Invalid prepared PLC connection");

  const prepared = preparedConnections.get(token);
  if (!prepared) throw new Error("Prepared PLC connection expired or is no longer available");
  if (prepared.socket.destroyed || !prepared.socket.writable) {
    clearPreparedConnection(token, true);
    throw new Error(`Connection to ${prepared.ipAddress}:${PLC_PORT} is no longer available`);
  }

  clearPreparedConnection(token, false);
  stopHealthPolling();
  const previousSocket = activeSocket;
  activeSocket = prepared.socket;
  activeClient = prepared.client;
  activeIpAddress = prepared.ipAddress;
  const status: PlcConnectionStatus = { state: "connecting", ipAddress: prepared.ipAddress, plcWorking: null };
  sendStatus(status);

  if (previousSocket && previousSocket !== activeSocket) {
    previousSocket.removeAllListeners();
    previousSocket.destroy();
  }

  startHealthPolling(prepared.socket, prepared.client, prepared.ipAddress);
  return status;
}

function disconnect() {
  stopHealthPolling();
  const previousSocket = activeSocket;
  activeSocket = null;
  activeClient = null;
  activeIpAddress = null;

  for (const token of preparedConnections.keys()) {
    clearPreparedConnection(token, true);
  }

  if (previousSocket) {
    previousSocket.removeAllListeners();
    previousSocket.destroy();
  }

  const status: PlcConnectionStatus = { state: "disconnected", ipAddress: null, plcWorking: null };
  sendStatus(status);
  return status;
}

async function connect(ipAddress: unknown) {
  const normalizedIpAddress = normalizeIpAddress(ipAddress);
  const previousSocket = activeSocket;
  const previousIpAddress = activeIpAddress;
  sendStatus({ state: "connecting", ipAddress: normalizedIpAddress });

  let token: string | null = null;
  try {
    const prepared = await prepareConnection(normalizedIpAddress);
    token = prepared.token;
    return activateConnection(token);
  } catch (error) {
    if (token) clearPreparedConnection(token, true);
    if (previousSocket && activeSocket === previousSocket && !previousSocket.destroyed && previousSocket.writable && previousIpAddress) {
      sendStatus({
        state: "online",
        ipAddress: previousIpAddress,
        plcWorking: connectionStatus.ipAddress === previousIpAddress ? connectionStatus.plcWorking : null,
      });
    } else {
      sendStatus({
        state: "offline",
        ipAddress: normalizedIpAddress,
        plcWorking: null,
        error: getErrorMessage(error),
      });
    }
    return connectionStatus;
  }
}

export function initializePlcService(window: BrowserWindow | null): void {
  mainWindow = window;
  if (isRegistered) return;

  ipcMain.handle("plc:prepare-connection", async (event, ipAddress: unknown) => {
    assertTrustedRequest(event.sender);
    return prepareConnection(ipAddress);
  });

  ipcMain.handle("plc:activate-connection", (event, token: unknown) => {
    assertTrustedRequest(event.sender);
    return activateConnection(token);
  });

  ipcMain.handle("plc:cancel-connection", (event, token: unknown) => {
    assertTrustedRequest(event.sender);
    if (typeof token !== "string") throw new Error("Invalid prepared PLC connection");
    clearPreparedConnection(token, true);
  });

  ipcMain.handle("plc:connect", async (event, ipAddress: unknown) => {
    assertTrustedRequest(event.sender);
    return connect(ipAddress);
  });

  ipcMain.handle("plc:disconnect", (event) => {
    assertTrustedRequest(event.sender);
    return disconnect();
  });

  ipcMain.handle("plc:get-status", (event) => {
    assertTrustedRequest(event.sender);
    return connectionStatus;
  });

  ipcMain.handle("plc:read-overview-values", async (event) => {
    assertTrustedRequest(event.sender);
    if (!activeClient || activeClient.connectionState !== "online" || connectionStatus.state !== "online") {
      throw new Error("Cannot read overview values while the PLC is offline");
    }

    return readPlcOverviewValues(activeClient);
  });

  ipcMain.handle("plc:read-adjustments", async (event) => {
    assertTrustedRequest(event.sender);
    if (!activeClient || activeClient.connectionState !== "online" || connectionStatus.state !== "online") {
      throw new Error("Cannot read adjustments while the PLC is offline");
    }

    return readPlcAdjustments(activeClient);
  });

  ipcMain.handle("plc:write-adjustments", async (event, values: unknown) => {
    assertTrustedRequest(event.sender);
    if (!activeClient || activeClient.connectionState !== "online" || connectionStatus.state !== "online") {
      throw new Error("Cannot write adjustments while the PLC is offline");
    }

    return writePlcAdjustments(activeClient, values);
  });

  ipcMain.handle("plc:set-move-up", async (event, enabled: unknown) => {
    assertTrustedRequest(event.sender);
    if (typeof enabled !== "boolean") throw new Error("Invalid Move Up command value");
    if (!activeClient || activeClient.connectionState !== "online" || connectionStatus.state !== "online") {
      throw new Error("Cannot control Move Up while the PLC is offline");
    }

    return setMoveUp(activeClient, enabled);
  });

  ipcMain.handle("plc:set-move-down", async (event, enabled: unknown) => {
    assertTrustedRequest(event.sender);
    if (typeof enabled !== "boolean") throw new Error("Invalid Move Down command value");
    if (!activeClient || activeClient.connectionState !== "online" || connectionStatus.state !== "online") {
      throw new Error("Cannot control Move Down while the PLC is offline");
    }

    return setMoveDown(activeClient, enabled);
  });

  ipcMain.handle("plc:reset-load", async (event) => {
    assertTrustedRequest(event.sender);
    if (!activeClient || activeClient.connectionState !== "online" || connectionStatus.state !== "online") {
      throw new Error("Cannot reset load while the PLC is offline");
    }

    return triggerResetLoad(activeClient);
  });

  ipcMain.handle("plc:reset-stroke", async (event) => {
    assertTrustedRequest(event.sender);
    if (!activeClient || activeClient.connectionState !== "online" || connectionStatus.state !== "online") {
      throw new Error("Cannot reset stroke while the PLC is offline");
    }

    return triggerResetStroke(activeClient);
  });

  isRegistered = true;
}

export function shutdownPlcService(): void {
  stopHealthPolling();
  for (const token of preparedConnections.keys()) {
    clearPreparedConnection(token, true);
  }

  const previousSocket = activeSocket;
  activeSocket = null;
  activeClient = null;
  activeIpAddress = null;
  if (previousSocket) {
    previousSocket.removeAllListeners();
    previousSocket.destroy();
  }

  connectionStatus = { state: "disconnected", ipAddress: null, plcWorking: null };
}
