import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import { OctagonAlert, Repeat2 } from "lucide-react";
import TestDataGrid from "@/pages/app/tests/components/test-data-grid";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type TestRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getTests, getDataFields } = useDb();
  const { showError } = useAppNotifications();
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [dataFields, setDataFields] = useState<DataFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [testData, fieldData] = await Promise.all([getTests(), getDataFields("Test")]);
      setTests(testData);
      setDataFields(fieldData);
    } catch (loadError) {
      const message = `Failed to load tests: ${String(loadError)}`;
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getDataFields, getTests, showError]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [testData, fieldData] = await Promise.all([getTests(), getDataFields("Test")]);
        if (!cancelled) {
          setTests(testData);
          setDataFields(fieldData);
        }
      } catch (loadError) {
        if (!cancelled) {
          const message = `Failed to load tests: ${String(loadError)}`;
          setError(message);
          showError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getTests, showError]);

  const handleAddItem = useCallback(() => navigate("/tests/add"), [navigate]);

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("menu-tests")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("menu-tests")}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className='w-full'>
          <Grid size={12}>
            {error ? (
              <Box className='flex flex-col items-center gap-4'>
                <Box className='flex flex-col gap-2 items-center'>
                  <Box className='w-10 h-10 border border-dashed border-error flex items-center justify-center rounded-lg'>
                    <OctagonAlert className='text-error' />
                  </Box>
                </Box>
                <Button size='large' variant='outlined' color='grey' startIcon={<Repeat2 />} onClick={() => void loadTests()}>
                  Retry
                </Button>
              </Box>
            ) : (
              !isLoading && <TestDataGrid tests={tests} dataFields={dataFields} onTestsChange={setTests} onAddItem={handleAddItem} />
            )}
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
