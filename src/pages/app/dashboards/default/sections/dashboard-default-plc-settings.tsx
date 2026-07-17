import { Link } from "react-router-dom";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { usePlcData } from "@/context/plc-context";
import { cn } from "@/lib/utils";
import NiDrop from "@/icons/nexture/ni-drop";
import NiCompass from "@/icons/nexture/ni-compass";

export default function DashboardDefaultPLCSettings() {
  const { telemetry } = usePlcData();

  const triggerCoil = async (address, value) => {
    try {
      await window.plcAPI.sendCoilCommand(address, value);
    } catch (err) {
      console.error("UI trigger error:", err);
    }
  };

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h6' component='h6' className='mb-3'>
          Settings
        </Typography>

        <Grid container size={12} spacing={2.5} className='flex-none'>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card component={Link} to='#' onClick={() => triggerCoil(2049, !telemetry.m1Status)} className='flex flex-col p-1 transition-transform hover:scale-[1.02]'>
              <Box
                className={cn("flex h-28 w-full flex-none items-center justify-center rounded-2xl", telemetry.m1Status ? "bg-primary-light/10" : "bg-grey-50")}
              >
                <NiCompass className={cn(telemetry.m1Status ? "text-primary" : "text-text-disabled")} size={"large"} />
              </Box>
              <CardContent>
                <Typography
                  variant='body1'
                  className={cn(telemetry.m1Status ? "text-text-primary" : "text-text-disabled", "text-center leading-5 transition-colors")}
                >
                  {telemetry.m1Status ? "Açık" : "Kapalı"}
                </Typography>
                <Typography variant='h5' className={cn("text-leading-5 text-center", telemetry.m1Status ? "text-text-primary" : "text-text-disabled")}>
                  M1
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card component={Link} to='#' onClick={() => triggerCoil(2050, !telemetry.m2Status)} className='flex flex-col p-1 transition-transform hover:scale-[1.02]'>
              <Box
                className={cn(
                  "flex h-28 w-full flex-none items-center justify-center rounded-2xl",
                  telemetry.m2Status ? "bg-secondary-light/10" : "bg-grey-50",
                )}
              >
                <NiDrop className={cn(telemetry.m2Status ? "text-secondary" : "text-text-disabled")} size={"large"} />
              </Box>
              <CardContent>
                <Typography
                  variant='body1'
                  className={cn(telemetry.m2Status ? "text-text-primary" : "text-text-disabled", "text-center leading-5 transition-colors")}
                >
                  {telemetry.m2Status ? "Açık" : "Kapalı"}
                </Typography>
                <Typography variant='h5' className={cn("text-leading-5 text-center", telemetry.m2Status ? "text-text-primary" : "text-text-disabled")}>
                  M2
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
