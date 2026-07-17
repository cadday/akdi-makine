import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PlcTelemetryPayload } from "../../global";

// Define what data the context will provide to components
interface PlcContextType {
  telemetry: PlcTelemetryPayload;
  connectionStatus: { text: string; isError: boolean };
}

const PlcContext = createContext<PlcContextType | undefined>(undefined);

export const PlcProvider = ({ children }: { children: ReactNode }) => {
  const [telemetry, setTelemetry] = useState<PlcTelemetryPayload>({
    timestamp: "--:--:--",
    d10Value: 0,
    d20Value: 0,
    m1Status: false,
    m2Status: false,
  });

  const [connectionStatus, setConnectionStatus] = useState({
    text: "Connecting...",
    isError: false,
  });

  useEffect(() => {
    // 1. Establish the SINGLE active stream listener for the entire app
    window.plcAPI.onLiveData((data: PlcTelemetryPayload) => {
      setTelemetry(data);
      setConnectionStatus({ text: `Online • Synced: ${data.timestamp}`, isError: false });
    });

    window.plcAPI.onStatusError((errUpdate) => {
      setConnectionStatus({ text: errUpdate.error, isError: true });
    });

    // 2. Clean up when the entire app closes
    return () => {
      window.plcAPI.removeListeners();
    };
  }, []);

  return <PlcContext.Provider value={{ telemetry, connectionStatus }}>{children}</PlcContext.Provider>;
};

// Custom hook so components can easily grab the live data
export const usePlcData = () => {
  const context = useContext(PlcContext);
  if (!context) {
    throw new Error("usePlcData must be used within a PlcProvider");
  }
  return context;
};
