import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useDb } from "@/context/db-context";
import PresetForm from "@/pages/app/presets/components/preset-form";

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createPreset } = useDb();

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              Add Preset
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/presets'>
                {t("menu-presets")}
              </Link>
              <Typography variant='body2'>Add Preset</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <PresetForm
          onSave={async (input) => {
            await createPreset(input);
            navigate("/presets");
          }}
        />
      </ContentWrapper>
    </>
  );
}