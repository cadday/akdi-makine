import { Box, Card, CardContent, Grid, Skeleton, Typography, useTheme } from "@mui/material";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { renderToStaticMarkup } from "react-dom/server";
import { useEffect, useRef } from "react";
import { Hexagon } from "lucide-react";
import type { TestRecord, TestResults } from "@/context/db-context";
import { cssVariableColorToRgb } from "@/lib/chart-helper";
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

function StressStrainTooltip({ stress, strain }: { stress: number; strain: number }) {
  return (
    <Box className='bg-background-paper shadow-darker-sm! outline-grey-50 rounded-lg p-5 outline-1 flex flex-col gap-2'>
      <Box className='flex flex-row gap-2'>
        <Hexagon size={20}/>
        <Box className='flex flex-row gap-1'>
          <Typography variant='subtitle1'>Stress</Typography>
          <Typography color='text-secondary'>{stress.toFixed(2)} (MPa)</Typography>
        </Box>
      </Box>
      <Box className='flex flex-row gap-2'>
        <Hexagon size={20}/>
        <Box className='flex flex-row gap-1'>
          <Typography variant='subtitle1'>Strain</Typography>
          <Typography color='text-secondary'>{strain.toFixed(3)} (%)</Typography>
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
  const theme = useTheme();
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
    const frameId = window.requestAnimationFrame(() => {
      const dividerColor = cssVariableColorToRgb(theme.palette.divider);
      const hoverLabelBackgroundColor = cssVariableColorToRgb(theme.palette.grey[100]);
      const secondaryTextColor = cssVariableColorToRgb(theme.palette.text.secondary);
      const primaryColor = cssVariableColorToRgb(theme.palette.primary.main);

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
          axisPointer: { type: "cross", lineStyle: { type: "solid", color: dividerColor } },
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
            lineStyle: { type: "solid", color: dividerColor },
            label: { backgroundColor: hoverLabelBackgroundColor, color: secondaryTextColor },
          },
          name: "Strain (%)",
          nameLocation: "middle",
          nameGap: 32,
          nameTextStyle: { color: secondaryTextColor },
          axisLabel: { color: secondaryTextColor },
          axisLine: { lineStyle: { color: dividerColor } },
          splitLine: { lineStyle: { color: dividerColor, type: "dashed" } },
        },
        yAxis: {
          type: "value",
          axisPointer: {
            type: "line",
            lineStyle: { type: "solid", color: dividerColor },
            label: { backgroundColor: hoverLabelBackgroundColor, color: secondaryTextColor },
          },
          name: "Stress (MPa)",
          nameLocation: "middle",
          nameGap: 48,
          nameTextStyle: { color: secondaryTextColor },
          axisLabel: { color: secondaryTextColor },
          axisLine: { lineStyle: { color: dividerColor } },
          splitLine: { lineStyle: { color: dividerColor, type: "dashed" } },
        },
        series: [
          {
            name: "Stress",
            type: "line",
            showSymbol: false,
            emphasis: { disabled: true },
            data: graphData.map(({ x, y }) => [x, y]),
            lineStyle: { width: 2, color: primaryColor },
            itemStyle: { color: primaryColor },
          },
        ],
      };

      chartRef.current?.setOption(option, { lazyUpdate: true });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [graphData, isDarkMode, theme]);

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
