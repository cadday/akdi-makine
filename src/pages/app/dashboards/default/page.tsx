import { Link } from "react-router";

import { Box, Breadcrumbs, Button, Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/material";

import { cn } from "@/lib/utils";
import { useThemeContext } from "@/theme/theme-provider";
import { ContentType } from "@/types/types";
import DashboardDefaultPLCSettings from "./sections/dashboard-default-plc-settings";
import { DashboardDefaultPLCChart } from "./sections/dashboard-default-plc-chart";
import { Ellipsis, Send } from "lucide-react";

export default function Page() {
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
                startIcon={<Send /> }
              >
                Button
              </Button>
              <Tooltip title='More'>
                <Button
                  className='icon-only surface-standard flex-none'
                  size='medium'
                  color='grey'
                  variant='surface'
                  startIcon={<Ellipsis /> }
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
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
