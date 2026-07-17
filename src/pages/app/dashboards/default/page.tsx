import { Link } from "react-router-dom";

import { Box, Breadcrumbs, Button, Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/material";

import NiEllipsisHorizontal from "@/icons/nexture/ni-ellipsis-horizontal";
import NiSendUpRight from "@/icons/nexture/ni-send-up-right";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/theme/theme-provider";
import { ContentType } from "@/types/types";
import DashboardDefaultPLCSettings from "./sections/dashboard-default-plc-settings";
import { DashboardDefaultPLCChart } from "./sections/dashboard-default-plc-chart";

export default function LevelTwo() {
  const { content } = useThemeContext();

  return (
    <Box>
      <Box className='outline-grey-100 rounded-b-3xl py-5 outline outline-offset-0'>
        <Box className={cn("mx-auto px-4 md:px-6 lg:px-8", content === ContentType.Boxed && "max-w-screen-lg")}>
          <Grid container spacing={2.5} className='w-full' size={12}>
            <Grid size={{ xs: 12, md: "grow" }}>
              <Typography variant='h1' component='h1' className='mb-0'>
                Default Page
              </Typography>
              <Breadcrumbs>
                <Link color='inherit' to='/dashboards/default'>
                  Home
                </Link>
                <Typography variant='body2'>Default</Typography>
              </Breadcrumbs>
            </Grid>

            <Grid size={{ xs: 12, md: "auto" }} className='flex flex-row items-start gap-2'>
              <Button
                className='surface-standard flex-none'
                size='medium'
                color='grey'
                variant='surface'
                component={Link}
                to='#'
                startIcon={<NiSendUpRight size={"medium"} />}
              >
                Button
              </Button>
              <Tooltip title='More'>
                <Button
                  className='icon-only surface-standard flex-none'
                  size='medium'
                  color='grey'
                  variant='surface'
                  startIcon={<NiEllipsisHorizontal size={"medium"} />}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={cn("mx-auto px-4 py-4 sm:rounded-4xl md:px-6 lg:px-8 lg:py-8", content === ContentType.Boxed && "max-w-screen-lg")}>
        <Grid container size={12} spacing={5}>
          <Grid size={{ lg: 6, xs: 12 }} container spacing={2.5}>
            <DashboardDefaultPLCSettings />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DashboardDefaultPLCChart />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
