/* eslint-disable react-refresh/only-export-components */
import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from "react";

interface ActiveTestRun {
  testId: string;
  stop: () => void;
}

interface TestRunContextValue {
  hasActiveTest: boolean;
  registerTestRun: (testId: string, stop: () => void) => void;
  unregisterTestRun: (testId: string) => void;
  stopActiveTest: () => void;
}

const TestRunContext = createContext<TestRunContextValue | null>(null);

export function TestRunProvider({ children }: PropsWithChildren) {
  const activeRunRef = useRef<ActiveTestRun | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  const registerTestRun = useCallback((testId: string, stop: () => void) => {
    activeRunRef.current = { testId, stop };
    setActiveTestId(testId);
  }, []);

  const unregisterTestRun = useCallback((testId: string) => {
    if (activeRunRef.current?.testId !== testId) return;
    activeRunRef.current = null;
    setActiveTestId(null);
  }, []);

  const stopActiveTest = useCallback(() => {
    activeRunRef.current?.stop();
  }, []);

  const value = useMemo(
    () => ({ hasActiveTest: activeTestId !== null, registerTestRun, unregisterTestRun, stopActiveTest }),
    [activeTestId, registerTestRun, stopActiveTest, unregisterTestRun],
  );

  return <TestRunContext.Provider value={value}>{children}</TestRunContext.Provider>;
}

export function useTestRun() {
  const context = useContext(TestRunContext);
  if (!context) throw new Error("useTestRun must be used within a TestRunProvider");
  return context;
}