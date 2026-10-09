import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  hslToRgb,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { renderToStaticMarkup } from "react-dom/server";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import {
  ArrowUpFromLine,
  ArrowUpToLine,
  ArrowUpWideNarrow,
  Bookmark,
  CalendarCog,
  CalendarPlus,
  Crosshair,
  Diameter,
  Clock3,
  Ellipsis,
  FileDown,
  Gauge,
  Hexagon,
  PencilRuler,
  RulerDimensionLine,
  Shapes,
  Split,
  TicketPercent,
  Timer,
  WeightTilde,
  MoveVertical,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import ImageLightboxGallery from "@/components/data-fields/image-lightbox-gallery";
import { useDb, type DataFieldDefinition, type DynamicDataValue, type TestGraphPoint, type TestRecord, type UploadedImage } from "@/context/db-context";
import { LINKS } from "@/constants";
import useAppNotifications from "@/hooks/use-app-notifications";
import usePrintReadiness from "@/hooks/use-print-readiness";
import { useThemeContext } from "@/theme/theme-provider";
import { Tensile } from "@/icons/custom-lucide-icons/tensile";
import { Yeild } from "@/icons/custom-lucide-icons/yield";
import { Machine } from "@/icons/custom-lucide-icons/machine";
import { getTestGraphType, type TestGraphType } from "@/lib/db";

interface ComparisonTooltipPoint {
  id: string;
  color: string;
  x: number;
  y: number;
}

function resolveSeriesColor(color: string, cssVariables: CSSStyleDeclaration) {
  const variableName = color.match(/var\(--([^)]+)\)/)?.[1];
  if (!variableName) return color;
  const hslComponents = cssVariables.getPropertyValue(`--${variableName}`).trim();
  if (!hslComponents) return color;
  return hslToRgb(`hsl(${hslComponents.replace(/\s+/g, ", ")})`);
}

function ComparisonGraphTooltip({ points, graphType }: { points: ComparisonTooltipPoint[]; graphType: TestGraphType }) {
  const [xLabel, xUnit, yLabel, yUnit] = graphType === "stress-strain" ? ["Strain", "%", "Stress", "MPa"] : ["Displacement", "mm", "Load", "N"];
  return (
    <Box className='bg-background-paper shadow-darker-sm! outline-grey-50 rounded-lg p-5 outline-1 flex flex-col gap-2'>
      {[
        { label: xLabel, unit: xUnit, value: (point: ComparisonTooltipPoint) => point.x, digits: 3 },
        { label: yLabel, unit: yUnit, value: (point: ComparisonTooltipPoint) => point.y, digits: 2 },
      ].map(({ label, unit, value, digits }) => (
        <Box key={label} className='flex flex-row gap-2'>
          {label === "Stress" || label === "Load" ? <WeightTilde size={20} /> : label === "Strain" ? <TicketPercent size={20} /> : <RulerDimensionLine size={20} />}
          <Box className='flex min-w-0 flex-col gap-1'>
            <Typography variant='subtitle1' className='text-text-primary'>
              {label}
            </Typography>
            {points.map((point) => (
              <Box key={`${label}-${point.id}`} className='flex min-w-0 items-center gap-1.5'>
                <Box className='h-2.5 w-2.5 flex-none rounded-full' style={{ backgroundColor: point.color }} />
                <Typography className='text-text-secondary'>
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

function getSnapshotValue(values: Record<string, DynamicDataValue>, field: DataFieldDefinition) {
  return values[field.id] ?? values[field.name] ?? null;
}

function renderValue(value: DynamicDataValue | undefined, field?: DataFieldDefinition, printMode = false) {
  if (value == null) return "-";
  if (field?.type === "Image" && Array.isArray(value)) {
    return <ImageLightboxGallery images={value as UploadedImage[]} printMode={printMode} />;
  }
  if (typeof value === "boolean") return value ? "True" : "False";
  const text = Array.isArray(value)
    ? value.map((item) => (item && typeof item === "object" && "name" in item ? item.name : String(item))).join(", ")
    : String(value);
  return field?.unit ? `${text} ${field.unit}` : text;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function getNearestGraphPoint(points: TestGraphPoint[], strain: number) {
  return points.reduce<TestGraphPoint | undefined>((nearest, point) =>
    !nearest || Math.abs(point.x - strain) < Math.abs(nearest.x - strain) ? point : nearest,
  undefined);
}

function getTestGraphData(test: TestRecord, graphType: TestGraphType): TestGraphPoint[] {
  return graphType === "stress-strain"
    ? (test.results?.stressStrainData ?? []).map(({ strain, stress }) => ({ x: strain, y: stress }))
    : (test.results?.loadDisplacementData ?? []).map(({ displacement, load }) => ({ x: displacement, y: load }));
}

function ComparisonField({
  icon,
  label,
  tests,
  colors,
  valueForTest,
}: {
  icon: React.ReactNode;
  label: string;
  tests: TestRecord[];
  colors: string[];
  valueForTest: (test: TestRecord) => React.ReactNode;
}) {
  return (
    <Box className='flex flex-row gap-2'>
      {icon}
      <Box className='flex min-w-0 flex-1 flex-col gap-2'>
        <Typography variant='subtitle1'>{label}</Typography>
        <Box className='flex flex-col gap-1.5'>
          {tests.map((test, index) => (
            <Box key={test.id} className='flex min-w-0 items-start gap-2'>
              <Box
                aria-label={`${test.name} comparison color`}
                title={test.name}
                className='mt-1.5 h-2.5 w-2.5 flex-none rounded-full'
                style={{ backgroundColor: colors[index] }}
              />
              <Typography variant='body1' component='div' className='min-w-0 flex-1'>
                {valueForTest(test)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ComparisonCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Grid size={12}>
      <Typography variant='h6' component='h6' className='mb-3'>
        {title}
      </Typography>
      <Card>
        <CardContent className='flex flex-col gap-5'>{children}</CardContent>
      </Card>
    </Grid>
  );
}

function ComparisonDetails({
  tests,
  colors,
  testFields,
  specimenFields,
  graph,
  graphType,
  printMode,
}: {
  tests: TestRecord[];
  colors: string[];
  testFields: DataFieldDefinition[];
  specimenFields: DataFieldDefinition[];
  graph: React.ReactNode;
  graphType: TestGraphType;
  printMode: boolean;
}) {
  const targetCount = Math.max(1, ...tests.map((test) => test.presetSnapshot.targets?.length ?? 0));

  return (
    <Grid container size={12} spacing={5}>
      <Grid container size={{ lg: 8, xs: 12 }} spacing={5}>
        <Grid size={12}>
          <Typography variant='h6' component='h6' className='mb-3'>
            {graphType === "stress-strain" ? "Stress Strain Graph" : "Load Displacement Graph"}
          </Typography>
          <Card>
            <CardContent>{graph}</CardContent>
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
                    <Box className='flex min-w-0 flex-1 flex-col gap-1'>
                      <Typography variant='subtitle1'>Yield Strength</Typography>
                      {tests.map((test, index) => (
                        <Box key={test.id} className='flex min-w-0 items-start gap-2'>
                          <Box
                            aria-label={`${test.name} comparison color`}
                            title={test.name}
                            className='mt-1.5 h-2.5 w-2.5 flex-none rounded-full'
                            style={{ backgroundColor: colors[index] }}
                          />
                          <Typography variant='body1' component='div' className='min-w-0 flex-1'>
                            {typeof test.results?.yieldStrength === "number" ? `${test.results.yieldStrength} (MPa)` : "-"}
                          </Typography>
                        </Box>
                      ))}
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
                    <Box className='flex min-w-0 flex-1 flex-col gap-1'>
                      <Typography variant='subtitle1'>Tensile Strength</Typography>
                      {tests.map((test, index) => (
                        <Box key={test.id} className='flex min-w-0 items-start gap-2'>
                          <Box
                            aria-label={`${test.name} comparison color`}
                            title={test.name}
                            className='mt-1.5 h-2.5 w-2.5 flex-none rounded-full'
                            style={{ backgroundColor: colors[index] }}
                          />
                          <Typography variant='body1' component='div' className='min-w-0 flex-1'>
                            {typeof test.results?.tensileStrength === "number" ? `${test.results.tensileStrength} (MPa)` : "-"}
                          </Typography>
                        </Box>
                      ))}
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
                    <Box className='flex min-w-0 flex-1 flex-col gap-1'>
                      <Typography variant='subtitle1'>Elongation</Typography>
                      {tests.map((test, index) => (
                        <Box key={test.id} className='flex min-w-0 items-start gap-2'>
                          <Box
                            aria-label={`${test.name} comparison color`}
                            title={test.name}
                            className='mt-1.5 h-2.5 w-2.5 flex-none rounded-full'
                            style={{ backgroundColor: colors[index] }}
                          />
                          <Typography variant='body1' component='div' className='min-w-0 flex-1'>
                            {typeof test.results?.elongation === "number" ? `${test.results.elongation} (%)` : "-"}
                          </Typography>
                        </Box>
                      ))}
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
                    <Box className='flex min-w-0 flex-1 flex-col gap-1'>
                      <Typography variant='subtitle1'>First Length</Typography>
                      {tests.map((test, index) => (
                        <Box key={test.id} className='flex min-w-0 items-start gap-2'>
                          <Box
                            aria-label={`${test.name} comparison color`}
                            title={test.name}
                            className='mt-1.5 h-2.5 w-2.5 flex-none rounded-full'
                            style={{ backgroundColor: colors[index] }}
                          />
                          <Typography variant='body1' component='div' className='min-w-0 flex-1'>
                            {typeof test.results?.firstLength === "number" ? `${test.results.firstLength} (mm)` : "-"}
                          </Typography>
                        </Box>
                      ))}
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
                    <Box className='flex min-w-0 flex-1 flex-col gap-1'>
                      <Typography variant='subtitle1'>Last Length</Typography>
                      {tests.map((test, index) => (
                        <Box key={test.id} className='flex min-w-0 items-start gap-2'>
                          <Box
                            aria-label={`${test.name} comparison color`}
                            title={test.name}
                            className='mt-1.5 h-2.5 w-2.5 flex-none rounded-full'
                            style={{ backgroundColor: colors[index] }}
                          />
                          <Typography variant='body1' component='div' className='min-w-0 flex-1'>
                            {typeof test.results?.lastLength === "number" ? `${test.results.lastLength} (mm)` : "-"}
                          </Typography>
                        </Box>
                      ))}
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
                    <Box className='flex min-w-0 flex-1 flex-col gap-1'>
                      <Typography variant='subtitle1'>Test Duration</Typography>
                      {tests.map((test, index) => (
                        <Box key={test.id} className='flex min-w-0 items-start gap-2'>
                          <Box
                            aria-label={`${test.name} comparison color`}
                            title={test.name}
                            className='mt-1.5 h-2.5 w-2.5 flex-none rounded-full'
                            style={{ backgroundColor: colors[index] }}
                          />
                          <Typography variant='body1' component='div' className='min-w-0 flex-1'>
                            {typeof test.results?.testDuration === "number" ? `${test.results.testDuration} (s)` : "-"}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <ComparisonCard title='Preset'>
          <ComparisonField icon={<Bookmark className='flex-none' />} label='Name' tests={tests} colors={colors} valueForTest={(test) => test.presetSnapshot.name} />
          <ComparisonField icon={<PencilRuler className='flex-none' />} label='Type' tests={tests} colors={colors} valueForTest={(test) => test.presetSnapshot.type} />
          <ComparisonField
            icon={<Gauge className='flex-none' />}
            label='Speed'
            tests={tests}
            colors={colors}
            valueForTest={(test) => (typeof test.presetSnapshot.speed === "number" ? `${test.presetSnapshot.speed} mm/s` : "-")}
          />
          <ComparisonField
            icon={<Split className='flex-none' />}
            label='Base'
            tests={tests}
            colors={colors}
            valueForTest={(test) => test.presetSnapshot.base ?? "-"}
          />
          {Array.from({ length: targetCount }, (_, index) => (
            <ComparisonField
              key={`preset-target-${index}`}
              icon={<Crosshair className='flex-none' />}
              label={`Target ${index + 1}`}
              tests={tests}
              colors={colors}
              valueForTest={(test) => {
                const target = test.presetSnapshot.targets?.[index];
                if (typeof target !== "number") return "-";
                const unit = test.presetSnapshot.base === "Force" ? "N" : test.presetSnapshot.base === "Distance" ? "mm" : "";
                return unit ? `${target} ${unit}` : String(target);
              }}
            />
          ))}
          <ComparisonField icon={<Clock3 className='flex-none' />} label='Mock Duration' tests={tests} colors={colors} valueForTest={(test) => `${test.presetSnapshot.duration} s`} />
        </ComparisonCard>
        <ComparisonCard title='Definition'>
          <ComparisonField icon={<Bookmark className='flex-none' />} label='Name' tests={tests} colors={colors} valueForTest={(test) => test.name} />
          <ComparisonField icon={<Machine className='flex-none' />} label='Machine IP' tests={tests} colors={colors} valueForTest={(test) => test.machineIP ?? "-"} />
          {testFields.map((field) => (
            <ComparisonField
              key={field.id}
              icon={field.icon ? <DynamicIcon name={field.icon} className='flex-none' /> : <Hexagon className='flex-none' />}
              label={field.name}
              tests={tests}
              colors={colors}
              valueForTest={(test) => renderValue(getSnapshotValue(test.customData, field), field, printMode)}
            />
          ))}
          <ComparisonField icon={<CalendarPlus className='flex-none' />} label='Created' tests={tests} colors={colors} valueForTest={(test) => formatDate(test.createdAt)} />
          <ComparisonField icon={<CalendarCog className='flex-none' />} label='Updated' tests={tests} colors={colors} valueForTest={(test) => formatDate(test.updatedAt)} />
        </ComparisonCard>
      </Grid>
      <Grid container size={{ lg: 4, xs: 12 }} spacing={5}>
        <ComparisonCard title='Specimen'>
          <ComparisonField icon={<Hexagon className='flex-none' />} label='Name' tests={tests} colors={colors} valueForTest={(test) => test.specimenSnapshot.name} />
          <ComparisonField
            icon={<Shapes className='flex-none' />}
            label='Geometry'
            tests={tests}
            colors={colors}
            valueForTest={(test) => test.specimenSnapshot.geometry ?? "Not Specified"}
          />
          <ComparisonField
            icon={<Diameter className='flex-none' />}
            label='Diameter'
            tests={tests}
            colors={colors}
            valueForTest={(test) =>
              test.specimenSnapshot.geometry === "Cylindrical" && test.specimenSnapshot.diameter != null ? `${test.specimenSnapshot.diameter} mm` : "-"
            }
          />
          <ComparisonField
            icon={<RulerDimensionLine className='flex-none' />}
            label='Side 1'
            tests={tests}
            colors={colors}
            valueForTest={(test) =>
              test.specimenSnapshot.geometry === "Rectangular" && test.specimenSnapshot.side1 != null ? `${test.specimenSnapshot.side1} mm` : "-"
            }
          />
          <ComparisonField
            icon={<RulerDimensionLine className='flex-none rotate-90' />}
            label='Side 2'
            tests={tests}
            colors={colors}
            valueForTest={(test) =>
              test.specimenSnapshot.geometry === "Rectangular" && test.specimenSnapshot.side2 != null ? `${test.specimenSnapshot.side2} mm` : "-"
            }
          />
          <ComparisonField
            icon={<MoveVertical className='flex-none' />}
            label='Height'
            tests={tests}
            colors={colors}
            valueForTest={(test) =>
              test.specimenSnapshot.geometry !== "Not Specified" && test.specimenSnapshot.height != null ? `${test.specimenSnapshot.height} mm` : "-"
            }
          />
          {specimenFields.map((field) => (
            <ComparisonField
              key={field.id}
              icon={field.icon ? <DynamicIcon name={field.icon} className='flex-none' /> : <Hexagon className='flex-none' />}
              label={field.name}
              tests={tests}
              colors={colors}
              valueForTest={(test) => renderValue(getSnapshotValue(test.specimenSnapshot.customData, field), field, printMode)}
            />
          ))}
        </ComparisonCard>
      </Grid>
    </Grid>
  );
}

export default function CompareTestsPage({ printMode = false }: { printMode?: boolean }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const { getTest, getDataFields } = useDb();
  const { showError, showPdfCreating, showPdfSaved } = useAppNotifications();
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [testFields, setTestFields] = useState<DataFieldDefinition[]>([]);
  const [specimenFields, setSpecimenFields] = useState<DataFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [missingCount, setMissingCount] = useState(0);
  const requestedIds = useMemo(() => Array.from(new Set(searchParams.getAll("testId").filter(Boolean))), [searchParams]);
  const graphType = tests.length ? getTestGraphType(tests[0].specimenSnapshot.geometry) : "stress-strain";
  usePrintReadiness(printMode, isLoading, loadError);
  const colors = useMemo(() => {
    const cssVariables = getComputedStyle(document.documentElement);
    const fixed = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette["accent-1"].main,
      theme.palette["accent-2"].main,
      theme.palette["accent-3"].main,
      theme.palette["accent-4"].main,
    ].map((color) => resolveSeriesColor(color, cssVariables));
    return tests.map((test, index) => fixed[index] ?? getExtraSeriesColor(test.id, isDarkMode));
  }, [isDarkMode, tests, theme.palette]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      setTests([]);
      setMissingCount(0);
      if (requestedIds.length < 2) {
        setLoadError("Select at least two tests from the Tests list to compare them.");
        setIsLoading(false);
        return;
      }
      try {
        const [records, currentTestFields, currentSpecimenFields] = await Promise.all([
          Promise.all(requestedIds.map((id) => getTest(id))),
          getDataFields("Test"),
          getDataFields("Specimen"),
        ]);
        if (cancelled) return;
        const foundTests = records.filter((record): record is TestRecord => Boolean(record));
        setTests(foundTests);
        setMissingCount(records.length - foundTests.length);
        setTestFields(currentTestFields);
        setSpecimenFields(currentSpecimenFields);
        if (foundTests.length < 2) setLoadError("At least two selected tests must still exist to compare them.");
        else if (new Set(foundTests.map((test) => getTestGraphType(test.specimenSnapshot.geometry))).size > 1) {
          if (printMode) setLoadError("Cannot generate a comparison PDF for tests with different graph types.");
          else navigate("/tests", { replace: true });
        }
      } catch (error) {
        if (!cancelled) setLoadError(`Failed to load comparison data: ${String(error)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getTest, navigate, printMode, requestedIds]);

  useEffect(() => {
    if (isLoading || loadError || !chartElementRef.current) return;
    const chart = echarts.init(chartElementRef.current);
    chartRef.current = chart;
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartElementRef.current);
    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [isLoading, loadError]);

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
        axisPointer: { type: "cross", snap: false, lineStyle: { type: "solid", color: chartColors.divider } },
        formatter: (params) => {
          if (!Array.isArray(params)) return "";
          const axisValue = params.find((param) => param.axisDimension === "x")?.axisValue ?? params[0]?.axisValue;
          const x = Number(axisValue);
          if (!Number.isFinite(x)) return "";
          const points = tests.flatMap((test, index): ComparisonTooltipPoint[] => {
            const nearestPoint = getNearestGraphPoint(getTestGraphData(test, graphType), x);
            return nearestPoint ? [{ id: test.id, color: colors[index], x: nearestPoint.x, y: nearestPoint.y }] : [];
          });
          return points.length ? renderToStaticMarkup(<ComparisonGraphTooltip points={points} graphType={graphType} />) : "";
        },
      },
      dataZoom: [{ type: "inside", filterMode: "none", zoomOnMouseWheel: true, moveOnMouseMove: true, moveOnMouseWheel: false }],
      xAxis: {
        type: "value",
        axisPointer: {
          type: "line",
          lineStyle: { type: "solid", color: chartColors.divider },
          label: { backgroundColor: chartColors.hoverLabelBackground, color: chartColors.secondaryText },
        },
        name: graphType === "stress-strain" ? "Strain (%)" : "Displacement (mm)",
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
        name: graphType === "stress-strain" ? "Stress (MPa)" : "Load (N)",
        nameLocation: "middle",
        nameGap: 48,
        nameTextStyle: { color: chartColors.secondaryText },
        axisLabel: { color: chartColors.secondaryText },
        axisLine: { lineStyle: { color: chartColors.divider } },
        splitLine: { lineStyle: { color: chartColors.divider, type: "dashed" } },
      },
      series: [
        ...tests.map((test, index) => ({
          name: test.name,
          type: "line" as const,
          showSymbol: false,
          symbol: "circle",
          symbolSize: 8,
          emphasis: { scale: true },
          lineStyle: { width: 2, color: colors[index] },
          itemStyle: { color: colors[index] },
          data: getTestGraphData(test, graphType).map(({ x, y }) => [x, y]),
        })),
        {
          id: "hover-markers",
          type: "scatter" as const,
          data: [],
          symbol: "circle",
          symbolSize: 10,
          silent: true,
          tooltip: { show: false },
          z: 10,
        },
      ],
    };
    const chart = chartRef.current;
    const chartElement = chartElementRef.current;
    if (!chart || !chartElement) return;

    const onFinished = () => {
      if (printMode) chartElement.dataset.printAssetsLoading = "false";
      chart.off("finished", onFinished);
    };
    if (printMode) {
      chartElement.dataset.printAssetsLoading = "true";
      chart.on("finished", onFinished);
    }
    const updateMarkers = (x: number) => {
      const markerData = tests.flatMap((test, index) => {
        const nearestPoint = getNearestGraphPoint(getTestGraphData(test, graphType), x);
        return nearestPoint
          ? [{ value: [nearestPoint.x, nearestPoint.y], itemStyle: { color: colors[index], borderWidth: 0 } }]
          : [];
      });
      chart.setOption({ series: [{ id: "hover-markers", data: markerData }] });
    };
    const handleAxisPointer = (event: unknown) => {
      const axesInfo = (event as { axesInfo?: Array<{ axisDim?: string; value?: unknown }> }).axesInfo;
      const xAxis = axesInfo?.find((axis) => axis.axisDim === "x");
      const x = Number(xAxis?.value);
      if (Number.isFinite(x)) updateMarkers(x);
    };
    const clearMarkers = () => chart.setOption({ series: [{ id: "hover-markers", data: [] }] });

    chart.setOption(option, { notMerge: true, lazyUpdate: !printMode });
    chart.on("updateAxisPointer", handleAxisPointer);
    chart.on("globalout", clearMarkers);
    return () => {
      chart.off("finished", onFinished);
      chart.off("updateAxisPointer", handleAxisPointer);
      chart.off("globalout", clearMarkers);
    };
  }, [colors, graphType, isDarkMode, printMode, tests]);

  return (
    <>
      <TitleWrapper>
        <Box className='flex w-full flex-wrap items-start justify-between gap-3'>
          <Box>
            <Typography variant='h1' component='h1' className='mb-0'>
              Compare Tests
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                Home
              </Link>
              <Link color='inherit' to='/tests'>
                Tests
              </Link>
              <Typography variant='body2'>Compare</Typography>
            </Breadcrumbs>
          </Box>
          {!printMode && !isLoading && !loadError && tests.length >= 2 && (
            <PopupState variant='popover' popupId='comparison-actions-menu'>
              {(popupState) => (
                <>
                  <Tooltip title='Actions' placement='bottom'>
                    <Button className='icon-only surface-standard' color='grey' variant='surface' {...bindTrigger(popupState)}>
                      <Box className='w-6 h-6 flex items-center justify-center'>
                        <Ellipsis size={16} />
                      </Box>
                    </Button>
                  </Tooltip>
                  <Menu
                    {...bindMenu(popupState)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem
                      onClick={() => {
                        popupState.close();
                        let hidePdfCreating: (() => void) | undefined;
                        const removePdfCreatingListener = window.electronAPI.onPdfCreating(() => {
                          hidePdfCreating = showPdfCreating();
                        });
                        void window.electronAPI
                          .saveTestComparisonPdf({
                            testIds: tests.map((test) => test.id),
                            name: `Test Comparison ${tests.length} Tests`,
                          })
                          .then((result) => {
                            if (!result.canceled && result.filePath) showPdfSaved(result.filePath);
                          })
                          .catch((error: unknown) => showError(`Failed to save PDF: ${String(error)}`))
                          .finally(() => {
                            removePdfCreatingListener();
                            hidePdfCreating?.();
                          });
                      }}
                    >
                      <ListItemIcon>
                        <FileDown size={16} />
                      </ListItemIcon>
                      <ListItemText>Save as PDF</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </PopupState>
          )}
        </Box>
      </TitleWrapper>
      <ContentWrapper>
        <Box className='flex w-full flex-col gap-4'>
          {isLoading ? (
            <Box className='flex min-h-64 items-center justify-center'>
              <CircularProgress />
            </Box>
          ) : loadError ? (
            <Alert
              severity='error'
              action={
                <Button color='inherit' size='small' onClick={() => navigate("/tests")}>
                  Open Tests
                </Button>
              }
            >
              {loadError}
            </Alert>
          ) : (
            <>
              {missingCount > 0 && (
                <Alert severity='warning'>
                  {missingCount} selected test{missingCount === 1 ? " was" : "s were"} not found and {missingCount === 1 ? "has" : "have"} been omitted.
                </Alert>
              )}
              <ComparisonDetails
                tests={tests}
                colors={colors}
                testFields={testFields}
                specimenFields={specimenFields}
                graphType={graphType}
                printMode={printMode}
                graph={
                  tests.some((test) => getTestGraphData(test, graphType).length > 0) ? (
                    <Box
                      ref={chartElementRef}
                      role='img'
                      aria-label={`Overlaid ${graphType === "stress-strain" ? "stress-strain" : "load-displacement"} curves for selected tests`}
                      className='h-140 w-full min-w-0'
                      data-print-assets-loading={printMode ? "true" : undefined}
                    />
                  ) : (
                    <Alert severity='info'>No saved {graphType === "stress-strain" ? "stress-strain" : "load-displacement"} data is available for these tests.</Alert>
                  )
                }
              />
            </>
          )}
        </Box>
      </ContentWrapper>
    </>
  );
}
