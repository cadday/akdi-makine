export {};

interface PlcAPI {
  prepareConnection: (ipAddress: string) => Promise<{ token: string; ipAddress: string }>;
  activateConnection: (token: string) => Promise<PlcConnectionStatus>;
  cancelConnection: (token: string) => Promise<void>;
  connect: (ipAddress: string) => Promise<PlcConnectionStatus>;
  disconnect: () => Promise<PlcConnectionStatus>;
  setMoveUp: (enabled: boolean) => Promise<void>;
  setMoveDown: (enabled: boolean) => Promise<void>;
  haltMachine: () => Promise<void>;
  resumeMachine: () => Promise<void>;
  resetLoad: () => Promise<void>;
  resetStroke: () => Promise<void>;
  readOverviewValues: () => Promise<PlcOverviewValues>;
  readLimits: () => Promise<PlcLimitsValues>;
  writeLimits: (values: PlcLimitsValues) => Promise<void>;
  readAdjustments: () => Promise<PlcAdjustmentValues>;
  writeAdjustments: (values: PlcAdjustmentValues) => Promise<void>;
  startTestRun: (request: PlcTestRunRequest) => Promise<void>;
  stopTestRun: (testId: string) => Promise<void>;
  onTestRunUpdate: (callback: (update: PlcTestRunUpdate) => void) => () => void;
  getStatus: () => Promise<PlcConnectionStatus>;
  onStatusChange: (callback: (status: PlcConnectionStatus) => void) => () => void;
}

interface ElectronAPI {
  saveImage: (input: { name: string; type: string; bytes: Uint8Array }) => Promise<{ id: string; name: string; type: string; size: number }>;
  readImage: (id: string) => Promise<{ bytes: Uint8Array } | null>;
  deleteImage: (id: string) => Promise<void>;
  saveBackupArchive: (bytes: Uint8Array, labels: NativeDialogLabels) => Promise<{ canceled: true } | { canceled: false; filePath: string }>;
  openBackupArchive: (labels: NativeDialogLabels) => Promise<{ canceled: true } | { canceled: false; bytes: Uint8Array }>;
  saveRecordPdf: (request: { type: "test" | "specimen" | "preset" | "data-field"; id: string; name: string; dialogLabels: NativeDialogLabels }) => Promise<{ canceled: boolean; filePath?: string }>;
  saveTestComparisonPdf: (request: { testIds: string[]; name: string; dialogLabels: NativeDialogLabels }) => Promise<{ canceled: boolean; filePath?: string }>;
  onPdfCreating: (callback: () => void) => () => void;
  showPdfInFolder: (filePath: string) => Promise<void>;
  notifyPdfReady: (error?: string) => Promise<boolean>;
  setUpdaterMessages: (messages: UpdaterDialogMessages) => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  onMaximizedStateChange: (callback: (isMaximized: boolean) => void) => void;
}

declare global {
  type AppLocale = "en" | "tr";

  interface NativeDialogLabels {
    title: string;
    filterName: string;
  }

  interface UpdaterDialogMessages {
    locale: AppLocale;
    title: string;
    messageTemplate: string;
    restartButton: string;
    laterButton: string;
  }

  type PlcConnectionErrorCode = "clear-disconnected-selection" | "read-status" | "load-selected-machine" | "connect-selected-machine";

  type PlcTestRunState = "starting" | "running" | "stopping" | "completed" | "stopped" | "failed";

  interface PlcTestRunPreset {
    type: "Tensile" | "Compression";
    method: "Load" | "Distance";
    velocity: number;
    preload?: number;
    targets: number[];
  }

  interface PlcTestRunRequest {
    testId: string;
    preset: PlcTestRunPreset;
  }

  interface PlcTestRunSample {
    elapsedMs: number;
    load: number;
    displacement: number;
  }

  interface PlcTestRunUpdate {
    testId: string;
    state: PlcTestRunState;
    sample?: PlcTestRunSample;
    error?: string;
  }

  interface PlcConnectionStatus {
    state: "disconnected" | "connecting" | "online" | "offline";
    ipAddress: string | null;
    plcWorking?: boolean | null;
    demoMode?: boolean;
    clearSelection?: boolean;
    error?: string;
    errorCode?: PlcConnectionErrorCode;
  }

  interface PlcOverviewValues {
    load: number;
    distance: number;
    status: number;
    emergencyHaltActive: boolean;
    machineHalted: boolean;
  }

  interface PlcAdjustmentValues {
    manualVelocity: number;
    topDistanceLimit: number;
    bottomDistanceLimit: number;
    topLoadLimit: number;
    bottomLoadLimit: number;
  }

  interface PlcLimitsValues {
    testDistanceLimit: number;
    testLoadLimit: number;
  }

  interface Window {
    plcAPI: PlcAPI;
    electronAPI: ElectronAPI;
    createSampleTest?: (options?: { specimenId?: string; presetId?: string }) => Promise<string>;
    createSampleSpecimen?: () => Promise<string>;
    createSamplePreset?: () => Promise<string>;
    createSampleDataField?: () => Promise<string>;
  }
}
