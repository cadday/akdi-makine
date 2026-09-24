import { SyntheticEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Box, Breadcrumbs, Card, CardContent, Grid, Tab, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Gauge, Tag, Weight, WeightTilde } from "lucide-react";
import { useTranslation } from "react-i18next";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import { LINKS } from "@/constants";
import { useDb, type PresetRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";

export default function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getPreset } = useDb();
  const { showError } = useAppNotifications();
  const [preset, setPreset] = useState<PresetRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState("Overview");

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
        const record = await getPreset(id);
        if (cancelled) return;

        setPreset(record ?? null);
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
  }, [getPreset, id]);

  useEffect(() => {
    if (loadError) showError(loadError);
  }, [loadError, showError]);

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
                            Specifications
                          </Typography>
                          <Card>
                            <CardContent className='flex flex-col gap-5'>
                              <Box className='flex flex-row gap-2'>
                                <Tag />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle2'>Type</Typography>
                                  <Typography>{preset.type}</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <WeightTilde />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle2'>Preload</Typography>
                                  <Typography>{preset.preload} N</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <Weight />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle2'>Load</Typography>
                                  <Typography>{preset.load} N</Typography>
                                </Box>
                              </Box>
                              <Box className='flex flex-row gap-2'>
                                <Gauge />
                                <Box className='flex flex-col gap-1'>
                                  <Typography variant='subtitle2'>Speed</Typography>
                                  <Typography>{preset.speed} mm/s</Typography>
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
                            <CardContent></CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </TabPanel>
                <TabPanel value='Tests'>
                  <Grid size={12} container spacing={5} className='w-full'>
                    <Grid size={12}>Tests</Grid>
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
