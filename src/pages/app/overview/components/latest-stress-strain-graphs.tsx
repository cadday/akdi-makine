import { useEffect, useMemo, useRef } from 'react';
import { Box, Card, CardContent, FormControl, Grid, hslToRgb, MenuItem, Select, Typography, useTheme } from '@mui/material';
import { renderToStaticMarkup } from 'react-dom/server';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { ChevronDown, ChevronLeft, ChevronRight, RulerDimensionLine, TicketPercent, WeightTilde } from 'lucide-react';
import type { TestGraphPoint, TestRecord } from '@/context/db-context';
import { getTestGraphType, type TestGraphType } from '@/lib/db';
import { useThemeContext } from '@/theme/theme-provider';
import { NoTestsFound } from '@/pages/app/components/no-entity-found';
import { cn } from '@/lib/utils';

interface LatestTestTooltipPoint {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

function resolveSeriesColor(color: string, cssVariables: CSSStyleDeclaration) {
  const variableName = color.match(/var\(--([^)]+)\)/)?.[1];
  if (!variableName) return color;
  const hslComponents = cssVariables.getPropertyValue(`--${variableName}`).trim();
  return hslComponents ? hslToRgb(`hsl(${hslComponents.replace(/\s+/g, ', ')})`) : color;
}

function getLucideImage(icon: typeof ChevronLeft, color: string) {
  const Icon = icon;
  const svg = renderToStaticMarkup(<Icon color={color} />);
  return `image://data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const extraSeriesColors = new Map<string, string>();

function getExtraSeriesColor(id: string, isDarkMode: boolean) {
  const key = `${id}:${isDarkMode ? 'dark' : 'light'}`;
  const existing = extraSeriesColors.get(key);
  if (existing) return existing;
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 20);
  const lightness = isDarkMode ? 66 + Math.floor(Math.random() * 10) : 38 + Math.floor(Math.random() * 12);
  const color = hslToRgb(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  extraSeriesColors.set(key, color);
  return color;
}

function getNearestGraphPoint(points: TestGraphPoint[], strain: number) {
  return points.reduce<TestGraphPoint | undefined>(
    (nearest, point) => (!nearest || Math.abs(point.x - strain) < Math.abs(nearest.x - strain) ? point : nearest),
    undefined,
  );
}

function LatestTestsGraphTooltip({
  points,
  graphType,
}: {
  points: LatestTestTooltipPoint[];
  graphType: TestGraphType;
}) {
  const [xLabel, xUnit, yLabel, yUnit] =
    graphType === 'stress-strain' ? ['Strain', '%', 'Stress', 'MPa'] : ['Displacement', 'mm', 'Load', 'N'];
  return (
    <Box className="bg-background-paper shadow-darker-sm! outline-grey-50 rounded-lg p-5 outline-1 flex flex-col gap-2">
      {[
        { label: xLabel, unit: xUnit, value: (point: LatestTestTooltipPoint) => point.x, digits: 3 },
        { label: yLabel, unit: yUnit, value: (point: LatestTestTooltipPoint) => point.y, digits: 2 },
      ].map(({ label, unit, value, digits }) => (
        <Box key={label} className="flex flex-row gap-2">
          {label === 'Stress' || label === 'Load' ? (
            <WeightTilde size={20} />
          ) : label === 'Strain' ? (
            <TicketPercent size={20} />
          ) : (
            <RulerDimensionLine size={20} />
          )}
          <Box className="flex min-w-0 flex-col gap-1">
            <Typography variant="subtitle1" className="text-text-primary">
              {label}
            </Typography>
            {points.map((point) => (
              <Box key={`${label}-${point.id}`} className="flex min-w-0 items-center gap-1.5">
                <Box className="h-2.5 w-2.5 flex-none rounded-full" style={{ backgroundColor: point.color }} />
                <Typography className="text-text-primary">
                  {value(point).toFixed(digits)} ({unit})
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default function LatestStressStrainGraphs({
  tests,
  graphType,
  onGraphTypeChange,
}: {
  tests: TestRecord[];
  graphType: TestGraphType;
  onGraphTypeChange: (graphType: TestGraphType) => void;
}) {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const colors = useMemo(() => {
    const cssVariables = getComputedStyle(document.documentElement);
    const fixedColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette['accent-1'].main,
      theme.palette['accent-2'].main,
      theme.palette['accent-3'].main,
      theme.palette['accent-4'].main,
    ].map((color) => resolveSeriesColor(color, cssVariables));
    return tests.map((test, index) => fixedColors[index] ?? getExtraSeriesColor(test.id, isDarkMode));
  }, [isDarkMode, tests, theme.palette]);
  const hasGraphData = tests.some(
    (test) =>
      getTestGraphType(test.specimenSnapshot.geometry) === graphType &&
      (graphType === 'stress-strain'
        ? (test.results?.stressStrainData?.length ?? 0) > 0
        : (test.results?.loadDisplacementData?.length ?? 0) > 0),
  );

  useEffect(() => {
    if (!hasGraphData || !chartElementRef.current) return;
    const chart = echarts.init(chartElementRef.current);
    chartRef.current = chart;
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartElementRef.current);
    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [hasGraphData]);

  useEffect(() => {
    const chartColors = isDarkMode
      ? {
          divider: hslToRgb('hsl(226, 4%, 20%)'),
          hoverLabelBackground: hslToRgb('hsl(226, 4%, 20%)'),
          secondaryText: hslToRgb('hsl(0, 0%, 60%)'),
        }
      : {
          divider: hslToRgb('hsl(0, 0%, 90%)'),
          hoverLabelBackground: hslToRgb('hsl(0, 0%, 90%)'),
          secondaryText: hslToRgb('hsl(0, 0%, 60%)'),
        };
    const getGraphData = (test: TestRecord): TestGraphPoint[] =>
      graphType === 'stress-strain'
        ? (test.results?.stressStrainData ?? []).map(({ strain, stress }) => ({ x: strain, y: stress }))
        : (test.results?.loadDisplacementData ?? []).map(({ displacement, load }) => ({ x: displacement, y: load }));
    const graphTests = tests
      .filter((test) => getTestGraphType(test.specimenSnapshot.geometry) === graphType && getGraphData(test).length > 0)
      .slice(0, 5);
    const graphTestColors = graphTests.map((test) => colors[tests.findIndex((latestTest) => latestTest.id === test.id)]);
    const getPointsAtX = (x: number): LatestTestTooltipPoint[] =>
      graphTests.flatMap((test, index) => {
        const nearestPoint = getNearestGraphPoint(getGraphData(test), x);
        return nearestPoint
          ? [{ id: test.id, name: test.name, color: graphTestColors[index], x: nearestPoint.x, y: nearestPoint.y }]
          : [];
      });
    const [xAxisLabel, yAxisLabel] =
      graphType === 'stress-strain' ? ['Strain (%)', 'Stress (MPa)'] : ['Displacement (mm)', 'Load (N)'];
    const option: EChartsOption = {
      animation: false,
      color: colors,
      grid: { top: 35, right: 28, bottom: 78, left: 62 },
      legend: {
        bottom: 0,
        type: 'scroll',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        pageIcons: {
          horizontal: [
            getLucideImage(ChevronLeft, chartColors.secondaryText),
            getLucideImage(ChevronRight, chartColors.secondaryText),
          ],
        },
        pageIconSize: 16,
        textStyle: { color: chartColors.secondaryText },
      },
      tooltip: {
        trigger: 'axis',
        renderMode: 'html',
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        extraCssText: 'box-shadow: none;',
        axisPointer: { type: 'cross', snap: false, lineStyle: { type: 'solid', color: chartColors.divider } },
        position: (point, _params, _dom, _rect, size) => {
          const [viewWidth, viewHeight] = size.viewSize;
          const [contentWidth, contentHeight] = size.contentSize;
          return [
            Math.min(Math.max(point[0], 0), Math.max(viewWidth - contentWidth, 0)),
            Math.min(Math.max(point[1], 0), Math.max(viewHeight - contentHeight, 0)),
          ];
        },
        formatter: (params) => {
          if (!Array.isArray(params)) return '';
          const axisValue = params.find((param) => param.axisDimension === 'x')?.axisValue ?? params[0]?.axisValue;
          const x = Number(axisValue);
          if (!Number.isFinite(x)) return '';
          const points = getPointsAtX(x);
          return points.length
            ? renderToStaticMarkup(<LatestTestsGraphTooltip points={points} graphType={graphType} />)
            : '';
        },
      },
      dataZoom: [
        { type: 'inside', filterMode: 'none', zoomOnMouseWheel: true, moveOnMouseMove: true, moveOnMouseWheel: false },
      ],
      xAxis: {
        type: 'value',
        axisPointer: {
          type: 'line' as const,
          lineStyle: { type: 'solid', color: chartColors.divider },
          label: { backgroundColor: chartColors.hoverLabelBackground, color: chartColors.secondaryText },
        },
        name: xAxisLabel,
        nameLocation: 'middle',
        nameGap: 32,
        nameTextStyle: { color: chartColors.secondaryText },
        axisLabel: { color: chartColors.secondaryText },
        axisLine: { lineStyle: { color: chartColors.divider } },
        splitLine: { lineStyle: { color: chartColors.divider, type: 'dashed' } },
      },
      yAxis: {
        type: 'value',
        axisPointer: {
          type: 'line',
          lineStyle: { type: 'solid', color: chartColors.divider },
          label: { backgroundColor: chartColors.hoverLabelBackground, color: chartColors.secondaryText },
        },
        name: yAxisLabel,
        nameLocation: 'middle',
        nameGap: 48,
        nameTextStyle: { color: chartColors.secondaryText },
        axisLabel: { color: chartColors.secondaryText },
        axisLine: { lineStyle: { color: chartColors.divider } },
        splitLine: { lineStyle: { color: chartColors.divider, type: 'dashed' } },
      },
      series: [
        ...graphTests.map((test, index) => ({
          name: test.name,
          type: 'line' as const,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 8,
          emphasis: { scale: true },
          lineStyle: { width: 2, color: graphTestColors[index] },
          itemStyle: { color: graphTestColors[index] },
          data: getGraphData(test).map(({ x, y }) => [x, y]),
        })),
        {
          id: 'hover-markers',
          type: 'scatter' as const,
          data: [],
          symbol: 'circle',
          symbolSize: 10,
          silent: true,
          tooltip: { show: false },
          z: 10,
        },
      ],
    };
    const chart = chartRef.current;
    if (!chart) return;
    const updateMarkers = (x: number) => {
      const markerData = getPointsAtX(x).map((point) => ({
        value: [point.x, point.y],
        itemStyle: { color: point.color, borderWidth: 0 },
      }));
      chart.setOption({ series: [{ id: 'hover-markers', data: markerData }] });
    };
    const handleAxisPointer = (event: unknown) => {
      const axesInfo = (event as { axesInfo?: Array<{ axisDim?: string; value?: unknown }> }).axesInfo;
      const xAxis = axesInfo?.find((axis) => axis.axisDim === 'x');
      const x = Number(xAxis?.value);
      if (Number.isFinite(x)) updateMarkers(x);
    };
    const clearMarkers = () => chart.setOption({ series: [{ id: 'hover-markers', data: [] }] });

    chart.setOption(option, { notMerge: true, lazyUpdate: true });
    chart.on('updateAxisPointer', handleAxisPointer);
    chart.on('globalout', clearMarkers);
    return () => {
      chart.off('updateAxisPointer', handleAxisPointer);
      chart.off('globalout', clearMarkers);
    };
  }, [colors, graphType, isDarkMode, tests]);

  return (
    <Grid size={12} className="group/grid">
      <Box className="mb-3 flex flex-wrap items-center justify-between gap-2 relative">
        <Typography variant="h6" component="h6">
          {graphType === 'stress-strain' ? 'Latest Stress-Strain Graphs' : 'Latest Load-Displacement Graphs'}
        </Typography>
        <FormControl
          size="small"
          variant="standard"
          className={cn(
            'group-hover/grid:opacity-100',
            'transition-all opacity-0 outlined min-w-44 absolute inset-e-0 mt-4 [&_.MuiInputBase-root.MuiInput-root.MuiInputBase-sizeSmall.outlined]:py-0.25! [&_.MuiInput-root]:rounded-xs!',
          )}
        >
          <Select
            variant="standard"
            size="small"
            className="outlined"
            value={graphType}
            onChange={(event) => onGraphTypeChange(event.target.value as TestGraphType)}
            inputProps={{ 'aria-label': 'Graph type' }}
            IconComponent={ChevronDown}
          >
            <MenuItem value="stress-strain">Stress-Strain</MenuItem>
            <MenuItem value="load-displacement">Load-Displacement</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Card>
        <CardContent className={cn('flex flex-col', !hasGraphData && 'min-h-80 justify-center')}>
          {hasGraphData ? (
            <Box
              ref={chartElementRef}
              role="img"
              aria-label={`Overlaid ${graphType === 'stress-strain' ? 'stress-strain' : 'load-displacement'} curves for the five latest tests`}
              className="h-140 w-full min-w-0"
            />
          ) : (
            <NoTestsFound />
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
