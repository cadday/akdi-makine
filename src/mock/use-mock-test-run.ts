import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDb, type LoadDisplacementPoint, type StressStrainPoint, type TestResults, type TestSpecimenSnapshot } from "@/context/db-context";
import { getTestGraphType } from "@/lib/db";

const SAMPLE_INTERVAL_MS = 20;

export type TestRunStatus = "in-progress" | "done" | "error";

interface TestRunState {
  status: TestRunStatus;
  progress: number;
  loadDisplacementData: LoadDisplacementPoint[];
  stressStrainData: StressStrainPoint[];
  results: TestResults | null;
  error: string | null;
}

interface UseMockTestRunOptions {
  testId: string;
  duration: number;
  specimen: TestSpecimenSnapshot;
  savedResults?: TestResults;
  onResultsSaved?: (results: TestResults) => void;
  readOnly?: boolean;
}

interface MockCurve {
  anchors: Array<[number, number]>;
  yieldStrain: number;
  tensileStrain: number;
  yieldStrength: number;
  tensileStrength: number;
  elongation: number;
  firstLength: number;
  lastLength: number;
}

function hasFinalizedResults(results: TestResults | undefined, geometry: TestSpecimenSnapshot["geometry"]): results is TestResults & { loadDisplacementData: LoadDisplacementPoint[] } {
  return Boolean(
    results &&
      Array.isArray(results.loadDisplacementData) &&
      results.loadDisplacementData.length > 0 &&
      results.loadDisplacementData.every((point) => Number.isFinite(point.displacement) && Number.isFinite(point.load)) &&
      (getTestGraphType(geometry) !== "stress-strain" ||
        (Array.isArray(results.stressStrainData) &&
          results.stressStrainData.length === results.loadDisplacementData.length &&
          results.stressStrainData.every((point) => Number.isFinite(point.strain) && Number.isFinite(point.stress)))) &&
      (results.finalized === true ||
        (Number.isFinite(results.yieldStrength) &&
          Number.isFinite(results.tensileStrength) &&
          Number.isFinite(results.elongation) &&
          Number.isFinite(results.firstLength) &&
          Number.isFinite(results.lastLength) &&
          Number.isFinite(results.testDuration))),
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
    yieldStrain,
    tensileStrain,
    yieldStrength,
    tensileStrength,
    elongation,
    firstLength,
    lastLength: firstLength * (1 + elongation / 100),
  };
}

function getMockStressStrainPoint(progress: number, curve: MockCurve): StressStrainPoint {
  const strain = progress * curve.elongation;
  const nextIndex = curve.anchors.findIndex(([anchorStrain]) => anchorStrain >= strain);
  if (nextIndex <= 0) return { strain, stress: curve.anchors[0][1] };

  const [startStrain, startStress] = curve.anchors[nextIndex - 1];
  const [endStrain, endStress] = curve.anchors[nextIndex];
  const segmentProgress = (strain - startStrain) / (endStrain - startStrain);
  const easedProgress = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);

  return {
    strain: Number(strain.toFixed(3)),
    stress: Number((startStress + (endStress - startStress) * easedProgress).toFixed(2)),
  };
}

function getMockLoadDisplacementPoint(stressStrainPoint: StressStrainPoint, curve: MockCurve, specimen: TestSpecimenSnapshot): LoadDisplacementPoint {
  const referenceHeight = specimen.height ?? curve.firstLength;
  const crossSectionArea =
    specimen.geometry === "Cylindrical" && specimen.diameter != null
      ? (Math.PI * specimen.diameter ** 2) / 4
      : specimen.geometry === "Rectangular" && specimen.side1 != null && specimen.side2 != null
        ? specimen.side1 * specimen.side2
        : 100;

  return {
    displacement: Number(((stressStrainPoint.strain / 100) * referenceHeight).toFixed(3)),
    load: Number((stressStrainPoint.stress * crossSectionArea).toFixed(2)),
  };
}

function getStressStrainPoint(point: LoadDisplacementPoint, specimen: TestSpecimenSnapshot): StressStrainPoint {
  const crossSectionArea =
    specimen.geometry === "Cylindrical" && specimen.diameter != null
      ? (Math.PI * specimen.diameter ** 2) / 4
      : specimen.geometry === "Rectangular" && specimen.side1 != null && specimen.side2 != null
        ? specimen.side1 * specimen.side2
        : 0;

  return {
    strain: Number(((point.displacement / (specimen.height ?? 1)) * 100).toFixed(3)),
    stress: crossSectionArea > 0 ? Number((point.load / crossSectionArea).toFixed(2)) : 0,
  };
}

function getMockResults(
  loadDisplacementData: LoadDisplacementPoint[],
  stressStrainData: StressStrainPoint[],
  duration: number,
  curve: MockCurve,
): TestResults {
  return {
    finalized: true,
    yieldStrength: Number(curve.yieldStrength.toFixed(2)),
    tensileStrength: Number(curve.tensileStrength.toFixed(2)),
    elongation: Number(curve.elongation.toFixed(2)),
    firstLength: Number(curve.firstLength.toFixed(2)),
    lastLength: Number(curve.lastLength.toFixed(2)),
    testDuration: duration,
    loadDisplacementData,
    stressStrainData,
  };
}

function getPartialMockResults(
  loadDisplacementData: LoadDisplacementPoint[],
  stressStrainData: StressStrainPoint[],
): TestResults {
  return {
    finalized: true,
    yieldStrength: null,
    tensileStrength: null,
    elongation: null,
    firstLength: null,
    lastLength: null,
    testDuration: null,
    loadDisplacementData,
    stressStrainData,
  };
}

export default function useMockTestRun({ testId, duration, specimen, savedResults, onResultsSaved, readOnly = false }: UseMockTestRunOptions) {
  const { updateTestResults } = useDb();
  const curve = useMemo(() => createMockCurve(testId), [testId]);
  const [state, setState] = useState<TestRunState>(() => {
    if (readOnly) return { status: "done", progress: 1, loadDisplacementData: savedResults?.loadDisplacementData ?? [], stressStrainData: savedResults?.stressStrainData ?? [], results: savedResults ?? null, error: null };
    if (hasFinalizedResults(savedResults, specimen.geometry)) {
      return { status: "done", progress: 1, loadDisplacementData: savedResults.loadDisplacementData, stressStrainData: savedResults.stressStrainData ?? [], results: savedResults, error: null };
    }
    const initialStressStrainPoint = getMockStressStrainPoint(0, curve);
    const initialLoadDisplacementPoint = getMockLoadDisplacementPoint(initialStressStrainPoint, curve, specimen);
    const initialStressStrainData = getTestGraphType(specimen.geometry) === "stress-strain" ? [getStressStrainPoint(initialLoadDisplacementPoint, specimen)] : [];
    return {
      status: "in-progress",
      progress: 0,
      loadDisplacementData: [initialLoadDisplacementPoint],
      stressStrainData: initialStressStrainData,
      results: null,
      error: null,
    };
  });
  const pendingResultsRef = useRef<TestResults | null>(null);
  const intervalRef = useRef<number | null>(null);
  const loadDisplacementDataRef = useRef<LoadDisplacementPoint[]>([]);
  const stressStrainDataRef = useRef<StressStrainPoint[]>([]);
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
        setState({
          status: "done",
          progress: 1,
          loadDisplacementData: results.loadDisplacementData ?? [],
          stressStrainData: results.stressStrainData ?? [],
          results,
          error: null,
        });
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

  const stopTest = useCallback(() => {
    if (intervalRef.current === null) return;
    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    void saveResults(getPartialMockResults(loadDisplacementDataRef.current, stressStrainDataRef.current));
  }, [saveResults]);

  useEffect(() => {
    if (readOnly) {
      setState({ status: "done", progress: 1, loadDisplacementData: savedResults?.loadDisplacementData ?? [], stressStrainData: savedResults?.stressStrainData ?? [], results: savedResults ?? null, error: null });
      return;
    }
    if (hasFinalizedResults(savedResults, specimen.geometry)) {
      pendingResultsRef.current = null;
      setState({ status: "done", progress: 1, loadDisplacementData: savedResults.loadDisplacementData, stressStrainData: savedResults.stressStrainData ?? [], results: savedResults, error: null });
      return;
    }

    let cancelled = false;
    const initialStressStrainPoint = getMockStressStrainPoint(0, curve);
    let loadDisplacementData: LoadDisplacementPoint[] = [getMockLoadDisplacementPoint(initialStressStrainPoint, curve, specimen)];
    let stressStrainData: StressStrainPoint[] =
      getTestGraphType(specimen.geometry) === "stress-strain" ? [getStressStrainPoint(loadDisplacementData[0], specimen)] : [];
    const startTime = performance.now();
    loadDisplacementDataRef.current = loadDisplacementData;
    stressStrainDataRef.current = stressStrainData;
    setState({ status: "in-progress", progress: 0, loadDisplacementData, stressStrainData, results: null, error: null });

    intervalRef.current = window.setInterval(() => {
      const progress = duration <= 0 ? 1 : Math.min((performance.now() - startTime) / (duration * 1000), 1);
      const stressStrainPoint = getMockStressStrainPoint(progress, curve);
      const loadDisplacementPoint = getMockLoadDisplacementPoint(stressStrainPoint, curve, specimen);
      loadDisplacementData = [...loadDisplacementData, loadDisplacementPoint];
      if (getTestGraphType(specimen.geometry) === "stress-strain") {
        stressStrainData = [...stressStrainData, getStressStrainPoint(loadDisplacementPoint, specimen)];
      }
      loadDisplacementDataRef.current = loadDisplacementData;
      stressStrainDataRef.current = stressStrainData;
      setState((current) => (current.status === "in-progress" ? { ...current, progress, loadDisplacementData, stressStrainData } : current));

      if (progress < 1) return;
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      const results = getMockResults(loadDisplacementData, stressStrainData, duration, curve);
      if (!cancelled) void saveResults(results);
    }, SAMPLE_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [curve, duration, readOnly, savedResults, saveResults, specimen, testId]);

  return { ...state, retrySave, stopTest };
}
