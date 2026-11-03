/* eslint-disable react-refresh/only-export-components */
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getStressStrainPoint } from "@/lib/db";
import { useDb } from "@/context/db-context";
import { isMachineInterlocked, usePlcData } from "@/context/plc-context";
import useAppNotifications from "@/hooks/use-app-notifications";

interface TestRunContextValue {
  hasActiveTest: boolean;
  startTestRun: (request: PlcTestRunRequest) => Promise<void>;
  stopActiveTest: () => Promise<void>;
}

const TestRunContext = createContext<TestRunContextValue | null>(null);

export function TestRunProvider({ children }: PropsWithChildren) {
  const { appendTestSample, getTest, updateTestRunStatus } = useDb();
  const { connectionStatus, interlockStatus } = usePlcData();
  const { showError, showSuccess } = useAppNotifications();
  const { t } = useTranslation();
  const activeTestIdRef = useRef<string | null>(null);
  const updateQueueRef = useRef<Promise<void>>(Promise.resolve());
  const failedPersistenceRef = useRef(new Set<string>());
  const acceptedTestRunIdsRef = useRef(new Set<string>());
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  const persistUpdate = useCallback(
    async (update: PlcTestRunUpdate) => {
      if (failedPersistenceRef.current.has(update.testId)) return;
      if (update.sample) {
        const test = await getTest(update.testId);
        if (!test) throw new Error(t("test-run-record-missing"));
        const point = { load: update.sample.load, displacement: update.sample.displacement };
        const stressStrainPoint = getStressStrainPoint(point, test.specimenSnapshot);
        const status = update.state === "stopping" ? "stopping" : "running";
        const updatedCount = await appendTestSample(
          update.testId,
          point,
          stressStrainPoint,
          update.sample.elapsedMs,
          status,
        );
        if (updatedCount === 0) throw new Error(t("test-run-record-update-error"));
        return;
      }

      const updatedCount = await updateTestRunStatus(update.testId, update.state, update.error);
      if (updatedCount === 0) throw new Error(t("test-run-record-update-error"));
    },
    [appendTestSample, getTest, t, updateTestRunStatus],
  );

  useEffect(
    () =>
      window.plcAPI.onTestRunUpdate((update) => {
        if (update.state === "starting" || update.state === "running" || update.state === "stopping") {
          activeTestIdRef.current = update.testId;
          setActiveTestId(update.testId);
          if (update.state === "running") acceptedTestRunIdsRef.current.add(update.testId);
        } else if (activeTestIdRef.current === update.testId) {
          activeTestIdRef.current = null;
          setActiveTestId(null);
        }

        if (update.state === "completed") {
          acceptedTestRunIdsRef.current.delete(update.testId);
          showSuccess(t("test-run-completed"));
        } else if (update.state === "stopped") {
          acceptedTestRunIdsRef.current.delete(update.testId);
          showSuccess(t("test-run-stopped"));
        } else if (update.state === "failed" && acceptedTestRunIdsRef.current.delete(update.testId)) {
          showError(t("test-run-failed", { error: update.error ?? t("test-run-unknown-error") }));
        }

        updateQueueRef.current = updateQueueRef.current.then(async () => {
          try {
            await persistUpdate(update);
          } catch (error) {
            failedPersistenceRef.current.add(update.testId);
            const message = t("test-run-save-error", { error: String(error) });
            showError(message);
            try {
              await updateTestRunStatus(update.testId, "failed", message);
            } catch (statusError) {
              showError(t("test-run-record-failure-error", { error: String(statusError) }));
            }
            if (update.state === "starting" || update.state === "running" || update.state === "stopping") {
              try {
                await window.plcAPI.stopTestRun(update.testId);
              } catch (stopError) {
                showError(t("test-run-stop-after-save-error", { error: String(stopError) }));
              }
            }
          }
        });
      }),
    [persistUpdate, showError, showSuccess, t, updateTestRunStatus],
  );

  const startTestRun = useCallback(
    async (request: PlcTestRunRequest) => {
      if (activeTestIdRef.current) throw new Error(t("quick-test-already-running"));
      activeTestIdRef.current = request.testId;
      setActiveTestId(request.testId);

      try {
        if (
          isMachineInterlocked(interlockStatus) ||
          (connectionStatus.state === "online" && !interlockStatus)
        ) {
          throw new Error(t("quick-test-interlock-error"));
        }

        const updatedCount = await updateTestRunStatus(request.testId, "starting");
        if (updatedCount === 0) throw new Error(t("test-run-record-missing"));
        await window.plcAPI.startTestRun(request);
        acceptedTestRunIdsRef.current.add(request.testId);
      } catch (error) {
        if (activeTestIdRef.current === request.testId) {
          activeTestIdRef.current = null;
          setActiveTestId(null);
        }
        await updateTestRunStatus(
          request.testId,
          "failed",
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    },
    [connectionStatus.state, interlockStatus, t, updateTestRunStatus],
  );

  const stopActiveTest = useCallback(async () => {
    const testId = activeTestIdRef.current;
    if (!testId) return;
    try {
      await window.plcAPI.stopTestRun(testId);
    } catch (error) {
      showError(t("test-run-stop-error", { error: String(error) }));
    }
  }, [showError, t]);

  const value = useMemo(
    () => ({ hasActiveTest: activeTestId !== null, startTestRun, stopActiveTest }),
    [activeTestId, startTestRun, stopActiveTest],
  );

  return <TestRunContext.Provider value={value}>{children}</TestRunContext.Provider>;
}

export function useTestRun() {
  const context = useContext(TestRunContext);
  if (!context) throw new Error("useTestRun must be used within a TestRunProvider");
  return context;
}