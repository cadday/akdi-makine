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

declare global {
  interface Window {
    plcAPI: PlcAPI;
  }
}
