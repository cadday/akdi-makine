import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useDb, type PresetRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import RecentRecords from "@/pages/app/components/recent-records";
import PresetForm from "@/pages/app/presets/components/preset-form";

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { createPreset, getPresets } = useDb();
  const initialPreset = (location.state as { initialPreset?: PresetRecord } | null)?.initialPreset;
  const { showError } = useAppNotifications();
  const [recentPresets, setRecentPresets] = useState<PresetRecord[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadRecentPresets = async () => {
      try {
        const records = await getPresets();
        if (!cancelled) setRecentPresets(records);
      } catch (error) {
        if (!cancelled) showError(t("add-recent-presets-load-error", { error: String(error) }));
      } finally {
        if (!cancelled) setIsLoadingRecent(false);
      }
    };

    void loadRecentPresets();
    return () => {
      cancelled = true;
    };
  }, [getPresets, showError, t]);

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("add-preset-title")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/presets'>
                {t("presets")}
              </Link>
              <Typography variant='body2'>{t("add-preset-title")}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid container size={12} rowSpacing={5} columnSpacing={7} className='w-full'>
          <Grid size={{ xs: 12, lg: 8 }}>
            <PresetForm
              initialPreset={initialPreset}
              fullWidth
              onSave={async (input) => {
                await createPreset(input);
                navigate("/presets");
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <RecentRecords
              title={t("recent-presets")}
              emptyLabel={t("no-presets-found")}
              records={recentPresets}
              hrefBase='presets'
              loading={isLoadingRecent}
            />
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}