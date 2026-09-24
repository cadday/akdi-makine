import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type SpecimenRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import SpecimenForm from "@/pages/app/specimens/components/specimen-form";

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { getDataFields, createSpecimen } = useDb();
  const initialSpecimen = (location.state as { initialSpecimen?: SpecimenRecord } | null)?.initialSpecimen;
  const { showError } = useAppNotifications();
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
          const message = `Failed to load specimen fields: ${String(error)}`;
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
  }, [getDataFields, showError]);

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              Add Specimen
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/specimens'>
                {t("menu-specimens")}
              </Link>
              <Typography variant='body2'>Add Specimen</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <SpecimenForm
          fields={fields}
          initialSpecimen={initialSpecimen}
          isLoadingFields={isLoadingFields}
          loadError={loadError}
          onSave={async (input) => {
            await createSpecimen(input);
            navigate("/specimens");
          }}
        />
      </ContentWrapper>
    </>
  );
}