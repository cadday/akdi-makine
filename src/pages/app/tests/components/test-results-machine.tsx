import { Box, Card, CardContent, Grid, hslToRgb, Skeleton, Typography } from "@mui/material";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { renderToStaticMarkup } from "react-dom/server";
import { useEffect, useRef } from "react";
import { Hexagon } from "lucide-react";
import type { TestRecord, TestResults } from "@/context/db-context";
import { useThemeContext } from "@/theme/theme-provider";
import useMockTestRun from "./use-mock-test-run";

interface TestResultsMachineProps {
  test: TestRecord;
  onResultsSaved: (results: TestResults) => void;
}

const resultItems = [
  { key: "yieldStrength", label: "Yield Strength", unit: "MPa" },
  { key: "tensileStrength", label: "Tensile Strength", unit: "MPa" },
  { key: "elongation", label: "Elongation", unit: "%" },
  { key: "firstLength", label: "First Length", unit: "mm" },
  { key: "lastLength", label: "Last Length", unit: "mm" },
  { key: "testDuration", label: "Test Duration", unit: "s" },
] as const;

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

function StressStrainTooltip({ stress, strain }: { stress: number; strain: number }) {
  return (
    <Box className='bg-background-paper shadow-darker-sm! outline-grey-50 rounded-lg p-5 outline-1 flex flex-col gap-2'>
      <Box className='flex flex-row gap-2'>
        <Hexagon size={20}/>
        <Box className='flex flex-row gap-1'>
          <Typography variant='subtitle1' className='text-text-primary'>Stress</Typography>
          <Typography className='text-text-secondary'>{stress.toFixed(2)} (MPa)</Typography>
        </Box>
      </Box>
      <Box className='flex flex-row gap-2'>
        <Hexagon size={20}/>
        <Box className='flex flex-row gap-1'>
          <Typography variant='subtitle1' className='text-text-primary'>Strain</Typography>
          <Typography className='text-text-secondary'>{strain.toFixed(3)} (%)</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function TestResultsMachine({ test, onResultsSaved }: TestResultsMachineProps) {
  const { graphData, results } = useMockTestRun({
    testId: test.id,
    savedResults: test.results,
    onResultsSaved,
  });
  const { isDarkMode } = useThemeContext();
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

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
      grid: { top: 10, right: 10, bottom: 36, left: 10 },
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

          const [strain, stress] = values;
          return renderToStaticMarkup(<StressStrainTooltip stress={Number(stress)} strain={Number(strain)} />);
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
        name: "Strain (%)",
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
        name: "Stress (MPa)",
        nameLocation: "middle",
        nameGap: 48,
        nameTextStyle: { color: colors.secondaryText },
        axisLabel: { color: colors.secondaryText },
        axisLine: { lineStyle: { color: colors.divider } },
        splitLine: { lineStyle: { color: colors.divider, type: "dashed" } },
      },
      series: [
        {
          name: "Stress",
          type: "line",
          showSymbol: false,
          emphasis: { disabled: true },
          lineStyle: { width: 2, color: colors.primary },
          itemStyle: { color: colors.primary },
        },
      ],
    };

    chartRef.current?.setOption(option, { lazyUpdate: true });
  }, [isDarkMode]);

  useEffect(() => {
    chartRef.current?.setOption({
      series: [{ type: "line", data: graphData.map(({ x, y }) => [x, y]) }],
    });
  }, [graphData]);

  return (
    <>
      <Grid size={12}>
        <Typography variant='h6' component='h6' className='mb-3'>
          Stress Strain Graph
        </Typography>
        <Card>
          <CardContent>
            <Box ref={chartElementRef} role='img' aria-label='Live stress strain line chart' className='h-140 w-full' />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Typography variant='h6' component='h6' className='mb-3'>
          Results
        </Typography>
        <Grid size={12} container spacing={2.5}>
          {resultItems.map(({ key, label, unit }) => {
            const value = results?.[key];
            return (
              <Grid key={key} size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <Hexagon className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>{label}</Typography>
                        <Typography color='textSecondary'>{typeof value === "number" ? `${value} (${unit})` : <Skeleton />}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
}
