import { Link } from 'react-router';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { DraftingCompass, FlaskConical, Network, SlidersVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface OverviewCounts {
  tests: number;
  specimens: number;
  presets: number;
  dataFields: number;
}

export default function Summary({ counts }: { counts: OverviewCounts }) {
  const { t, i18n } = useTranslation();
  const numberFormat = new Intl.NumberFormat(i18n.language);

  return (
    <Grid size={12}>
      <Typography variant="h6" component="h6" className="mb-3">
        {t('overview-summary')}
      </Typography>
      <Grid container spacing={2.5} size={{ xs: 12 }}>
        <Grid size={{ lg: 3, xs: 12 }}>
          <Card component={Link} to="/tests" className="flex group">
            <CardContent>
              <Box className="flex flex-col gap-4">
                <FlaskConical className="group-hover:text-primary transition-colors" />
                <Box className="flex flex-col gap-0">
                  <Typography className="group-hover:text-primary transition-colors text-text-secondary">
                    {t('tests')}
                  </Typography>
                  <Typography className="group-hover:text-primary transition-colors" variant="h6">
                    {numberFormat.format(counts.tests)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ lg: 3, xs: 12 }}>
          <Card component={Link} to="/specimens" className="flex group">
            <CardContent>
              <Box className="flex flex-col gap-4">
                <DraftingCompass className="group-hover:text-primary transition-colors" />
                <Box className="flex flex-col gap-0">
                  <Typography className="group-hover:text-primary transition-colors text-text-secondary">
                    {t('specimens')}
                  </Typography>
                  <Typography className="group-hover:text-primary transition-colors" variant="h6">
                    {numberFormat.format(counts.specimens)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ lg: 3, xs: 12 }}>
          <Card component={Link} to="/presets" className="flex group">
            <CardContent>
              <Box className="flex flex-col gap-4">
                <SlidersVertical className="group-hover:text-primary transition-colors" />
                <Box className="flex flex-col gap-0">
                  <Typography className="group-hover:text-primary transition-colors text-text-secondary">
                    {t('presets')}
                  </Typography>
                  <Typography className="group-hover:text-primary transition-colors" variant="h6">
                    {numberFormat.format(counts.presets)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ lg: 3, xs: 12 }}>
          <Card component={Link} to="/data-fields" className="flex group">
            <CardContent>
              <Box className="flex flex-col gap-4">
                <Network className="group-hover:text-primary transition-colors" />
                <Box className="flex flex-col gap-0">
                  <Typography className="group-hover:text-primary transition-colors text-text-secondary">
                    {t('data-fields')}
                  </Typography>
                  <Typography className="group-hover:text-primary transition-colors" variant="h6">
                    {numberFormat.format(counts.dataFields)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
