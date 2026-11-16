import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { Pause, Play, RotateCcw, WeightTilde } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TestRecord } from "@/context/db-context";
import { WeightUp } from "@/icons/custom-lucide-icons/weight-up";

interface TestVideoShortProps {
  test: TestRecord;
}

type PlaybackStatus = "idle" | "playing" | "paused" | "completed";

function getGridAxisRange(values: number[]) {
  if (!values.length) return { min: 0, max: 1, interval: 0.25 };

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const spread = dataMax - dataMin;
  const padding = spread > 0 ? spread * 0.05 : Math.max(Math.abs(dataMin) * 0.05, 0.5);
  const min = dataMin - padding;
  const max = dataMax + padding;

  return { min, max, interval: (max - min) / 4 };
}

export default function TestVideoShort({ test }: TestVideoShortProps) {
  const { t } = useTranslation();
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const elapsedRef = useRef(0);
  const elapsedBeforePlayRef = useRef(0);
  const playbackStartedAtRef = useRef(0);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);

  const samples = useMemo(
    () => (test.results?.loadDisplacementData ?? []).filter(({ displacement, load }) => Number.isFinite(displacement) && Number.isFinite(load)),
    [test.results?.loadDisplacementData],
  );
  const recordedDurationMs = (test.results?.testDuration ?? 0) * 1000;
  const durationMs = Number.isFinite(recordedDurationMs) && recordedDurationMs > 0 ? recordedDurationMs : 0;
  const hasPlayableData = samples.length > 0 && durationMs > 0;
  const visibleCount = hasPlayableData ? Math.min(samples.length, Math.floor((elapsedMs / durationMs) * samples.length) + 1) : 0;
  const visibleSamples = useMemo(() => samples.slice(0, visibleCount), [samples, visibleCount]);
  const hasStarted = status !== "idle";
  const currentLoad = hasStarted && visibleSamples.length ? visibleSamples[visibleSamples.length - 1].load : 0;
  const peakLoad = hasStarted && visibleSamples.length ? Math.max(...visibleSamples.map(({ load }) => load)) : 0;
  const chartData = useMemo(() => (hasStarted ? visibleSamples.map(({ displacement, load }) => [displacement, load]) : []), [hasStarted, visibleSamples]);
  const xAxisRange = useMemo(() => getGridAxisRange(samples.map(({ displacement }) => displacement)), [samples]);
  const yAxisRange = useMemo(() => getGridAxisRange(samples.map(({ load }) => load)), [samples]);

  useEffect(() => {
    elapsedRef.current = elapsedMs;
  }, [elapsedMs]);

  useEffect(() => {
    elapsedRef.current = 0;
    elapsedBeforePlayRef.current = 0;
    setElapsedMs(0);
    setStatus("idle");
  }, [test.id]);

  useEffect(() => {
    if (!chartElementRef.current) return;

    const chart = echarts.init(chartElementRef.current);
    chartRef.current = chart;
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartElementRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [hasPlayableData]);

  useEffect(() => {
    const option: EChartsOption = {
      animation: false,
      grid: {
        top: 12,
        right: 12,
        bottom: 12,
        left: 12,
        show: false,
      },
      tooltip: { show: false },
      xAxis: {
        type: "value",
        ...xAxisRange,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: {
          show: true,
          showMinLine: false,
          showMaxLine: false,
          lineStyle: { color: "rgba(128, 128, 128, 0.24)" },
        },
      },
      yAxis: {
        type: "value",
        ...yAxisRange,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: {
          show: true,
          showMinLine: false,
          showMaxLine: false,
          lineStyle: { color: "rgba(128, 128, 128, 0.24)" },
        },
      },
      series: [
        {
          type: "line",
          data: chartData,
          showSymbol: false,
          lineStyle: { color: "#0096db", width: 3 },
          itemStyle: { color: "#0096db" },
        },
      ],
    };

    chartRef.current?.setOption(option, { notMerge: true, lazyUpdate: true });
  }, [chartData, xAxisRange, yAxisRange]);

  useEffect(() => {
    if (status !== "playing" || !hasPlayableData) return;

    const updateElapsed = () => {
      const nextElapsed = Math.min(durationMs, elapsedBeforePlayRef.current + performance.now() - playbackStartedAtRef.current);
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);
      if (nextElapsed >= durationMs) setStatus("completed");
    };

    const intervalId = window.setInterval(updateElapsed, 50);
    updateElapsed();
    return () => window.clearInterval(intervalId);
  }, [durationMs, hasPlayableData, status]);

  const startPlayback = () => {
    if (!hasPlayableData) return;
    if (status === "completed") {
      elapsedRef.current = 0;
      elapsedBeforePlayRef.current = 0;
      setElapsedMs(0);
    } else {
      elapsedBeforePlayRef.current = elapsedRef.current;
    }
    playbackStartedAtRef.current = performance.now();
    setStatus("playing");
  };

  const pausePlayback = () => {
    const pausedAt = Math.min(durationMs, elapsedBeforePlayRef.current + performance.now() - playbackStartedAtRef.current);
    elapsedRef.current = pausedAt;
    elapsedBeforePlayRef.current = pausedAt;
    setElapsedMs(pausedAt);
    setStatus("paused");
  };

  return (
    <Grid size={12} className='flex flex-col gap-3 mx-4'>
      <Box className='flex justify-end'>
        {status === "playing" ? (
          <Button color='grey' variant='surface' startIcon={<Pause size={16} />} onClick={pausePlayback}>
            {t("video-sim-pause")}
          </Button>
        ) : (
          <Button
            color='grey'
            variant='surface'
            startIcon={status === "completed" ? <RotateCcw size={16} /> : <Play size={16} />}
            onClick={startPlayback}
            disabled={!hasPlayableData}
          >
            {status === "completed" ? t("video-sim-replay") : status === "paused" ? t("video-sim-resume") : t("video-sim-start")}
          </Button>
        )}
      </Box>
      <Card className="rounded-none">
        <CardContent className='flex flex-col gap-4 pb-7 pt-4'>
          {hasPlayableData ? (
            <Box className='relative h-64 w-full'>
              <Box ref={chartElementRef} role='img' aria-label={t("video-sim-chart")} className='absolute inset-0' />
              <Box
                aria-hidden='true'
                className='pointer-events-none absolute inset-3 rounded-xl border border-grey-100'
              />
            </Box>
          ) : (
            <Box className='flex h-64 items-center justify-center'>
              <Typography color='textSecondary'>{t("video-sim-no-data")}</Typography>
            </Box>
          )}

          <Grid container spacing={2} className='mx-2.5'>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box className='flex flex-col p-6 bg-grey-100 rounded-xl items-center justify-center gap-2'>
                <Box className='flex flex-none items-center justify-center  text-primary'>
                  <WeightTilde width={42} height={42} strokeWidth={2.75} />
                </Box>
                <Typography variant='h2' component='p' className='mb-0 font-extrabold text-primary'>
                  {`${currentLoad.toFixed(1)} N`}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box className='flex flex-col p-6 bg-grey-100 rounded-xl items-center justify-center gap-2'>
                <Box className='flex flex-none items-center justify-center '>
                  <WeightUp width={42} height={42} strokeWidth={2.5} />
                </Box>
                <Typography variant='h2' component='p' className='mb-0 font-bold'>
                  {`${peakLoad.toFixed(1)} N`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
