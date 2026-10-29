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
  prepareConnection: (ipAddress) => electron.ipcRenderer.invoke("plc:prepare-connection", ipAddress),
  activateConnection: (token) => electron.ipcRenderer.invoke("plc:activate-connection", token),
  cancelConnection: (token) => electron.ipcRenderer.invoke("plc:cancel-connection", token),
  connect: (ipAddress) => electron.ipcRenderer.invoke("plc:connect", ipAddress),
  disconnect: () => electron.ipcRenderer.invoke("plc:disconnect"),
  getStatus: () => electron.ipcRenderer.invoke("plc:get-status"),
  onStatusChange: (callback) => {
    const listener = (_event, status) => callback(status);
    electron.ipcRenderer.on("plc:status", listener);
    return () => {
      electron.ipcRenderer.removeListener("plc:status", listener);
    };
  }
});
