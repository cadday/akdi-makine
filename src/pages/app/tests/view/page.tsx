import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Box, Breadcrumbs, Button, Card, CardContent, Grid, ListItemIcon, ListItemText, Menu, MenuItem, Tab, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ChevronLeft, ChevronRight, Ellipsis, Gauge, Hexagon, Pen, PencilRuler, Tag, Weight, WeightTilde, X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import ImageLightboxGallery from "@/components/data-fields/image-lightbox-gallery";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import { LINKS } from "@/constants";
import {
  useDb,
  type DataFieldDefinition,
  type DynamicDataValue,
  type TestRecord,
  type UploadedImage,
} from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";

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

        const [testFields, linkedSpecimenFields] = await Promise.all([
          getDataFields("Test"),
          getDataFields("Specimen"),
        ]);
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
    if (field.type === "Image" && Array.isArray(value)) {
      return <ImageLightboxGallery images={value as UploadedImage[]} />;
    }
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
                              if (id) navigate(`/tests/${id}/edit`);
                            }}
                          >
                            <ListItemIcon>
                              <Pen size={16} />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                          </MenuItem>
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
                      <Grid size={12}>
                        <Typography variant='h6' component='h6' className='mb-3'>
                          Stress Strain Graph
                        </Typography>
                        <Card>
                          <CardContent className='flex flex-col gap-5'></CardContent>
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
                                  <Hexagon />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Yield Strength</Typography>
                                    <Typography>{test.results?.yieldStrength ?? "-"}</Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                            <Card>
                              <CardContent className='flex flex-col gap-5'>
                                <Box className='flex flex-row gap-2'>
                                  <Hexagon />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Tensile Strength</Typography>
                                    <Typography>{test.results?.tensileStrength ?? "-"}</Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                            <Card>
                              <CardContent className='flex flex-col gap-5'>
                                <Box className='flex flex-row gap-2'>
                                  <Hexagon />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Elongation</Typography>
                                    <Typography>{test.results?.elongation ?? "-"}</Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                            <Card>
                              <CardContent className='flex flex-col gap-5'>
                                <Box className='flex flex-row gap-2'>
                                  <Hexagon />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>First Length</Typography>
                                    <Typography>{test.results?.firstLength ?? "-"}</Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                            <Card>
                              <CardContent className='flex flex-col gap-5'>
                                <Box className='flex flex-row gap-2'>
                                  <Hexagon />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Last Length</Typography>
                                    <Typography>{test.results?.lastLength ?? "-"}</Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                            <Card>
                              <CardContent className='flex flex-col gap-5'>
                                <Box className='flex flex-row gap-2'>
                                  <Hexagon />
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>Test Duration</Typography>
                                    <Typography>{test.results?.testDuration ?? "-"}</Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid size={12}>
                        <Typography variant='h6' component='h6' className='mb-3'>
                          Definition
                        </Typography>
                        <Card>
                          <CardContent className='flex flex-col gap-5'>
                            <Box className='flex flex-row gap-2'>
                              <Hexagon />
                              <Box className='flex flex-col gap-1'>
                                <Typography variant='subtitle1'>Name</Typography>
                                <Typography>{test.name}</Typography>
                              </Box>
                            </Box>
                            <Box className='flex flex-row gap-2'>
                              <Hexagon />
                              <Box className='flex flex-col gap-1'>
                                <Typography variant='subtitle1'>Specimen</Typography>
                                <Typography>{specimen?.name ?? "-"}</Typography>
                              </Box>
                            </Box>
                            <Box className='flex flex-row gap-2'>
                              <Hexagon />
                              <Box className='flex flex-col gap-1'>
                                <Typography variant='subtitle1'>Preset</Typography>
                                <Typography>{preset?.name ?? "-"}</Typography>
                              </Box>
                            </Box>

                            {fields.length > 0 &&
                              fields.map((field) => (
                                <Box key={field.id} className='flex flex-row gap-2'>
                                  {field.icon ? <DynamicIcon name={field.icon} /> : <Hexagon />}
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle1'>{field.name}</Typography>
                                    {renderValue(field, test.customData?.[field.id] ?? test.customData?.[field.name] ?? null)}
                                  </Box>
                                </Box>
                              ))}
                          </CardContent>
                        </Card>
                      </Grid>
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
                              </>
                            ) : (
                              <Typography color='textSecondary'>No related preset</Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </TabPanel>
              <TabPanel value='Raw Test Data'>
                {!loadError && test && (
                  <Card>
                    <CardContent>
                      <Box component='pre' className='m-0 overflow-auto whitespace-pre-wrap wrap-break-word font-mono text-sm'>
                        {JSON.stringify(test.customData, null, 2)}
                      </Box>
                    </CardContent>
                  </Card>
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
