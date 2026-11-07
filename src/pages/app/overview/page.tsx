import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Breadcrumbs, Grid, Typography } from '@mui/material';
import ContentWrapper from '@/components/layout/containers/content-wrapper';
import TitleWrapper from '@/components/layout/containers/title-wrapper';
import LoadingFullScreen from '@/components/loading/loading-full-screen';
import { LINKS } from '@/constants';
import { useTranslation } from 'react-i18next';
import { useDb, type TestRecord } from '@/context/db-context';
import type { TestGraphType } from '@/lib/db';
import useAppNotifications from '@/hooks/use-app-notifications';
import LatestStressStrainGraphs from '@/pages/app/overview/components/latest-stress-strain-graphs';
import LatestTests from '@/pages/app/overview/components/latest-tests';
import QuickTest from '@/pages/app/overview/components/quick-test';
import Summary, { type OverviewCounts } from '@/pages/app/overview/components/summary';

export default function Page() {
  const { t } = useTranslation();
  const { getRecordCounts, getLatestTests } = useDb();
  const { showError } = useAppNotifications();
  const [counts, setCounts] = useState<OverviewCounts>({ tests: 0, specimens: 0, presets: 0, dataFields: 0 });
  const [latestTests, setLatestTests] = useState<TestRecord[]>([]);
  const [graphType, setGraphType] = useState<TestGraphType>('stress-strain');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const loadOverview = async () => {
      const [countsResult, testsResult] = await Promise.allSettled([getRecordCounts(), getLatestTests(10)]);
      if (cancelled) return;

      if (countsResult.status === 'fulfilled') setCounts(countsResult.value);
      else showError(t('overview-counts-error', { error: String(countsResult.reason) }));

      if (testsResult.status === 'fulfilled') {
        setLatestTests(testsResult.value);
        const hasStressStrainData = testsResult.value.some((test) => (test.results?.stressStrainData?.length ?? 0) > 0);
        const hasLoadDisplacementData = testsResult.value.some(
          (test) => (test.results?.loadDisplacementData?.length ?? 0) > 0,
        );
        if (!hasStressStrainData && hasLoadDisplacementData) setGraphType('load-displacement');
      } else showError(t('overview-latest-tests-error', { error: String(testsResult.reason) }));

      setIsLoading(false);
    };

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, [getLatestTests, getRecordCounts, showError, t]);

  return isLoading ? (
    <LoadingFullScreen />
  ) : (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: 'grow' }}>
            <Typography variant="h1" component="h1" className="mb-0">
              {t('menu-overview')}
            </Typography>
            <Breadcrumbs>
              <Link color="inherit" to={LINKS.home}>
                {t('menu-home')}
              </Link>
              <Typography variant="body2">{t('menu-overview')}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container rowSpacing={5} columnSpacing={7} className="w-full items-start">
          <Grid container rowSpacing={5} columnSpacing={7} size={{ lg: 8, xs: 12 }}>
            <Summary counts={counts} />
            <LatestStressStrainGraphs
              tests={latestTests}
              graphType={graphType}
              onGraphTypeChange={setGraphType}
            />
            <LatestTests tests={latestTests} />
          </Grid>
          <Grid container rowSpacing={5} columnSpacing={7} size={{ lg: 4, xs: 12 }}>
            <QuickTest specimenCount={counts.specimens} presetCount={counts.presets} />
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
