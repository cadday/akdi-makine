import { SyntheticEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import ImageLightboxGallery from "@/components/data-fields/image-lightbox-gallery";
import { LINKS } from "@/constants";
import { Box, Breadcrumbs, Button, Card, CardContent, Grid, ListItemIcon, ListItemText, Menu, MenuItem, Tab, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import TestDataGrid from "@/pages/app/tests/components/test-data-grid";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import { useDb, type DataFieldDefinition, type DynamicDataValue, type SpecimenRecord, type TestRecord, type UploadedImage } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import { DynamicIcon } from "lucide-react/dynamic";
import { CalendarCog, CalendarPlus, ChevronLeft, ChevronRight, Diameter, Ellipsis, Hexagon, MoveVertical, RulerDimensionLine, Shapes, X } from "lucide-react";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";
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
  const { getSpecimen, getDataFields, getTestsForSpecimen, deleteSpecimen } = useDb();
  const [specimen, setSpecimen] = useState<SpecimenRecord | null>(null);
  const [specimenTests, setSpecimenTests] = useState<TestRecord[]>([]);
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [testFields, setTestFields] = useState<DataFieldDefinition[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  usePrintReadiness(printMode, isLoading, loadError);

  useEffect(() => {
    let cancelled = false;

    const loadSpecimen = async () => {
      setIsLoading(true);
      setLoadError(null);
      if (!id) {
        setSpecimen(null);
        setLoadError("Specimen not found");
        setIsLoading(false);
        return;
      }

      setSpecimen(null);

      try {
        const [record, dataFields, tests, testDataFields] = await Promise.all([
          getSpecimen(id),
          getDataFields("Specimen"),
          getTestsForSpecimen(id),
          getDataFields("Test"),
        ]);
        if (cancelled) return;

        setSpecimen(record ?? null);
        setFields(dataFields);
        setSpecimenTests(tests);
        setTestFields(testDataFields);
        if (!record) setLoadError("Specimen not found");
      } catch (error) {
        if (!cancelled) setLoadError(`Failed to load specimen: ${String(error)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadSpecimen();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getSpecimen, getTestsForSpecimen, id]);

  useEffect(() => {
    if (loadError) showError(loadError);
  }, [loadError, showError]);

  const renderValue = (field: DataFieldDefinition, value: DynamicDataValue) => {
    if (value == null) return "-";
    if (field.type === "Image" && Array.isArray(value)) {
      return <ImageLightboxGallery images={value as UploadedImage[]} printMode={printMode} />;
    }
    if (typeof value === "boolean") return value ? "True" : "False";
    const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
    return field.unit ? `${displayValue} ${field.unit}` : displayValue;
  };

  const latestTests = specimenTests.slice(0, 10);
  const [tabValue, setTabValue] = useState("Overview");
  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

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
                      {specimen?.name ?? "Specimen"}
                    </Typography>
                    <Breadcrumbs>
                      <Link color='inherit' to={LINKS.home}>
                        {t("menu-home")}
                      </Link>
                      <Link color='inherit' to='/specimens'>
                        {t("menu-specimens")}
                      </Link>
                      {specimen && <Typography variant='body2'>{specimen.name}</Typography>}
                    </Breadcrumbs>
                  </Grid>
                  <Grid size={{ xs: 12, md: "auto" }} className={cn("print:hidden", tabValue !== "Overview" && "hidden")}>
                    <PopupState variant='popover' popupId='specimen-actions-menu'>
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
                            <SaveRecordPdfMenuItem type='specimen' id={id} name={specimen?.name ?? "Specimen"} closeMenu={popupState.close} />
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                if (!id) return;
                                requestDelete({
                                  title: "Delete Specimen",
                                  message: specimen?.name
                                    ? `Delete “${specimen.name}”? This action cannot be undone.`
                                    : "Delete this specimen? This action cannot be undone.",
                                  errorMessage: "Failed to delete specimen:",
                                  onConfirm: async () => {
                                    await deleteSpecimen(id);
                                    navigate("/specimens");
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
                      endScrollButtonIcon: () => {
                        return <ChevronRight size={12} />;
                      },
                      startScrollButtonIcon: () => {
                        return <ChevronLeft size={12} />;
                      },
                    }}
                  >
                    <Tab label='Overview' value='Overview' />
                    <Tab label='Tests' value='Tests' />
                  </TabList>
                </Box>
              </TitleWrapper>

              <ContentWrapper>
                <TabPanel value='Overview'>
                  {!loadError && specimen && (
                    <Grid size={12} container spacing={5} className='w-full'>
                      <Grid container spacing={5} size={{ lg: 8, xs: 12 }}>
                        <Grid size={12}>
                          <Typography variant='h6' component='h6' className='mb-3'>
                            Definition
                          </Typography>
                          <Card>
                            <CardContent className='flex flex-col gap-5'>
                              <Box className='flex flex-row gap-2'>
                                <Shapes className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Geometry</Typography>
                                  <Typography>{specimen.geometry ?? "Not Specified"}</Typography>
                                </Box>
                              </Box>
                              {specimen.geometry === "Cylindrical" && (
                                <>
                                  <Box className='flex flex-row gap-2'>
                                    <Diameter className='flex-none' />
                                    <Box className='flex flex-col gap-1'>
                                      <Typography variant='subtitle1'>Diameter</Typography>
                                      <Typography>{specimen.diameter} mm</Typography>
                                    </Box>
                                  </Box>
                                  <Box className='flex flex-row gap-2'>
                                    <MoveVertical className='flex-none' />
                                    <Box className='flex flex-col gap-1'>
                                      <Typography variant='subtitle1'>Height</Typography>
                                      <Typography>{specimen.height} mm</Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                              {specimen.geometry === "Rectangular" && (
                                <>
                                  <Box className='flex flex-row gap-2'>
                                    <RulerDimensionLine className='flex-none' />
                                    <Box className='flex flex-col gap-1'>
                                      <Typography variant='subtitle1'>Side 1</Typography>
                                      <Typography>{specimen.side1} mm</Typography>
                                    </Box>
                                  </Box>
                                  <Box className='flex flex-row gap-2'>
                                    <RulerDimensionLine className='flex-none rotate-90' />
                                    <Box className='flex flex-col gap-1'>
                                      <Typography variant='subtitle1'>Side 2</Typography>
                                      <Typography>{specimen.side2} mm</Typography>
                                    </Box>
                                  </Box>
                                  <Box className='flex flex-row gap-2'>
                                    <MoveVertical className='flex-none' />
                                    <Box className='flex flex-col gap-1'>
                                      <Typography variant='subtitle1'>Height</Typography>
                                      <Typography>{specimen.height} mm</Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                              <Box className='flex flex-row gap-2'>
                                <CalendarPlus className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Created</Typography>
                                  <Typography>{new Date(specimen.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <CalendarCog className='flex-none' />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle1'>Updated</Typography>
                                  <Typography>{new Date(specimen.updatedAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</Typography>
                                </Box>
                              </Box>
                              {fields.map((field) => (
                                <Box key={field.id} className='flex flex-row gap-2'>
                                  {field.icon ? <DynamicIcon name={field.icon} className='flex-none' /> : <Hexagon className='flex-none' />}
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>{field.name}</Typography>
                                    {renderValue(field, specimen.customData?.[field.id] ?? specimen.customData?.[field.name] ?? null)}
                                  </Box>
                                </Box>
                              ))}
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
                      <TestDataGrid tests={specimenTests} dataFields={testFields} onTestsChange={setSpecimenTests} />
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
