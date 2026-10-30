import { Link } from 'react-router';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { DraftingCompass, FlaskConical, Network, SlidersVertical } from 'lucide-react';

export interface OverviewCounts {
  tests: number;
  specimens: number;
  presets: number;
  dataFields: number;
}

export default function Summary({ counts }: { counts: OverviewCounts }) {
  return (
    <Grid size={12}>
      <Typography variant="h6" component="h6" className="mb-3">
        Summary
      </Typography>
      <Grid container spacing={2.5} size={{ xs: 12 }}>
        <Grid size={{ lg: 3, xs: 12 }}>
          <Card component={Link} to="/tests" className="flex group">
            <CardContent>
              <Box className="flex flex-col gap-4">
                <FlaskConical className="group-hover:text-primary transition-colors" />
                <Box className="flex flex-col gap-0">
                  <Typography className="group-hover:text-primary transition-colors text-text-secondary">
                    Tests
                  </Typography>
                  <Typography className="group-hover:text-primary transition-colors" variant="h6">
                    {counts.tests.toLocaleString()}
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
                    Specimens
                  </Typography>
                  <Typography className="group-hover:text-primary transition-colors" variant="h6">
                    {counts.specimens.toLocaleString()}
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
                    Presets
                  </Typography>
                  <Typography className="group-hover:text-primary transition-colors" variant="h6">
                    {counts.presets.toLocaleString()}
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
                    Data Fields
                  </Typography>
                  <Typography className="group-hover:text-primary transition-colors" variant="h6">
                    {counts.dataFields.toLocaleString()}
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
