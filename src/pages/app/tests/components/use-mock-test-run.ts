import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDb, type TestGraphPoint, type TestResults } from "@/context/db-context";

const SAMPLE_INTERVAL_MS = 20;

export type TestRunStatus = "in-progress" | "done" | "error";

interface TestRunState {
  status: TestRunStatus;
  progress: number;
  graphData: TestGraphPoint[];
  results: TestResults | null;
  error: string | null;
}

interface UseMockTestRunOptions {
  testId: string;
  duration: number;
  savedResults?: TestResults;
  onResultsSaved?: (results: TestResults) => void;
  readOnly?: boolean;
}

interface MockCurve {
  anchors: Array<[number, number]>;
  yieldStrength: number;
  tensileStrength: number;
  elongation: number;
  firstLength: number;
  lastLength: number;
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

function createMockCurve(testId: string): MockCurve {
  let seed = 2166136261;
  for (let index = 0; index < testId.length; index += 1) {
    seed = Math.imul(seed ^ testId.charCodeAt(index), 16777619);
  }

  const random = () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const between = (minimum: number, maximum: number) => minimum + random() * (maximum - minimum);

  const elongation = between(20, 30);
  const yieldStrain = between(4, 6);
  const yieldStrength = between(255, 325);
  const tensileStrength = yieldStrength + between(45, 105);
  const tensileStrain = yieldStrain + (elongation - yieldStrain) * between(0.55, 0.72);
  const firstLength = between(90, 110);
  const postYieldStrain = yieldStrain + between(0.5, 1.2);

  return {
    anchors: [
      [0, 0],
      [yieldStrain, yieldStrength],
      [postYieldStrain, yieldStrength - between(2, 14)],
      [tensileStrain, tensileStrength],
      [elongation, tensileStrength * between(0.82, 0.94)],
    ],
    yieldStrength,
    tensileStrength,
    elongation,
    firstLength,
    lastLength: firstLength * (1 + elongation / 100),
  };
}

function getMockPoint(progress: number, curve: MockCurve): TestGraphPoint {
  const strain = progress * curve.elongation;
  const nextIndex = curve.anchors.findIndex(([anchorStrain]) => anchorStrain >= strain);
  if (nextIndex <= 0) return { x: strain, y: curve.anchors[0][1] };

  const [startStrain, startStress] = curve.anchors[nextIndex - 1];
  const [endStrain, endStress] = curve.anchors[nextIndex];
  const segmentProgress = (strain - startStrain) / (endStrain - startStrain);
  const easedProgress = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);

  return {
    x: Number(strain.toFixed(3)),
    y: Number((startStress + (endStress - startStress) * easedProgress).toFixed(2)),
  };
}

function getMockResults(graphData: TestGraphPoint[], duration: number, curve: MockCurve): TestResults {
  return {
    yieldStrength: Number(curve.yieldStrength.toFixed(2)),
    tensileStrength: Number(curve.tensileStrength.toFixed(2)),
    elongation: Number(curve.elongation.toFixed(2)),
    firstLength: Number(curve.firstLength.toFixed(2)),
    lastLength: Number(curve.lastLength.toFixed(2)),
    testDuration: duration,
    graphData,
  };
}

export default function useMockTestRun({ testId, duration, savedResults, onResultsSaved, readOnly = false }: UseMockTestRunOptions) {
  const { updateTestResults } = useDb();
  const curve = useMemo(() => createMockCurve(testId), [testId]);
  const [state, setState] = useState<TestRunState>(() => {
    if (readOnly) return { status: "done", progress: 1, graphData: savedResults?.graphData ?? [], results: savedResults ?? null, error: null };
    if (hasCompleteResults(savedResults)) {
      return { status: "done", progress: 1, graphData: savedResults.graphData, results: savedResults, error: null };
    }
    return { status: "in-progress", progress: 0, graphData: [getMockPoint(0, curve)], results: null, error: null };
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
        setState({ status: "done", progress: 1, graphData: results.graphData ?? [], results, error: null });
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
    if (readOnly) {
      setState({ status: "done", progress: 1, graphData: savedResults?.graphData ?? [], results: savedResults ?? null, error: null });
      return;
    }
    if (hasCompleteResults(savedResults)) {
      pendingResultsRef.current = null;
      setState({ status: "done", progress: 1, graphData: savedResults.graphData, results: savedResults, error: null });
      return;
    }

    let cancelled = false;
    let graphData = [getMockPoint(0, curve)];
    const startTime = performance.now();
    setState({ status: "in-progress", progress: 0, graphData, results: null, error: null });

    const intervalId = window.setInterval(() => {
      const progress = duration <= 0 ? 1 : Math.min((performance.now() - startTime) / (duration * 1000), 1);
      graphData = [...graphData, getMockPoint(progress, curve)];
      setState((current) => (current.status === "in-progress" ? { ...current, progress, graphData } : current));

      if (progress < 1) return;
      window.clearInterval(intervalId);
      const results = getMockResults(graphData, duration, curve);
      if (!cancelled) void saveResults(results);
    }, SAMPLE_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [curve, duration, readOnly, savedResults, saveResults, testId]);

  return { ...state, retrySave };
}
