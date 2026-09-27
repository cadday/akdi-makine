"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  saveImage: (input) => electron.ipcRenderer.invoke("images:save", input),
  readImage: (id) => electron.ipcRenderer.invoke("images:read", id),
  deleteImage: (id) => electron.ipcRenderer.invoke("images:delete", id),
  saveBackupArchive: (bytes) => electron.ipcRenderer.invoke("backup:save", bytes),
  openBackupArchive: () => electron.ipcRenderer.invoke("backup:open"),
  saveRecordPdf: (request) => electron.ipcRenderer.invoke("pdf:save-record", request),
  saveTestComparisonPdf: (request) => electron.ipcRenderer.invoke("pdf:save-record", { ...request, type: "test-comparison" }),
  onPdfCreating: (callback) => {
    const listener = () => callback();
    electron.ipcRenderer.on("pdf:creating", listener);
    return () => electron.ipcRenderer.removeListener("pdf:creating", listener);
  },
  showPdfInFolder: (filePath) => electron.ipcRenderer.invoke("pdf:show-in-folder", filePath),
  notifyPdfReady: (error) => electron.ipcRenderer.invoke("pdf:ready", error),
  isMaximized: () => electron.ipcRenderer.invoke("window:is-maximized"),
  onMaximizedStateChange: (callback) => {
    const listener = (_event, value) => callback(value);
    electron.ipcRenderer.on("window:maximized-state-changed", listener);
    return () => {
      electron.ipcRenderer.removeListener("window:maximized-state-changed", listener);
    };
  },
  minimize: () => electron.ipcRenderer.invoke("window:minimize"),
  maximize: () => electron.ipcRenderer.invoke("window:maximize"),
  close: () => electron.ipcRenderer.invoke("window:close")
});
electron.contextBridge.exposeInMainWorld("plcAPI", {
  // UI Commands -> Backend Main Process
  sendCoilCommand: (address, value) => electron.ipcRenderer.invoke("write-plc-coil", { address, value }),
  // Backend Stream -> UI Component Listener
  onLiveData: (callback) => electron.ipcRenderer.on("plc-live-data", (_event, data) => callback(data)),
  onStatusError: (callback) => electron.ipcRenderer.on("plc-status", (_event, data) => callback(data)),
  // Cleanup helper to avoid memory leaks when component unmounts
  removeListeners: () => {
    electron.ipcRenderer.removeAllListeners("plc-live-data");
    electron.ipcRenderer.removeAllListeners("plc-status");
  }
});
