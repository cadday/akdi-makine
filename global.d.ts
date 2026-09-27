export {};

export interface PlcTelemetryPayload {
  timestamp: string;
  d10Value: number; // 16-bit register (Address 4106)
  d20Value: number; // 16-bit register (Address 4116)
  m1Status: boolean; // Digital Coil status (Address 2049)
  m2Status: boolean; // Digital Coil status (Address 2050)
}

export interface PlcStatusPayload {
  error: string;
}

interface PlcAPI {
  sendCoilCommand: (
    address: number,
    value: boolean,
  ) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
  onLiveData: (callback: (data: PlcTelemetryPayload) => void) => void;
  onStatusError: (callback: (status: PlcStatusPayload) => void) => void;
  removeListeners: () => void;
}

interface ElectronAPI {
  saveImage: (input: { name: string; type: string; bytes: Uint8Array }) => Promise<{ id: string; name: string; type: string; size: number }>;
  readImage: (id: string) => Promise<{ bytes: Uint8Array } | null>;
  deleteImage: (id: string) => Promise<void>;
  saveBackupArchive: (bytes: Uint8Array) => Promise<{ canceled: boolean }>;
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
  interface Window {
    plcAPI: PlcAPI;
    electronAPI: ElectronAPI;
  }
}
