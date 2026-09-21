import { Link } from "react-router";

import { Breadcrumbs, Button, Grid, Typography } from "@mui/material";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import NiEllipsisHorizontal from "@/icons/nexture/ni-ellipsis-horizontal";
import { LINKS } from "@/constants";

export default function Page() {
  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              Specimens
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                Home
              </Link>
              <Typography variant='body2'>Specimens</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid size={{ xs: 12, md: "auto" }}>
            <Button className='icon-only surface-standard' color='grey' variant='surface'>
              <NiEllipsisHorizontal size={"medium"} />
            </Button>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className='w-full'></Grid>
      </ContentWrapper>
    </>
  );
}
