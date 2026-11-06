import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type SpecimenRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import RecentRecords from "@/pages/app/components/recent-records";
import SpecimenForm from "@/pages/app/specimens/components/specimen-form";

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { getDataFields, getSpecimens, createSpecimen } = useDb();
  const initialSpecimen = (location.state as { initialSpecimen?: SpecimenRecord } | null)?.initialSpecimen;
  const { showError } = useAppNotifications();
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [recentSpecimens, setRecentSpecimens] = useState<SpecimenRecord[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadFields = async () => {
      setIsLoadingFields(true);
      setLoadError(null);
      try {
        const data = await getDataFields("Specimen");
        if (!cancelled) setFields(data);
      } catch (error) {
        if (!cancelled) {
          const message = t("add-form-load-specimen-fields-error", { error: String(error) });
          setLoadError(message);
          showError(message);
        }
      } finally {
        if (!cancelled) setIsLoadingFields(false);
      }
    };

    void loadFields();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, showError, t]);

  useEffect(() => {
    let cancelled = false;
    const loadRecentSpecimens = async () => {
      try {
        const records = await getSpecimens();
        if (!cancelled) setRecentSpecimens(records);
      } catch (error) {
        if (!cancelled) showError(t("add-recent-specimens-load-error", { error: String(error) }));
      } finally {
        if (!cancelled) setIsLoadingRecent(false);
      }
    };

    void loadRecentSpecimens();
    return () => {
      cancelled = true;
    };
  }, [getSpecimens, showError, t]);

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("add-specimen-title")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/specimens'>
                {t("specimens")}
              </Link>
              <Typography variant='body2'>{t("add-specimen-title")}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid container size={12} rowSpacing={5} columnSpacing={7} className='w-full'>
          <Grid size={{ xs: 12, lg: 8 }}>
            <SpecimenForm
              fields={fields}
              initialSpecimen={initialSpecimen}
              isLoadingFields={isLoadingFields}
              loadError={loadError}
              fullWidth
              onSave={async (input) => {
                await createSpecimen(input);
                navigate("/specimens");
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <RecentRecords
              title={t("recent-specimens")}
              emptyLabel={t("no-specimens-found")}
              records={recentSpecimens}
              hrefBase='specimens'
              loading={isLoadingRecent}
            />
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}