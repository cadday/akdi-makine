import { Card, CardContent, Grid, Typography } from '@mui/material';
import QuickTestForm from '@/pages/app/overview/components/quick-test-form';
import { NoWayToTest } from '@/pages/app/components/no-entity-found';

export default function QuickTest({
  specimenCount,
  presetCount,
}: {
  specimenCount: number;
  presetCount: number;
}) {
  return (
    <Grid size={12}>
      <Typography variant="h6" component="h6" className="mb-3">
        Quick Test
      </Typography>
      <Card>
        <CardContent>
          {specimenCount === 0 || presetCount === 0 ? <NoWayToTest /> : <QuickTestForm />}
        </CardContent>
      </Card>
    </Grid>
  );
}
