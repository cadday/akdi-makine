import { useCallback, useEffect, useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Box, Breadcrumbs, Button, Card, CardContent, Grid, ListItemIcon, ListItemText, Menu, MenuItem, Tab, Tooltip, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowSpacingParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Columns,
  Ellipsis,
  EllipsisVertical,
  EyeClosed,
  Filter,
  Gauge,
  Hexagon,
  PencilRuler,
  Tag,
  Trash,
  Weight,
  WeightTilde,
  X,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import ImageLightboxGallery from "@/components/data-fields/image-lightbox-gallery";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import TestDefinition from "@/pages/app/tests/components/test-definition";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type DynamicDataValue, type TestRecord, type UploadedImage } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";
import TestResultsMachine from "../components/test-results-machine";
import { DataGridListingToolbar } from "@/components/data-grid/data-grid-listing-toolbar";
import { DataGridPaginationFullPage } from "@/components/data-grid/data-grid-pagination";
import SearchInput from "@/components/layout/search/search";

interface RawGraphDataRow {
  id: number;
  strain: number;
  stress: number;
}

const rawGraphDataColumns: GridColDef<RawGraphDataRow>[] = [
  {
    field: "strain",
    headerName: "Strain (%)",
    minWidth: 160,
    flex: 1,
    type: "number",
    align: "left",
    headerAlign: "left",
    renderCell: (params) => <Box className='ps-4'>{params.value}</Box>,
  },
  { field: "stress", headerName: "Stress (MPa)", minWidth: 160, flex: 1, type: "number", align: "left", headerAlign: "left" },
];

export default function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTest, getDataFields, deleteTest } = useDb();
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [test, setTest] = useState<TestRecord | null>(null);
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [specimenFields, setSpecimenFields] = useState<DataFieldDefinition[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Result");
  const getRowSpacing = useCallback((params: GridRowSpacingParams) => ({ top: params.isFirstVisible ? 0 : 5, bottom: 5 }), []);

  useEffect(() => {
    let cancelled = false;
    const loadTest = async () => {
      setIsLoading(true);
      setLoadError(null);
      setTest(null);
      setSpecimenFields([]);

      if (!id) {
        setLoadError("Test not found");
        setIsLoading(false);
        return;
      }

      try {
        const record = await getTest(id);
        if (!record) {
          if (!cancelled) setLoadError("Test not found");
          return;
        }

        const [testFields, linkedSpecimenFields] = await Promise.all([getDataFields("Test"), getDataFields("Specimen")]);
        if (cancelled) return;

        setTest(record);
        setFields(testFields);
        setSpecimenFields(linkedSpecimenFields);
      } catch (error) {
        if (!cancelled) setLoadError(`Failed to load test: ${String(error)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadTest();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getTest, id]);

  useEffect(() => {
    if (loadError) showError(loadError);
  }, [loadError, showError]);

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const renderValue = (field: DataFieldDefinition, value: DynamicDataValue) => {
    if (value == null) return "-";
    if (field.type === "Image" && Array.isArray(value)) return <ImageLightboxGallery images={value as UploadedImage[]} />;
    if (typeof value === "boolean") return value ? "True" : "False";
    const displayValue = Array.isArray(value)
      ? value.map((item) => (item && typeof item === "object" && "name" in item ? item.name : String(item))).join(", ")
      : String(value);
    return field.unit ? `${displayValue} ${field.unit}` : displayValue;
  };

  const specimen = test?.specimenSnapshot ?? null;
  const preset = test?.presetSnapshot ?? null;

  return (
    <>
      {isLoading ? (
        <LoadingFullScreen />
      ) : (
        <Box className='full-page-tabs'>
          <TabContext value={tabValue}>
            <TitleWrapper>
              <Grid size={12} container spacing={2.5}>
                <Grid size={{ xs: 12, md: "grow" }}>
                  <Typography variant='h1' component='h1' className='mb-0'>
                    {test?.name ?? "Test"}
                  </Typography>
                  <Breadcrumbs>
                    <Link color='inherit' to={LINKS.home}>
                      {t("menu-home")}
                    </Link>
                    <Link color='inherit' to='/tests'>
                      {t("menu-tests")}
                    </Link>
                    {test && <Typography variant='body2'>{test.name}</Typography>}
                  </Breadcrumbs>
                </Grid>
                <Grid size={{ xs: 12, md: "auto" }}>
                  <PopupState variant='popover' popupId='test-actions-menu'>
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
                              if (!id) return;
                              requestDelete({
                                title: "Delete Test",
                                message: test?.name
                                  ? `Delete “${test.name}”? This action cannot be undone.`
                                  : "Delete this test? This action cannot be undone.",
                                errorMessage: "Failed to delete test:",
                                onConfirm: async () => {
                                  await deleteTest(id);
                                  navigate("/tests");
                                },
                              });
                            }}
                            className='hover:bg-error-light/10 hover:text-error'
                          >
                            <ListItemIcon>
                              <X size={16} />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </PopupState>
                </Grid>
              </Grid>

              <Box>
                <TabList
                  onChange={handleTabChange}
                  allowScrollButtonsMobile
                  variant='standard'
                  slots={{
                    endScrollButtonIcon: () => <ChevronRight size={12} />,
                    startScrollButtonIcon: () => <ChevronLeft size={12} />,
                  }}
                >
                  <Tab label='Result' value='Result' />
                  <Tab label='Raw Test Data' value='Raw Test Data' />
                </TabList>
              </Box>
            </TitleWrapper>

            <ContentWrapper>
              <TabPanel value='Result'>
                {!loadError && test && (
                  <Grid size={12} container spacing={5} className='w-full'>
                    <Grid container spacing={5} size={{ lg: 4, xs: 12 }}>
                      <Grid size={12}>
                        <Typography variant='h6' component='h6' className='mb-3'>
                          Specimen
                        </Typography>
                        <Card>
                          <CardContent className='flex flex-col gap-5'>
                            {specimen ? (
                              <>
                                <Box className='flex flex-row gap-2'>
                                  <Hexagon />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Name</Typography>
                                    <Typography>{specimen.name}</Typography>
                                  </Box>
                                </Box>
                                {specimenFields.map((field) => (
                                  <Box key={field.id} className='flex flex-row gap-2'>
                                    {field.icon ? <DynamicIcon name={field.icon} /> : <Hexagon />}
                                    <Box className='flex flex-col gap-1'>
                                      <Typography variant='subtitle1'>{field.name}</Typography>
                                      {renderValue(field, specimen.customData?.[field.id] ?? specimen.customData?.[field.name] ?? null)}
                                    </Box>
                                  </Box>
                                ))}
                              </>
                            ) : (
                              <Typography color='textSecondary'>No related specimen</Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    <Grid container spacing={5} size={{ lg: 8, xs: 12 }}>
                      <TestResultsMachine
                        test={test}
                        onResultsSaved={(results) => {
                          setTest((current) => (current ? { ...current, results, updatedAt: Date.now() } : current));
                        }}
                      />

                      <Grid size={12}>
                        <Typography variant='h6' component='h6' className='mb-3'>
                          Preset
                        </Typography>
                        <Card>
                          <CardContent className='flex flex-col gap-5'>
                            {preset ? (
                              <>
                                <Box className='flex flex-row gap-2'>
                                  <Tag />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Name</Typography>
                                    <Typography>{preset.name}</Typography>
                                  </Box>
                                </Box>
                                <Box className='flex flex-row gap-2'>
                                  <PencilRuler />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Type</Typography>
                                    <Typography>{preset.type}</Typography>
                                  </Box>
                                </Box>
                                <Box className='flex flex-row gap-2'>
                                  <WeightTilde />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Preload</Typography>
                                    <Typography>{preset.preload} N</Typography>
                                  </Box>
                                </Box>
                                <Box className='flex flex-row gap-2'>
                                  <Weight />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Load</Typography>
                                    <Typography>{preset.load} N</Typography>
                                  </Box>
                                </Box>
                                <Box className='flex flex-row gap-2'>
                                  <Gauge />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Speed</Typography>
                                    <Typography>{preset.speed} mm/s</Typography>
                                  </Box>
                                </Box>
                                <Box className='flex flex-row gap-2'>
                                  <Clock3 />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Duration</Typography>
                                    <Typography>{preset.duration} s</Typography>
                                  </Box>
                                </Box>
                              </>
                            ) : (
                              <Typography color='textSecondary'>No related preset</Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>

                      <TestDefinition test={test} fields={fields} onTestUpdated={setTest} />
                    </Grid>
                  </Grid>
                )}
              </TabPanel>
              <TabPanel value='Raw Test Data'>
                {!loadError && test && (
                  <DataGrid
                    autoHeight
                    rows={(test.results?.graphData ?? []).map((point, index) => ({ id: index, strain: point.x, stress: point.y }))}
                    columns={rawGraphDataColumns}
                    initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
                    getRowSpacing={getRowSpacing}
                    pageSizeOptions={[10, 20, 50, 100]}
                    columnHeaderHeight={40}
                    disableRowSelectionOnClick
                    className='full-page dense border-none'
                    pagination
                    showToolbar
                    slotProps={{ panel: { className: "mt-1!" } }}
                    slots={{
                      basePagination: DataGridPaginationFullPage,
                      columnSortedDescendingIcon: () => <ArrowDown size={16} />,
                      columnSortedAscendingIcon: () => <ArrowUp size={16} />,
                      columnFilteredIcon: () => <Filter size={18} />,
                      columnReorderIcon: () => <ChevronLeft />,
                      columnMenuIcon: () => <EllipsisVertical size={16} />,
                      columnMenuSortAscendingIcon: ArrowUp,
                      columnMenuSortDescendingIcon: ArrowDown,
                      columnMenuFilterIcon: Filter,
                      columnMenuHideIcon: EyeClosed,
                      columnMenuClearIcon: X,
                      columnMenuManageColumnsIcon: Columns,
                      filterPanelDeleteIcon: X,
                      filterPanelRemoveAllIcon: Trash,
                      quickFilterIcon: () => <SearchInput />,
                      quickFilterClearIcon: () => <X />,
                      toolbar: DataGridListingToolbar,
                    }}
                    classes={{ main: "overflow-visible" }}
                  />
                )}
              </TabPanel>
            </ContentWrapper>
          </TabContext>
        </Box>
      )}
      {dialog}
    </>
  );
}
