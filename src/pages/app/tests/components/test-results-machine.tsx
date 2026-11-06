import { Box, Card, CardContent, Grid, hslToRgb, Typography } from "@mui/material";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { renderToStaticMarkup } from "react-dom/server";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { ArrowUpWideNarrow, RulerDimensionLine, TicketPercent, Timer, WeightTilde } from "lucide-react";
import type { TestRecord } from "@/context/db-context";
import { getStressStrainMaximums, getTestGraphType, getYieldStrengthCalculation } from "@/lib/db";
import TestProgress from "./test-progress";
import { useThemeContext } from "@/theme/theme-provider";
import { cn } from "@/lib/utils";
import { Tensile } from "@/icons/custom-lucide-icons/tensile";
import { Yeild } from "@/icons/custom-lucide-icons/yield";

interface TestResultsMachineProps {
  test: TestRecord;
}

const chartColors = {
  light: {
    divider: hslToRgb("hsl(0, 0%, 90%)"),
    hoverLabelBackground: hslToRgb("hsl(0, 0%, 90%)"),
    secondaryText: hslToRgb("hsl(0, 0%, 60%)"),
    primary: hslToRgb("hsl(199, 100%, 43%)"),
    elasticFit: hslToRgb("hsl(145, 63%, 38%)"),
    offsetLine: hslToRgb("hsl(35, 95%, 48%)"),
    yieldPoint: hslToRgb("hsl(0, 78%, 52%)"),
  },
  dark: {
    divider: hslToRgb("hsl(226, 4%, 20%)"),
    hoverLabelBackground: hslToRgb("hsl(226, 4%, 20%)"),
    secondaryText: hslToRgb("hsl(0, 0%, 60%)"),
    primary: hslToRgb("hsl(199, 100%, 43%)"),
    elasticFit: hslToRgb("hsl(145, 63%, 48%)"),
    offsetLine: hslToRgb("hsl(35, 95%, 58%)"),
    yieldPoint: hslToRgb("hsl(0, 78%, 62%)"),
  },
} as const;

function TestGraphTooltip({ x, y, graphType, t }: { x: number; y: number; graphType: "load-displacement" | "stress-strain"; t: TFunction }) {
  const [xLabel, xUnit, yLabel, yUnit] = graphType === "stress-strain"
    ? [t("view-axis-strain"), "%", t("view-axis-stress"), "MPa"]
    : [t("view-axis-displacement"), "mm", t("view-axis-load"), "N"];
  return (
    <Box className='bg-background-paper shadow-darker-sm! outline-grey-50 rounded-lg p-5 outline-1 flex flex-col gap-2'>
      <Box className='flex flex-row gap-2'>
        {graphType === "stress-strain" ? <TicketPercent size={20} /> : <RulerDimensionLine size={20} />}
        <Box className='flex flex-row gap-1'>
          <Typography variant='subtitle1' className='text-text-primary'>
            {xLabel}
          </Typography>
          <Typography className='text-text-primary'>{x.toFixed(graphType === "stress-strain" ? 3 : 3)} {xUnit}</Typography>
        </Box>
      </Box>
      <Box className='flex flex-row gap-2'>
        <WeightTilde size={20} />
        <Box className='flex flex-row gap-1'>
          <Typography variant='subtitle1' className='text-text-primary'>
            {yLabel}
          </Typography>
          <Typography className='text-text-primary'>{y.toFixed(2)} {yUnit}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function TestResultsMachine({ test }: TestResultsMachineProps) {
  const { t } = useTranslation();
  const graphType = getTestGraphType(test.specimenSnapshot.geometry);
  const loadDisplacementData = test.results?.loadDisplacementData ?? [];
  const stressStrainData = test.results?.stressStrainData ?? [];
  const results = test.results;
  const { isDarkMode } = useThemeContext();
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const chartData =
    graphType === "stress-strain"
      ? stressStrainData.map(({ strain, stress }) => [strain, stress])
      : loadDisplacementData.map(({ displacement, load }) => [displacement, load]);
  const yieldCalculation =
    graphType === "stress-strain" && results?.finalized
      ? getYieldStrengthCalculation(stressStrainData)
      : null;
  const stressStrainMaximums =
    graphType === "stress-strain" && results?.finalized ? getStressStrainMaximums(stressStrainData) : null;
  const tensileStrength =
    typeof results?.tensileStrength === "number" ? results.tensileStrength : stressStrainMaximums?.maxStress;
  const elongation =
    typeof results?.elongation === "number" ? results.elongation : stressStrainMaximums?.maxStrain;
  const xAxisLabel = graphType === "stress-strain" ? `${t("view-axis-strain")} %` : `${t("view-axis-displacement")} mm`;
  const yAxisLabel = graphType === "stress-strain" ? `${t("view-axis-stress")} MPa` : `${t("view-axis-load")} N`;
  const isTestRunning = test.runStatus === "starting" || test.runStatus === "running" || test.runStatus === "stopping";

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
      grid: { top: yieldCalculation ? 32 : 10, right: 10, bottom: 10, left: 10 },
      legend: {
        show: Boolean(yieldCalculation),
        top: 0,
        textStyle: { color: colors.secondaryText },
      },
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
          return renderToStaticMarkup(<TestGraphTooltip x={Number(x)} y={Number(y)} graphType={graphType} t={t} />);
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
        {
          name: t("view-elastic-fit"),
          type: "line",
          showSymbol: false,
          lineStyle: { width: 2, color: colors.elasticFit },
          itemStyle: { color: colors.elasticFit },
        },
        {
          name: t("view-offset-line"),
          type: "line",
          showSymbol: false,
          lineStyle: { width: 2, type: "dashed", color: colors.offsetLine },
          itemStyle: { color: colors.offsetLine },
        },
        {
          name: t("view-yield-strength-series"),
          type: "scatter",
          symbol: "circle",
          symbolSize: 10,
          itemStyle: { color: colors.yieldPoint },
          label: { show: true, formatter: t("view-yield-strength-series"), position: "top" },
        },
      ],
    };

    chartRef.current?.setOption(option, { lazyUpdate: true });
  }, [graphType, isDarkMode, yieldCalculation, xAxisLabel, yAxisLabel, t]);

  useEffect(() => {
    chartRef.current?.setOption({
      series: [
        { type: "line", data: chartData },
        {
          type: "line",
          data: yieldCalculation
            ? [
                [0, 0],
                [
                  yieldCalculation.elasticRegionEndStrain,
                  yieldCalculation.elasticModulus * yieldCalculation.elasticRegionEndStrain,
                ],
              ]
            : [],
        },
        {
          type: "line",
          data: yieldCalculation
            ? [
                [yieldCalculation.offsetStrainPercent, 0],
                [yieldCalculation.yieldPoint.strain, yieldCalculation.yieldPoint.stress],
              ]
            : [],
        },
        {
          type: "scatter",
          data: yieldCalculation
            ? [[yieldCalculation.yieldPoint.strain, yieldCalculation.yieldPoint.stress]]
            : [],
        },
      ],
    });
  }, [chartData, yieldCalculation]);

  return (
    <>
      <Grid container size={12} spacing={5} className='relative'>
        {isTestRunning && <TestProgress />}
        {/* <TestProgress /> */}
        <Grid container size={12} spacing={5} className={cn(isTestRunning && "relative z-5001")}>
          <Grid size={12}>
            <Typography variant='h6' component='h6' className='mb-3'>
              {graphType === "stress-strain" ? t("view-stress-strain-graph") : t("view-load-displacement-graph")}
            </Typography>
            <Card>
              <CardContent>
                <Box ref={chartElementRef} role='img' aria-label={t("view-live-chart", { graph: graphType === "stress-strain" ? t("listing-graph-stress-strain") : t("listing-graph-load-displacement") })} className='h-140 w-full' />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Typography variant='h6' component='h6' className='mb-3'>
              {t("view-results")}
            </Typography>
            <Grid size={12} container spacing={2.5}>
              {graphType === "stress-strain" && (
                <>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <Yeild className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>{t("view-yield-strength")}</Typography>
                        <Typography>
                          {typeof results?.yieldStrength === "number" ? `${results.yieldStrength} MPa` : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
                </>
              )}
              {graphType === "stress-strain" && (
                <>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <Tensile className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>{t("view-tensile-strength")}</Typography>
                        <Typography>
                          {typeof tensileStrength === "number" ? `${tensileStrength.toFixed(1)} MPa` : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
                </>
              )}
              {graphType === "stress-strain" && (
                <>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <ArrowUpWideNarrow className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>{t("view-elongation")}</Typography>
                        <Typography>
                          {typeof elongation === "number" ? `${elongation.toFixed(1)} %` : "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
                </>
              )}
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Card>
                  <CardContent className='flex flex-col gap-5'>
                    <Box className='flex flex-row gap-2'>
                      <WeightTilde className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>{t("view-max-load")}</Typography>
                        <Typography>
                          {typeof results?.maxLoad === "number" ? `${results.maxLoad.toFixed(1)} N` : "-"}
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
                      <RulerDimensionLine className='flex-none' />
                      <Box className='flex flex-col gap-1 flex-1'>
                        <Typography variant='subtitle1'>{t("view-max-distance")}</Typography>
                        <Typography>
                          {typeof results?.maxDistance === "number" ? `${results.maxDistance.toFixed(4)} mm` : "-"}
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
                        <Typography variant='subtitle1'>{t("view-test-duration")}</Typography>
                        <Typography>
                          {typeof results?.testDuration === "number" ? `${results.testDuration} s` : "-"}
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
