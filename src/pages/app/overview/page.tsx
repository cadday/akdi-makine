import { Link } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { Box, Breadcrumbs, Card, CardContent, Grid, hslToRgb, Typography, useTheme } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { renderToStaticMarkup } from "react-dom/server";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { Hexagon } from "lucide-react";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import QuickTestForm from "@/pages/app/overview/components/quick-test-form";
import { LINKS } from "@/constants";
import { useTranslation } from "react-i18next";
import { DraftingCompass, FlaskConical, Network, SlidersVertical } from "lucide-react";
import { useDb, type TestRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import { useThemeContext } from "@/theme/theme-provider";
import { NoTestsFound, NoWayToTest } from "../components/no-entity-found";
import { cn } from "@/lib/utils";

type LatestTestRow = TestRecord & { presetName: string; specimenName: string };

const latestTestColumns: GridColDef<LatestTestRow>[] = [
  {
    field: "name",
    headerName: "Name",
    minWidth: 220,
    flex: 1,
    renderCell: (params: GridRenderCellParams<LatestTestRow, string>) => (
      <Link to={`/tests/${params.row.id}`} className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'>
        {params.value}
      </Link>
    ),
  },
  { field: "presetName", headerName: "Preset", minWidth: 120, flex: 1 },
  { field: "specimenName", headerName: "Specimen", minWidth: 120, flex: 1 },
  { field: "machineIP", headerName: "Machine IP", minWidth: 120, valueFormatter: (value) => value || "-" },
  {
    field: "createdAt",
    headerName: "Created",
    minWidth: 160,
    valueFormatter: (value) => new Date(Number(value)).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }),
  },
];

interface LatestTestTooltipPoint {
  id: string;
  name: string;
  color: string;
  stress: number;
  strain: number;
}

function resolveSeriesColor(color: string, cssVariables: CSSStyleDeclaration) {
  const variableName = color.match(/var\(--([^)]+)\)/)?.[1];
  if (!variableName) return color;
  const hslComponents = cssVariables.getPropertyValue(`--${variableName}`).trim();
  return hslComponents ? hslToRgb(`hsl(${hslComponents.replace(/\s+/g, ", ")})`) : color;
}

const extraSeriesColors = new Map<string, string>();

function getExtraSeriesColor(id: string, isDarkMode: boolean) {
  const key = `${id}:${isDarkMode ? "dark" : "light"}`;
  const existing = extraSeriesColors.get(key);
  if (existing) return existing;
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 20);
  const lightness = isDarkMode ? 66 + Math.floor(Math.random() * 10) : 38 + Math.floor(Math.random() * 12);
  const color = hslToRgb(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  extraSeriesColors.set(key, color);
  return color;
}

function LatestTestsGraphTooltip({ points }: { points: LatestTestTooltipPoint[] }) {
  return (
    <Box className='bg-background-paper shadow-darker-sm! outline-grey-50 rounded-lg p-5 outline-1 flex flex-col gap-2'>
      {[
        { label: "Stress", unit: "MPa", value: (point: LatestTestTooltipPoint) => point.stress, digits: 2 },
        { label: "Strain", unit: "%", value: (point: LatestTestTooltipPoint) => point.strain, digits: 3 },
      ].map(({ label, unit, value, digits }) => (
        <Box key={label} className='flex flex-row gap-2'>
          <Hexagon size={20} />
          <Box className='flex min-w-0 flex-col gap-1'>
            <Typography variant='subtitle1' className='text-text-primary'>
              {label}
            </Typography>
            {points.map((point) => (
              <Box key={`${label}-${point.id}`} className='flex min-w-0 items-center gap-1.5'>
                <Box className='h-2.5 w-2.5 flex-none rounded-full' style={{ backgroundColor: point.color }} />
                <Typography className='text-text-primary'>
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

export default function Page() {
  const { t } = useTranslation();
  const { getRecordCounts, getLatestTests } = useDb();
  const { showError } = useAppNotifications();
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const [counts, setCounts] = useState({ tests: 0, specimens: 0, presets: 0, dataFields: 0 });
  const [latestTests, setLatestTests] = useState<TestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const latestTestRows = useMemo<LatestTestRow[]>(
    () => latestTests.map((test) => ({ ...test, presetName: test.presetSnapshot.name, specimenName: test.specimenSnapshot.name })),
    [latestTests],
  );
  const colors = useMemo(() => {
    const cssVariables = getComputedStyle(document.documentElement);
    const fixedColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette["accent-1"].main,
      theme.palette["accent-2"].main,
      theme.palette["accent-3"].main,
      theme.palette["accent-4"].main,
    ].map((color) => resolveSeriesColor(color, cssVariables));
    return latestTests.map((test, index) => fixedColors[index] ?? getExtraSeriesColor(test.id, isDarkMode));
  }, [isDarkMode, latestTests, theme.palette]);
  const hasGraphData = latestTests.some((test) => (test.results?.graphData?.length ?? 0) > 0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const loadOverview = async () => {
      const [countsResult, testsResult] = await Promise.allSettled([getRecordCounts(), getLatestTests(5)]);
      if (cancelled) return;

      if (countsResult.status === "fulfilled") setCounts(countsResult.value);
      else showError(`Failed to load overview counts: ${String(countsResult.reason)}`);

      if (testsResult.status === "fulfilled") setLatestTests(testsResult.value);
      else showError(`Failed to load latest tests: ${String(testsResult.reason)}`);

      setIsLoading(false);
    };

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, [getLatestTests, getRecordCounts, showError]);

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
          divider: hslToRgb("hsl(226, 4%, 20%)"),
          hoverLabelBackground: hslToRgb("hsl(226, 4%, 20%)"),
          secondaryText: hslToRgb("hsl(0, 0%, 60%)"),
        }
      : {
          divider: hslToRgb("hsl(0, 0%, 90%)"),
          hoverLabelBackground: hslToRgb("hsl(0, 0%, 90%)"),
          secondaryText: hslToRgb("hsl(0, 0%, 60%)"),
        };
    const option: EChartsOption = {
      animation: false,
      color: colors,
      grid: { top: 35, right: 28, bottom: 78, left: 62 },
      legend: { bottom: 0, type: "scroll", icon: "circle", itemWidth: 10, itemHeight: 10, textStyle: { color: chartColors.secondaryText } },
      tooltip: {
        trigger: "axis",
        renderMode: "html",
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
        extraCssText: "box-shadow: none;",
        axisPointer: { type: "cross", lineStyle: { type: "solid", color: chartColors.divider } },
        position: (point, _params, _dom, _rect, size) => {
          const [viewWidth, viewHeight] = size.viewSize;
          const [contentWidth, contentHeight] = size.contentSize;
          return [
            Math.min(Math.max(point[0], 0), Math.max(viewWidth - contentWidth, 0)),
            Math.min(Math.max(point[1], 0), Math.max(viewHeight - contentHeight, 0)),
          ];
        },
        formatter: (params) => {
          if (!Array.isArray(params)) return "";
          const hoveredPoint = params.find((param) => Array.isArray(param.value));
          const hoveredStrain = Number(hoveredPoint?.axisValue ?? (Array.isArray(hoveredPoint?.value) ? hoveredPoint.value[0] : NaN));
          if (!Number.isFinite(hoveredStrain)) return "";

          const points = latestTests.flatMap((test, index): LatestTestTooltipPoint[] => {
            const graphData = test.results?.graphData ?? [];
            if (graphData.length === 0) return [];
            const nearestPoint = graphData.reduce((nearest, point) =>
              Math.abs(point.x - hoveredStrain) < Math.abs(nearest.x - hoveredStrain) ? point : nearest,
            );
            return [{ id: test.id, name: test.name, color: colors[index], strain: nearestPoint.x, stress: nearestPoint.y }];
          });
          return points.length ? renderToStaticMarkup(<LatestTestsGraphTooltip points={points} />) : "";
        },
      },
      dataZoom: [{ type: "inside", filterMode: "none", zoomOnMouseWheel: true, moveOnMouseMove: true, moveOnMouseWheel: false }],
      xAxis: {
        type: "value",
        axisPointer: {
          type: "line" as const,
          lineStyle: { type: "solid", color: chartColors.divider },
          label: { backgroundColor: chartColors.hoverLabelBackground, color: chartColors.secondaryText },
        },
        name: "Strain (%)",
        nameLocation: "middle",
        nameGap: 32,
        nameTextStyle: { color: chartColors.secondaryText },
        axisLabel: { color: chartColors.secondaryText },
        axisLine: { lineStyle: { color: chartColors.divider } },
        splitLine: { lineStyle: { color: chartColors.divider, type: "dashed" } },
      },
      yAxis: {
        type: "value",
        axisPointer: {
          type: "line",
          lineStyle: { type: "solid", color: chartColors.divider },
          label: { backgroundColor: chartColors.hoverLabelBackground, color: chartColors.secondaryText },
        },
        name: "Stress (MPa)",
        nameLocation: "middle",
        nameGap: 48,
        nameTextStyle: { color: chartColors.secondaryText },
        axisLabel: { color: chartColors.secondaryText },
        axisLine: { lineStyle: { color: chartColors.divider } },
        splitLine: { lineStyle: { color: chartColors.divider, type: "dashed" } },
      },
      series: latestTests
        .map((test, index) => ({
          name: test.name,
          type: "line" as const,
          showSymbol: false,
          emphasis: { disabled: true },
          lineStyle: { width: 2, color: colors[index] },
          itemStyle: { color: colors[index] },
          data: (test.results?.graphData ?? []).map(({ x, y }) => [x, y]),
        }))
        .filter((series) => series.data.length > 0),
    };
    chartRef.current?.setOption(option, { notMerge: true, lazyUpdate: true });
  }, [colors, isDarkMode, latestTests]);

  return isLoading ? (
    <LoadingFullScreen />
  ) : (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("menu-overview")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("menu-overview")}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className='w-full'>
          <Grid container spacing={5} size={{ lg: 8, xs: 12 }}>
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Summary
              </Typography>

              <Grid container spacing={2.5} size={{ xs: 12 }}>
                <Grid size={{ lg: 3, xs: 12 }}>
                  <Card component={Link} to={"/tests"} className='flex group'>
                    <CardContent>
                      <Box className='flex flex-col gap-4'>
                        <FlaskConical className='group-hover:text-primary transition-colors' />
                        <Box className='flex flex-col gap-0'>
                          <Typography className='group-hover:text-primary transition-colors text-text-secondary'>Tests</Typography>
                          <Typography className='group-hover:text-primary transition-colors' variant='h6'>
                            {counts.tests.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ lg: 3, xs: 12 }}>
                  <Card component={Link} to={"/specimens"} className='flex group'>
                    <CardContent>
                      <Box className='flex flex-col gap-4'>
                        <DraftingCompass className='group-hover:text-primary transition-colors' />
                        <Box className='flex flex-col gap-0'>
                          <Typography className='group-hover:text-primary transition-colors text-text-secondary'>Specimens</Typography>
                          <Typography className='group-hover:text-primary transition-colors' variant='h6'>
                            {counts.specimens.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ lg: 3, xs: 12 }}>
                  <Card component={Link} to={"/presets"} className='flex group'>
                    <CardContent>
                      <Box className='flex flex-col gap-4'>
                        <SlidersVertical className='group-hover:text-primary transition-colors' />
                        <Box className='flex flex-col gap-0'>
                          <Typography className='group-hover:text-primary transition-colors text-text-secondary'>Presets</Typography>
                          <Typography className='group-hover:text-primary transition-colors' variant='h6'>
                            {counts.presets.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ lg: 3, xs: 12 }}>
                  <Card component={Link} to={"/data-fields"} className='flex group'>
                    <CardContent>
                      <Box className='flex flex-col gap-4'>
                        <Network className='group-hover:text-primary transition-colors' />
                        <Box className='flex flex-col gap-0'>
                          <Typography className='group-hover:text-primary transition-colors text-text-secondary'>Data Fields</Typography>
                          <Typography className='group-hover:text-primary transition-colors' variant='h6'>
                            {counts.dataFields.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Latest Tests Graphs
              </Typography>
              <Card>
                <CardContent className={cn("flex flex-col", !hasGraphData && "min-h-80 justify-center")}>
                  {hasGraphData ? (
                    <Box
                      ref={chartElementRef}
                      role='img'
                      aria-label='Overlaid stress-strain curves for the five latest tests'
                      className='h-140 w-full min-w-0'
                    />
                  ) : (
                    <NoTestsFound />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Latest Tests
              </Typography>
              <Card>
                <CardContent className={cn("flex flex-col", !latestTestRows.length && "min-h-80 justify-center")}>
                  {latestTestRows.length === 0 ? (
                    <NoTestsFound />
                  ) : (
                    <DataGrid
                      autoHeight
                      rows={latestTestRows}
                      columns={latestTestColumns}
                      hideFooter
                      showToolbar={false}
                      disableColumnMenu
                      disableRowSelectionOnClick
                      columnHeaderHeight={40}
                      rowHeight={44}
                      className='dense border-none'
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={5} size={{ lg: 4, xs: 12 }}>
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Quick Test
              </Typography>
              <Card>
                <CardContent>{counts.specimens === 0 || counts.presets === 0 ? <NoWayToTest /> : <QuickTestForm />}</CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
