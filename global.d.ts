export {};

interface PlcAPI {
  prepareConnection: (ipAddress: string) => Promise<{ token: string; ipAddress: string }>;
  activateConnection: (token: string) => Promise<PlcConnectionStatus>;
  cancelConnection: (token: string) => Promise<void>;
  connect: (ipAddress: string) => Promise<PlcConnectionStatus>;
  disconnect: () => Promise<PlcConnectionStatus>;
  setMoveUp: (enabled: boolean) => Promise<void>;
  setMoveDown: (enabled: boolean) => Promise<void>;
  resetLoad: () => Promise<void>;
  resetStroke: () => Promise<void>;
  getStatus: () => Promise<PlcConnectionStatus>;
  onStatusChange: (callback: (status: PlcConnectionStatus) => void) => () => void;
}

interface ElectronAPI {
  saveImage: (input: { name: string; type: string; bytes: Uint8Array }) => Promise<{ id: string; name: string; type: string; size: number }>;
  readImage: (id: string) => Promise<{ bytes: Uint8Array } | null>;
  deleteImage: (id: string) => Promise<void>;
  saveBackupArchive: (bytes: Uint8Array) => Promise<{ canceled: true } | { canceled: false; filePath: string }>;
  openBackupArchive: () => Promise<{ canceled: true } | { canceled: false; bytes: Uint8Array }>;
  saveRecordPdf: (request: { type: "test" | "specimen" | "preset" | "data-field"; id: string; name: string }) => Promise<{ canceled: boolean; filePath?: string }>;
  saveTestComparisonPdf: (request: { testIds: string[]; name: string }) => Promise<{ canceled: boolean; filePath?: string }>;
  onPdfCreating: (callback: () => void) => () => void;
  showPdfInFolder: (filePath: string) => Promise<void>;
  notifyPdfReady: (error?: string) => Promise<boolean>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  onMaximizedStateChange: (callback: (isMaximized: boolean) => void) => void;
}

declare global {
  interface PlcConnectionStatus {
    state: "disconnected" | "connecting" | "online" | "offline";
    ipAddress: string | null;
    plcWorking?: boolean | null;
    clearSelection?: boolean;
    error?: string;
  }

  interface Window {
    plcAPI: PlcAPI;
    electronAPI: ElectronAPI;
  }
}
