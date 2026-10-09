import { Box, Card, CardContent, Grid, hslToRgb, Skeleton, Typography } from "@mui/material";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { renderToStaticMarkup } from "react-dom/server";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpFromLine, ArrowUpToLine, ArrowUpWideNarrow, RulerDimensionLine, TicketPercent, Timer, WeightTilde } from "lucide-react";
import type { TestRecord, TestResults } from "@/context/db-context";
import { getTestGraphType } from "@/lib/db";
import { useThemeContext } from "@/theme/theme-provider";
import useMockTestRun from "@/mock/use-mock-test-run";
import TestProgress from "./test-progress";
import { cn } from "@/lib/utils";
import useAppNotifications from "@/hooks/use-app-notifications";
import { Tensile } from "@/icons/custom-lucide-icons/tensile";
import { Yeild } from "@/icons/custom-lucide-icons/yield";
import { useTestRun } from "@/context/test-run-context";

interface TestResultsMachineProps {
  test: TestRecord;
  onResultsSaved: (results: TestResults) => void;
  readOnly?: boolean;
}

const chartColors = {
  light: {
    divider: hslToRgb("hsl(0, 0%, 90%)"),
    hoverLabelBackground: hslToRgb("hsl(0, 0%, 90%)"),
    secondaryText: hslToRgb("hsl(0, 0%, 60%)"),
    primary: hslToRgb("hsl(199, 100%, 43%)"),
  },
  dark: {
    divider: hslToRgb("hsl(226, 4%, 20%)"),
    hoverLabelBackground: hslToRgb("hsl(226, 4%, 20%)"),
    secondaryText: hslToRgb("hsl(0, 0%, 60%)"),
    primary: hslToRgb("hsl(199, 100%, 43%)"),
  },
} as const;

function TestGraphTooltip({ x, y, graphType }: { x: number; y: number; graphType: "load-displacement" | "stress-strain" }) {
  const [xLabel, xUnit, yLabel, yUnit] = graphType === "stress-strain" ? ["Strain", "%", "Stress", "MPa"] : ["Displacement", "mm", "Load", "N"];
  return (
    <Box className='bg-background-paper shadow-darker-sm! outline-grey-50 rounded-lg p-5 outline-1 flex flex-col gap-2'>
      <Box className='flex flex-row gap-2'>
        {graphType === "stress-strain" ? <TicketPercent size={20} /> : <RulerDimensionLine size={20} />}
        <Box className='flex flex-row gap-1'>
          <Typography variant='subtitle1' className='text-text-primary'>
            {xLabel}
          </Typography>
          <Typography className='text-text-primary'>{x.toFixed(graphType === "stress-strain" ? 3 : 3)} ({xUnit})</Typography>
        </Box>
      </Box>
      <Box className='flex flex-row gap-2'>
        <WeightTilde size={20} />
        <Box className='flex flex-row gap-1'>
          <Typography variant='subtitle1' className='text-text-primary'>
            {yLabel}
          </Typography>
          <Typography className='text-text-primary'>{y.toFixed(2)} ({yUnit})</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function TestResultsMachine({ test, onResultsSaved, readOnly = false }: TestResultsMachineProps) {
  const graphType = getTestGraphType(test.specimenSnapshot.geometry);
  const { loadDisplacementData, stressStrainData, progress, results, status, stopTest } = useMockTestRun({
    testId: test.id,
    duration: test.presetSnapshot.duration,
    specimen: test.specimenSnapshot,
    savedResults: test.results,
    onResultsSaved,
    readOnly,
  });
  const { showError, showSuccess } = useAppNotifications();
  const { registerTestRun, unregisterTestRun } = useTestRun();
  const { isDarkMode } = useThemeContext();
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const previousStatusRef = useRef(status);
  const [manuallyStoppedTestId, setManuallyStoppedTestId] = useState<string | null>(null);
  const chartData =
    graphType === "stress-strain"
      ? stressStrainData.map(({ strain, stress }) => [strain, stress])
      : loadDisplacementData.map(({ displacement, load }) => [displacement, load]);
  const xAxisLabel = graphType === "stress-strain" ? "Strain (%)" : "Displacement (mm)";
  const yAxisLabel = graphType === "stress-strain" ? "Stress (MPa)" : "Load (N)";

  useEffect(() => {
    if (status === "done" && previousStatusRef.current !== "done") {
      if (manuallyStoppedTestId === test.id) showError("Test stopped!");
      else showSuccess("Test completed!");
    }
    previousStatusRef.current = status;
  }, [manuallyStoppedTestId, showError, showSuccess, status, test.id]);

  const handleStop = useCallback(() => {
    setManuallyStoppedTestId(test.id);
    stopTest();
  }, [stopTest, test.id]);

  useEffect(() => {
    if (status === "in-progress" && !readOnly) {
      registerTestRun(test.id, handleStop);
      return () => unregisterTestRun(test.id);
    }

    unregisterTestRun(test.id);
  }, [handleStop, readOnly, registerTestRun, status, test.id, unregisterTestRun]);

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
  }, []);

  useEffect(() => {
    const colors = isDarkMode ? chartColors.dark : chartColors.light;
    const option: EChartsOption = {
      animation: false,
      grid: { top: 10, right: 10, bottom: 10, left: 10 },
      tooltip: {
        trigger: "axis",
        renderMode: "html",
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
        extraCssText: "box-shadow: none;",
        axisPointer: { type: "cross", lineStyle: { type: "solid", color: colors.divider } },
        formatter: (params) => {
          const point = Array.isArray(params) ? params[0] : params;
          const values = point?.value;
          if (!Array.isArray(values)) return "";

          const [x, y] = values;
          return renderToStaticMarkup(<TestGraphTooltip x={Number(x)} y={Number(y)} graphType={graphType} />);
        },
      },
      dataZoom: [{ type: "inside", filterMode: "none", zoomOnMouseWheel: true, moveOnMouseMove: true, moveOnMouseWheel: false }],
      xAxis: {
        type: "value",
        axisPointer: {
          type: "line",
          lineStyle: { type: "solid", color: colors.divider },
          label: { backgroundColor: colors.hoverLabelBackground, color: colors.secondaryText },
        },
        name: xAxisLabel,
        nameLocation: "middle",
        nameGap: 32,
        nameTextStyle: { color: colors.secondaryText },
        axisLabel: { color: colors.secondaryText },
        axisLine: { lineStyle: { color: colors.divider } },
        splitLine: { lineStyle: { color: colors.divider, type: "dashed" } },
      },
      yAxis: {
        type: "value",
        axisPointer: {
          type: "line",
          lineStyle: { type: "solid", color: colors.divider },
          label: { backgroundColor: colors.hoverLabelBackground, color: colors.secondaryText },
        },
        name: yAxisLabel,
        nameLocation: "middle",
        nameGap: 48,
        nameTextStyle: { color: colors.secondaryText },
        axisLabel: { color: colors.secondaryText },
        axisLine: { lineStyle: { color: colors.divider } },
        splitLine: { lineStyle: { color: colors.divider, type: "dashed" } },
      },
      series: [
        {
          name: yAxisLabel,
          type: "line",
          showSymbol: false,
          symbol: "circle",
          symbolSize: 10,
          emphasis: { scale: false, itemStyle: { borderWidth: 0 } },
          lineStyle: { width: 2, color: colors.primary },
          itemStyle: { color: colors.primary, borderWidth: 0 },
        },
      ],
    };

    chartRef.current?.setOption(option, { lazyUpdate: true });
  }, [graphType, isDarkMode, xAxisLabel, yAxisLabel]);

  useEffect(() => {
    chartRef.current?.setOption({
      series: [{ type: "line", data: chartData }],
    });
  }, [chartData]);

  return (
    <>
      <Grid container size={12} spacing={5} className='relative'>
        {status === "in-progress" && <TestProgress progress={progress} />}
        <Grid container size={12} spacing={5} className={cn(status === "in-progress" && "relative z-5001")}>
          <Grid size={12}>
            <Typography variant='h6' component='h6' className='mb-3'>
              {graphType === "stress-strain" ? "Stress Strain Graph" : "Load Displacement Graph"}
            </Typography>
            <Card>
              <CardContent>
                <Box ref={chartElementRef} role='img' aria-label={`Live ${graphType === "stress-strain" ? "stress-strain" : "load-displacement"} line chart`} className='h-140 w-full' />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Typography variant='h6' component='h6' className='mb-3'>
              Results
            </Typography>
            <Grid size={12} container spacing={2.5}>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <Yeild className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>Yield Strength</Typography>
                        <Typography>
                          {typeof results?.yieldStrength === "number" ? `${results.yieldStrength} (MPa)` : status === "in-progress" ? <Skeleton /> : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <Tensile className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>Tensile Strength</Typography>
                        <Typography>
                          {typeof results?.tensileStrength === "number" ? `${results.tensileStrength} (MPa)` : status === "in-progress" ? <Skeleton /> : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <ArrowUpWideNarrow className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>Elongation</Typography>
                        <Typography>
                          {typeof results?.elongation === "number" ? `${results.elongation} (%)` : status === "in-progress" ? <Skeleton /> : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <ArrowUpFromLine className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>First Length</Typography>
                        <Typography>
                          {typeof results?.firstLength === "number" ? `${results.firstLength} (mm)` : status === "in-progress" ? <Skeleton /> : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <ArrowUpToLine className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>Last Length</Typography>
                        <Typography>
                          {typeof results?.lastLength === "number" ? `${results.lastLength} (mm)` : status === "in-progress" ? <Skeleton /> : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <Timer className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>Test Duration</Typography>
                        <Typography>
                          {typeof results?.testDuration === "number" ? `${results.testDuration} (s)` : status === "in-progress" ? <Skeleton /> : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
