import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  saveImage: (input: { name: string; type: string; bytes: Uint8Array }) => ipcRenderer.invoke("images:save", input),
  readImage: (id: string) => ipcRenderer.invoke("images:read", id) as Promise<{ bytes: Uint8Array } | null>,
  deleteImage: (id: string) => ipcRenderer.invoke("images:delete", id) as Promise<void>,
  saveBackupArchive: (bytes: Uint8Array) => ipcRenderer.invoke("backup:save", bytes) as Promise<{ canceled: true } | { canceled: false; filePath: string }>,
  openBackupArchive: () => ipcRenderer.invoke("backup:open") as Promise<{ canceled: true } | { canceled: false; bytes: Uint8Array }>,
  saveRecordPdf: (request: { type: "test" | "specimen" | "preset" | "data-field"; id: string; name: string }) =>
    ipcRenderer.invoke("pdf:save-record", request) as Promise<{ canceled: boolean; filePath?: string }>,
  saveTestComparisonPdf: (request: { testIds: string[]; name: string }) =>
    ipcRenderer.invoke("pdf:save-record", { ...request, type: "test-comparison" }) as Promise<{ canceled: boolean; filePath?: string }>,
  onPdfCreating: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on("pdf:creating", listener);
    return () => ipcRenderer.removeListener("pdf:creating", listener);
  },
  showPdfInFolder: (filePath: string) => ipcRenderer.invoke("pdf:show-in-folder", filePath) as Promise<void>,
  notifyPdfReady: (error?: string) => ipcRenderer.invoke("pdf:ready", error) as Promise<boolean>,
  isMaximized: () => ipcRenderer.invoke("window:is-maximized"),
  onMaximizedStateChange: (callback: (isMaximized: boolean) => void) => {
    const listener = (_event: any, value: boolean) => callback(value);
    ipcRenderer.on("window:maximized-state-changed", listener);

    return () => {
      ipcRenderer.removeListener("window:maximized-state-changed", listener);
    };
  },
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
});

contextBridge.exposeInMainWorld("plcAPI", {
  prepareConnection: (ipAddress: string) => ipcRenderer.invoke("plc:prepare-connection", ipAddress) as Promise<{ token: string; ipAddress: string }>,
  activateConnection: (token: string) => ipcRenderer.invoke("plc:activate-connection", token) as Promise<PlcConnectionStatus>,
  cancelConnection: (token: string) => ipcRenderer.invoke("plc:cancel-connection", token) as Promise<void>,
  connect: (ipAddress: string) => ipcRenderer.invoke("plc:connect", ipAddress) as Promise<PlcConnectionStatus>,
  disconnect: () => ipcRenderer.invoke("plc:disconnect") as Promise<PlcConnectionStatus>,
  setMoveUp: (enabled: boolean) => ipcRenderer.invoke("plc:set-move-up", enabled) as Promise<void>,
  setMoveDown: (enabled: boolean) => ipcRenderer.invoke("plc:set-move-down", enabled) as Promise<void>,
  resetLoad: () => ipcRenderer.invoke("plc:reset-load") as Promise<void>,
  resetStroke: () => ipcRenderer.invoke("plc:reset-stroke") as Promise<void>,
  readOverviewValues: () => ipcRenderer.invoke("plc:read-overview-values") as Promise<PlcOverviewValues>,
  readLimits: () => ipcRenderer.invoke("plc:read-limits") as Promise<PlcLimitsValues>,
  writeLimits: (values: PlcLimitsValues) => ipcRenderer.invoke("plc:write-limits", values) as Promise<void>,
  readAdjustments: () => ipcRenderer.invoke("plc:read-adjustments") as Promise<PlcAdjustmentValues>,
  writeAdjustments: (values: PlcAdjustmentValues) =>
    ipcRenderer.invoke("plc:write-adjustments", values) as Promise<void>,
  getStatus: () => ipcRenderer.invoke("plc:get-status") as Promise<PlcConnectionStatus>,
  onStatusChange: (callback: (status: PlcConnectionStatus) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, status: PlcConnectionStatus) => callback(status);
    ipcRenderer.on("plc:status", listener);

    return () => {
      ipcRenderer.removeListener("plc:status", listener);
    };
  },
});
