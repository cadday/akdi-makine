import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type SpecimenRecord } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import SpecimenForm from "@/pages/app/specimens/components/specimen-form";

export default function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDataFields, getSpecimen, updateSpecimen } = useDb();
  const { showError } = useAppNotifications();
  const [specimen, setSpecimen] = useState<SpecimenRecord | null>(null);
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadEditData = async () => {
      setIsLoading(true);
      if (!id) {
        setSpecimen(null);
        setIsLoading(false);
        showError("Specimen not found");
        return;
      }

      try {
        const [record, dataFields] = await Promise.all([getSpecimen(id), getDataFields("Specimen")]);
        if (cancelled) return;
        setSpecimen(record ?? null);
        setFields(dataFields);
        if (!record) showError("Specimen not found");
      } catch (error) {
        if (!cancelled) {
          setSpecimen(null);
          showError(`Failed to load specimen: ${String(error)}`);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadEditData();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getSpecimen, id, showError]);

  return isLoading ? (
    <LoadingFullScreen />
  ) : (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {specimen ? `Edit / ${specimen.name}` : "Edit Specimen"}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/specimens'>
                {t("menu-specimens")}
              </Link>
              {specimen && <Link color='inherit' to={`/specimens/${specimen.id}`}>{specimen.name}</Link>}
              <Typography variant='body2'>Edit Specimen</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        {specimen && id && (
          <SpecimenForm
            fields={fields}
            specimen={specimen}
            saveLabel='Update'
            onSave={async (input) => {
              const updatedCount = await updateSpecimen(id, input);
              if (updatedCount === 0) throw new Error("Specimen no longer exists");
              navigate(`/specimens/${id}`);
            }}
          />
        )}
      </ContentWrapper>
    </>
  );
}