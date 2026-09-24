import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import { LINKS } from "@/constants";
import { useDb, type PresetRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import PresetForm from "@/pages/app/presets/components/preset-form";

export default function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPreset, updatePreset } = useDb();
  const { showError } = useAppNotifications();
  const [preset, setPreset] = useState<PresetRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPreset = async () => {
      setIsLoading(true);

      if (!id) {
        if (!cancelled) {
          setPreset(null);
          setIsLoading(false);
          showError("Preset not found");
        }
        return;
      }

      try {
        const record = await getPreset(id);
        if (cancelled) return;

        setPreset(record ?? null);
        if (!record) showError("Preset not found");
      } catch (error) {
        if (!cancelled) {
          setPreset(null);
          showError(`Failed to load preset: ${String(error)}`);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadPreset();
    return () => {
      cancelled = true;
    };
  }, [getPreset, id, showError]);

  return (
    isLoading ? (
      <LoadingFullScreen />
    ) : (
      <>
        <TitleWrapper>
          <Grid size={12} container spacing={2.5}>
            <Grid size={{ xs: 12, md: "grow" }}>
              <Typography variant='h1' component='h1' className='mb-0'>
                {preset ? `Edit / ${preset.name}` : "Edit Preset"}
              </Typography>
              <Breadcrumbs>
                <Link color='inherit' to={LINKS.home}>
                  {t("menu-home")}
                </Link>
                <Link color='inherit' to='/presets'>
                  {t("menu-presets")}
                </Link>
                {preset && <Link color='inherit' to={`/presets/${preset.id}`}>{preset.name}</Link>}
                <Typography variant='body2'>Edit Preset</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </TitleWrapper>

        <ContentWrapper>
          {preset && id && (
            <PresetForm
              preset={preset}
              saveLabel='Update'
              onSave={async (input) => {
                const updatedCount = await updatePreset(id, input);
                if (updatedCount === 0) throw new Error("Preset no longer exists");
                navigate(`/presets/${id}`);
              }}
            />
          )}
        </ContentWrapper>
      </>
    )
  );
}