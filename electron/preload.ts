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
  // UI Commands -> Backend Main Process
  sendCoilCommand: (address, value) => ipcRenderer.invoke("write-plc-coil", { address, value }),

  // Backend Stream -> UI Component Listener
  onLiveData: (callback) => ipcRenderer.on("plc-live-data", (_event, data) => callback(data)),
  onStatusError: (callback) => ipcRenderer.on("plc-status", (_event, data) => callback(data)),

  // Cleanup helper to avoid memory leaks when component unmounts
  removeListeners: () => {
    ipcRenderer.removeAllListeners("plc-live-data");
    ipcRenderer.removeAllListeners("plc-status");
  },
});
