import { SyntheticEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Box, Breadcrumbs, Button, Card, CardContent, Grid, ListItemIcon, ListItemText, Menu, MenuItem, Tab, Tooltip, Typography } from "@mui/material";
import { CalendarCog, CalendarPlus, ChevronLeft, ChevronRight, Clock3, Ellipsis, Gauge, PencilRuler, Weight, WeightTilde, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import TestDataGrid from "@/components/data-grid/test-data-grid";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type PresetRecord, type TestRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import SaveRecordPdfMenuItem from "@/components/pdf/save-record-pdf-menu-item";
import usePrintReadiness from "@/hooks/use-print-readiness";
import { cn } from "@/lib/utils";
import { NoTestsFound } from "../../components/no-entity-found";

const latestTestColumns: GridColDef<TestRecord>[] = [
  {
    field: "name",
    headerName: "Name",
    align: "left",
    headerAlign: "left",
    minWidth: 180,
    sortable: false,
    renderCell: (params: GridRenderCellParams<TestRecord, string>) => (
      <Link to={`/tests/${params.row.id}`} className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'>
        {params.value}
      </Link>
    ),
  },
  {
    field: "createdAt",
    headerName: "Date",
    minWidth: 120,
    align: "right",
    headerAlign: "right",
    flex: 1,
    sortable: false,
    valueFormatter: (value) => new Date(Number(value)).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }),
  },
];

export default function Page({ printMode = false }: { printMode?: boolean }) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPreset, getTestsForPreset, getDataFields, deletePreset } = useDb();
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [preset, setPreset] = useState<PresetRecord | null>(null);
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [testFields, setTestFields] = useState<DataFieldDefinition[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Overview");
  usePrintReadiness(printMode, isLoading, loadError);

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    let cancelled = false;

    const loadPreset = async () => {
      setIsLoading(true);
      setLoadError(null);
      setPreset(null);

      if (!id) {
        setLoadError("Preset not found");
        setIsLoading(false);
        return;
      }

      try {
        const [record, presetTests, fields] = await Promise.all([getPreset(id), getTestsForPreset(id), getDataFields("Test")]);
        if (cancelled) return;

        setPreset(record ?? null);
        setTests(presetTests);
        setTestFields(fields);
        if (!record) setLoadError("Preset not found");
      } catch (error) {
        if (!cancelled) setLoadError(`Failed to load preset: ${String(error)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadPreset();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getPreset, getTestsForPreset, id]);

  useEffect(() => {
    if (loadError) showError(loadError);
  }, [loadError, showError]);

  const latestTests = tests.slice(0, 10);

  return (
    <>
      {isLoading ? (
        <LoadingFullScreen />
      ) : (
        <>
          <Box className='full-page-tabs'>
            <TabContext value={tabValue}>
              <TitleWrapper>
                <Grid size={12} container spacing={2.5}>
                  <Grid size={{ xs: 12, md: "grow" }}>
                    <Typography variant='h1' component='h1' className='mb-0'>
                      {preset?.name ?? "Preset"}
                    </Typography>
                    <Breadcrumbs>
                      <Link color='inherit' to={LINKS.home}>
                        {t("menu-home")}
                      </Link>
                      <Link color='inherit' to='/presets'>
                        {t("menu-presets")}
                      </Link>
                      {preset && <Typography variant='body2'>{preset.name}</Typography>}
                    </Breadcrumbs>
                  </Grid>
                  <Grid size={{ xs: 12, md: "auto" }} className={cn("print:hidden", tabValue !== "Overview" && "hidden")}>
                    <PopupState variant='popover' popupId='popup-menu'>
                      {(popupState) => (
                        <>
                          <Tooltip title='Actions' placement='bottom'>
                            <Button className='icon-only surface-standard' color='grey' variant='surface' {...bindTrigger(popupState)}>
                              <Box className='w-6 h-6 flex items-center justify-center '>
                                <Ellipsis size={16} />
                              </Box>
                            </Button>
                          </Tooltip>
                          <Menu
                            {...bindMenu(popupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                          >
                            <SaveRecordPdfMenuItem type='preset' id={id} name={preset?.name ?? "Preset"} closeMenu={popupState.close} />
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                if (!id) return;
                                requestDelete({
                                  title: "Delete Preset",
                                  message: preset?.name
                                    ? `Delete “${preset.name}”? This action cannot be undone.`
                                    : "Delete this preset? This action cannot be undone.",
                                  errorMessage: "Failed to delete preset:",
                                  onConfirm: async () => {
                                    await deletePreset(id);
                                    navigate("/presets");
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
                    <Tab label='Overview' value='Overview' />
                    <Tab label='Tests' value='Tests' />
                  </TabList>
                </Box>
              </TitleWrapper>

              <ContentWrapper>
                <TabPanel value='Overview'>
                  {!loadError && preset && (
                    <Grid size={12} container spacing={5} className='w-full'>
                      <Grid container spacing={5} size={{ lg: 8, xs: 12 }}>
                        <Grid size={12}>
                          <Typography variant='h6' component='h6' className='mb-3'>
                            Definition
                          </Typography>
                          <Card>
                            <CardContent className='flex flex-col gap-5'>
                              <Box className='flex flex-row gap-2'>
                                <PencilRuler className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Type</Typography>
                                  <Typography>{preset.type}</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <WeightTilde className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Preload</Typography>
                                  <Typography>{preset.preload} N</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <Weight className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Load</Typography>
                                  <Typography>{preset.load} N</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <Gauge className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Speed</Typography>
                                  <Typography>{preset.speed} mm/s</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <Clock3 className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Duration</Typography>
                                  <Typography>{preset.duration} s</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <CalendarPlus className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Created</Typography>
                                  <Typography>{new Date(preset.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <CalendarCog className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Updated</Typography>
                                  <Typography>{new Date(preset.updatedAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid container spacing={5} size={{ lg: 4, xs: 12 }}>
                        <Grid size={12}>
                          <Typography variant='h6' component='h6' className='mb-3'>
                            Latest Tests
                          </Typography>
                          <Card>
                            <CardContent>
                              {latestTests.length === 0 ? (
                                <NoTestsFound />
                              ) : (
                                <DataGrid
                                  autoHeight
                                  rows={latestTests}
                                  columns={latestTestColumns}
                                  hideFooter
                                  showToolbar={false}
                                  disableColumnMenu
                                  disableColumnSorting
                                  disableColumnFilter
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
                    </Grid>
                  )}
                </TabPanel>
                <TabPanel value='Tests'>
                  <Grid size={12} container spacing={5} className='w-full'>
                    <Grid size={12}>
                      <TestDataGrid tests={tests} dataFields={testFields} onTestsChange={setTests} />
                    </Grid>
                  </Grid>
                </TabPanel>
              </ContentWrapper>
            </TabContext>
          </Box>
        </>
      )}
      {dialog}
    </>
  );
}
