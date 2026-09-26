import { useCallback, useEffect, useRef, useState } from "react";
import { useDb, type TestGraphPoint, type TestResults } from "@/context/db-context";

const RUN_DURATION_MS = 3000;
const SAMPLE_INTERVAL_MS = 10;

export type TestRunStatus = "in-progress" | "done" | "error";

interface TestRunState {
  status: TestRunStatus;
  graphData: TestGraphPoint[];
  results: TestResults | null;
  error: string | null;
}

interface UseMockTestRunOptions {
  testId: string;
  savedResults?: TestResults;
  onResultsSaved?: (results: TestResults) => void;
}

function hasCompleteResults(results?: TestResults): results is TestResults & Required<Omit<TestResults, "graphData">> & { graphData: TestGraphPoint[] } {
  return Boolean(
    results &&
      Array.isArray(results.graphData) &&
    results.graphData.length > 0 &&
    results.graphData.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)) &&
    Number.isFinite(results.yieldStrength) &&
    Number.isFinite(results.tensileStrength) &&
    Number.isFinite(results.elongation) &&
    Number.isFinite(results.firstLength) &&
    Number.isFinite(results.lastLength) &&
    Number.isFinite(results.testDuration),
  );
}

function getMockPoint(progress: number): TestGraphPoint {
  const strain = progress * 24;
  const curve: Array<[number, number]> = [
    [0, 0],
    [5, 286],
    [6, 283],
    [15, 390],
    [24, 350],
  ];
  const nextIndex = curve.findIndex(([anchorStrain]) => anchorStrain >= strain);
  if (nextIndex <= 0) return { x: strain, y: curve[0][1] };

  const [startStrain, startStress] = curve[nextIndex - 1];
  const [endStrain, endStress] = curve[nextIndex];
  const segmentProgress = (strain - startStrain) / (endStrain - startStrain);
  const easedProgress = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);

  return {
    x: Number(strain.toFixed(3)),
    y: Number((startStress + (endStress - startStress) * easedProgress).toFixed(2)),
  };
}

function getMockResults(graphData: TestGraphPoint[]): TestResults {
  return {
    yieldStrength: 285,
    tensileStrength: 390,
    elongation: 24,
    firstLength: 100,
    lastLength: 120,
    testDuration: RUN_DURATION_MS / 1000,
    graphData,
  };
}

export default function useMockTestRun({ testId, savedResults, onResultsSaved }: UseMockTestRunOptions) {
  const { updateTestResults } = useDb();
  const [state, setState] = useState<TestRunState>(() => {
    if (hasCompleteResults(savedResults)) {
      return { status: "done", graphData: savedResults.graphData, results: savedResults, error: null };
    }
    return { status: "in-progress", graphData: [getMockPoint(0)], results: null, error: null };
  });
  const pendingResultsRef = useRef<TestResults | null>(null);
  const onResultsSavedRef = useRef(onResultsSaved);
  onResultsSavedRef.current = onResultsSaved;

  const saveResults = useCallback(
    async (results: TestResults) => {
      pendingResultsRef.current = results;
      setState((current) => ({ ...current, status: "in-progress", results, error: null }));
      try {
        const updatedCount = await updateTestResults(testId, results);
        if (updatedCount === 0) throw new Error("Test was not found and results could not be saved.");
        pendingResultsRef.current = null;
        setState({ status: "done", graphData: results.graphData ?? [], results, error: null });
        onResultsSavedRef.current?.(results);
      } catch (error) {
        setState((current) => ({ ...current, status: "error", error: `Failed to save test results: ${String(error)}` }));
      }
    },
    [testId, updateTestResults],
  );

  const retrySave = useCallback(() => {
    if (pendingResultsRef.current) void saveResults(pendingResultsRef.current);
  }, [saveResults]);

  useEffect(() => {
    if (hasCompleteResults(savedResults)) {
      pendingResultsRef.current = null;
      setState({ status: "done", graphData: savedResults.graphData, results: savedResults, error: null });
      return;
    }

    let cancelled = false;
    let graphData = [getMockPoint(0)];
    const startTime = performance.now();
    setState({ status: "in-progress", graphData, results: null, error: null });

    const intervalId = window.setInterval(() => {
      const progress = Math.min((performance.now() - startTime) / RUN_DURATION_MS, 1);
      graphData = [...graphData, getMockPoint(progress)];
      setState((current) => (current.status === "in-progress" ? { ...current, graphData } : current));

      if (progress < 1) return;
      window.clearInterval(intervalId);
      const results = getMockResults(graphData);
      if (!cancelled) void saveResults(results);
    }, SAMPLE_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [savedResults, saveResults, testId]);

  return { ...state, retrySave };
}
