/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useDb } from "@/context/db-context";

export interface PlcInterlockStatus {
  emergencyHaltActive: boolean;
  machineHalted: boolean;
}

interface StoredPlcInterlockStatus extends PlcInterlockStatus {
  ipAddress: string;
}

interface PlcContextType {
  connectionStatus: PlcConnectionStatus;
  interlockStatus: PlcInterlockStatus | null;
  updateInterlockStatus: (ipAddress: string, status: PlcInterlockStatus | null) => void;
}

const PlcContext = createContext<PlcContextType | undefined>(undefined);

export const PlcProvider = ({ children }: { children: ReactNode }) => {
  const { getConnectedMachine, setConnectedMachine } = useDb();
  const [connectionStatus, setConnectionStatus] = useState<PlcConnectionStatus>({ state: "disconnected", ipAddress: null });
  const [storedInterlockStatus, setStoredInterlockStatus] = useState<StoredPlcInterlockStatus | null>(null);

  const updateInterlockStatus = useCallback((ipAddress: string, status: PlcInterlockStatus | null) => {
    setStoredInterlockStatus((current) => {
      if (!status) return current?.ipAddress === ipAddress ? null : current;
      if (
        current?.ipAddress === ipAddress &&
        current.emergencyHaltActive === status.emergencyHaltActive &&
        current.machineHalted === status.machineHalted
      ) {
        return current;
      }

      return { ipAddress, ...status };
    });
  }, []);

  const interlockStatus =
    connectionStatus.state === "online" && storedInterlockStatus?.ipAddress === connectionStatus.ipAddress
      ? storedInterlockStatus
      : null;

  useEffect(() => {
    if (connectionStatus.state !== "online") {
      setStoredInterlockStatus(null);
    }
  }, [connectionStatus.state]);

  useEffect(() => {
    let cancelled = false;
    const updateStatus = async (status: PlcConnectionStatus) => {
      if (cancelled) return;

      if (status.clearSelection && status.ipAddress) {
        try {
          const selectedMachine = await getConnectedMachine();
          if (!cancelled && selectedMachine?.ipAddress === status.ipAddress) {
            await setConnectedMachine(null);
          }
        } catch (error) {
          console.error("Failed to clear the selected machine after PLC communication was lost:", error);
          if (!cancelled) {
            setConnectionStatus({ ...status, error: `Failed to clear the disconnected machine selection: ${String(error)}` });
          }
          return;
        }
      }

      if (!cancelled) setConnectionStatus(status);
    };
    const unsubscribe = window.plcAPI.onStatusChange((status) => {
      void updateStatus(status);
    });

    const initializeConnection = async () => {
      try {
        const status = await window.plcAPI.getStatus();
        if (cancelled) return;
        await updateStatus(status);
      } catch (error) {
        if (!cancelled) {
          setConnectionStatus({ state: "offline", ipAddress: null, error: `Failed to read PLC connection status: ${String(error)}` });
        }
        return;
      }

      let machine;
      try {
        machine = await getConnectedMachine();
      } catch (error) {
        if (!cancelled) {
          setConnectionStatus({ state: "offline", ipAddress: null, error: `Failed to load the selected machine: ${String(error)}` });
        }
        return;
      }

      if (cancelled) return;
      try {
        if (machine) await window.plcAPI.connect(machine.ipAddress);
        else await window.plcAPI.disconnect();
      } catch (error) {
        if (!cancelled) {
          setConnectionStatus({
            state: "offline",
            ipAddress: machine?.ipAddress ?? null,
            error: `Failed to connect to the selected machine: ${String(error)}`,
          });
        }
      }
    };

    void initializeConnection();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [getConnectedMachine, setConnectedMachine]);

  const contextValue = useMemo(
    () => ({ connectionStatus, interlockStatus, updateInterlockStatus }),
    [connectionStatus, interlockStatus, updateInterlockStatus],
  );

  return <PlcContext.Provider value={contextValue}>{children}</PlcContext.Provider>;
};

export const usePlcData = () => {
  const context = useContext(PlcContext);
  if (!context) {
    throw new Error("usePlcData must be used within a PlcProvider");
  }
  return context;
};

export function isMachineInterlocked(status: PlcInterlockStatus | null): boolean {
  return status?.emergencyHaltActive === true || status?.machineHalted === true;
}
