import { Link } from "react-router";

import { Breadcrumbs, Button, Grid, Typography } from "@mui/material";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useTranslation } from "react-i18next";
import { Ellipsis } from "lucide-react";
import { useDb } from "@/context/db-context";

export default function Page() {
  const { t } = useTranslation();

  const { createSpecimen, createDataField } = useDb();

  const addDemo = async () => {
    await createSpecimen({
      name: "Specimen C",
      customData: {
        diameter: 12.5,
        length: 200,
      },
    });

    await createSpecimen({
      name: "Specimen B",
      customData: {
        diameter: 12.5,
        length: 200,
      },
    });

    await createSpecimen({
      name: "Specimen A",
      customData: {
        diameter: 12.5,
        length: 200,
      },
    });

    await createDataField({
      type: "number",
      name: "Diameter",
      description: "Specimen diameter in mm",
      mandatory: true,
      icon: "ruler",
      container: "specimen",
    });
  };

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("menu-overview")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("menu-overview")}</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid size={{ xs: 12, md: "auto" }}>
            <Button className='icon-only surface-standard' color='grey' variant='surface'>
              <Ellipsis />
            </Button>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className='w-full'></Grid>
        <Button onClick={addDemo}>Add demo data</Button>
      </ContentWrapper>
    </>
  );
}
