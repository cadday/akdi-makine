import { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import useAppNotifications from '@/hooks/use-app-notifications';
import { usePlcData } from '@/context/plc-context';

const PLC_OVERVIEW_POLL_INTERVAL_MS = 100;
const PLC_LOAD_SCALE_DIVISOR = 10;
const PLC_DISTANCE_SCALE_DIVISOR = 10000;

export default function RealTimeValues() {
  const { showError } = useAppNotifications();
  const { connectionStatus } = usePlcData();
  const { ipAddress, state } = connectionStatus;
  const [plcValues, setPlcValues] = useState<{ ipAddress: string; values: PlcOverviewValues } | null>(null);
  const readInFlightRef = useRef(false);

  useEffect(() => {
    if (state !== 'online' || !ipAddress) return;

    let cancelled = false;
    let hasReportedReadError = false;
    const readValues = async () => {
      if (cancelled || readInFlightRef.current) return;
      readInFlightRef.current = true;

      try {
        const values = await window.plcAPI.readOverviewValues();
        if (cancelled) return;
        setPlcValues({ ipAddress, values });
        hasReportedReadError = false;
      } catch (error: unknown) {
        if (!cancelled && !hasReportedReadError) {
          showError(`Failed to read PLC overview values: ${String(error)}`);
          hasReportedReadError = true;
        }
      } finally {
        readInFlightRef.current = false;
      }
    };

    void readValues();
    const intervalId = window.setInterval(() => {
      void readValues();
    }, PLC_OVERVIEW_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [ipAddress, showError, state]);

  const displayedPlcValues = state === 'online' && plcValues?.ipAddress === ipAddress ? plcValues.values : null;

  return (
    <Grid size={12}>
      <Typography variant="h6" component="h6" className="mb-3">
        Real Time Values
      </Typography>
      <Card>
        <CardContent>
          <Box>Load: {displayedPlcValues ? (displayedPlcValues.load / PLC_LOAD_SCALE_DIVISOR).toFixed(1) : '—'}</Box>
          <Box>
            Distance: {displayedPlcValues ? (displayedPlcValues.distance / PLC_DISTANCE_SCALE_DIVISOR).toFixed(4) : '—'}
          </Box>
          <Box>Status: {displayedPlcValues?.status ?? '—'}</Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
