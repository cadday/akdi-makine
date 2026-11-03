import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import QuickTestForm from '@/pages/app/overview/components/quick-test-form';
import { NoWayToTest } from '@/pages/app/components/no-entity-found';

export default function QuickTest({
  specimenCount,
  presetCount,
}: {
  specimenCount: number;
  presetCount: number;
}) {
  const { t } = useTranslation();

  return (
    <Grid size={12}>
      <Typography variant="h6" component="h6" className="mb-3">
        {t('overview-quick-test')}
      </Typography>
      <Card>
        <CardContent>
          {specimenCount === 0 || presetCount === 0 ? <NoWayToTest /> : <QuickTestForm />}
        </CardContent>
      </Card>
    </Grid>
  );
}
