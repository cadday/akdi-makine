import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import ImageLightboxGallery from "@/components/data-fields/image-lightbox-gallery";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type DynamicDataValue, type SpecimenRecord, type UploadedImage } from "@/context/db-context";
import { Box, Breadcrumbs, Card, CardContent, Grid, Tab, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import { useSnackbar } from "notistack";
import { DynamicIcon } from "lucide-react/dynamic";
import { ChevronLeft, ChevronRight, Hexagon } from "lucide-react";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";

export default function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getSpecimen, getDataFields } = useDb();
  const [specimen, setSpecimen] = useState<SpecimenRecord | null>(null);
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

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
        const [record, dataFields] = await Promise.all([getSpecimen(id), getDataFields("Specimen")]);
        if (cancelled) return;

        setSpecimen(record ?? null);
        setFields(dataFields);
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
  }, [getDataFields, getSpecimen, id]);

  const snackbarError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "error",
        persist: false,
        autoHideDuration: 6000,
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    if (loadError) snackbarError(loadError);
  }, [loadError, snackbarError]);

  const renderValue = (field: DataFieldDefinition, value: DynamicDataValue) => {
    if (value == null) return "-";
    if (field.type === "Image" && Array.isArray(value)) {
      return <ImageLightboxGallery images={value as UploadedImage[]} />;
    }
    if (typeof value === "boolean") return value ? "Yes" : "No";
    const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
    return field.unit ? `${displayValue} ${field.unit}` : displayValue;
  };

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
                            Specifications
                          </Typography>
                          <Card>
                            <CardContent className='flex flex-col gap-5'>
                              {fields.map((field) => (
                                <Box key={field.id} className='flex flex-row gap-2'>
                                  {field.icon ? <DynamicIcon name={field.icon} /> : <Hexagon />}
                                  <Box className='flex flex-col gap-1'>
                                    <Typography variant='subtitle2'>{field.name}</Typography>
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
                            <CardContent></CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </TabPanel>
                <TabPanel value='Tests'>
                  <Grid size={12} container spacing={5} className='w-full'>
                    <Grid size={12}>Second Tab Content</Grid>
                  </Grid>
                </TabPanel>
              </ContentWrapper>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
