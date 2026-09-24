import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Grid, Typography } from "@mui/material";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import DataFieldForm from "@/pages/app/data-fields/components/data-field-form";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition } from "@/context/db-context";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import useAppNotifications from "@/hooks/use-app-notifications";

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getDataField, updateDataField } = useDb();
  const [dataField, setDataField] = useState<DataFieldDefinition | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useAppNotifications();

  useEffect(() => {
    let cancelled = false;

    const loadDataField = async () => {
      setIsLoading(true);
      setLoadError(null);
      if (!id) {
        setDataField(null);
        setLoadError("Data Field not found");

        setIsLoading(false);
        return;
      }

      try {
        const record = await getDataField(id);
        if (cancelled) return;
        setDataField(record ?? null);
        if (!record) setLoadError("Data Field not found");
      } catch (error) {
        if (!cancelled) setLoadError(`Failed to load Data Field: ${String(error)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadDataField();
    return () => {
      cancelled = true;
    };
  }, [getDataField, id]);

  useEffect(() => {
    if (loadError) showError(loadError);
  }, [loadError, showError]);

  return (
    <>
      {isLoading ? (
        <LoadingFullScreen />
      ) : (
        <>
          <TitleWrapper>
            <Grid size={12} container spacing={2.5}>
              <Grid size={{ xs: 12, md: "grow" }}>
                <Typography variant='h1' component='h1' className='mb-0'>
                  {dataField?.name ?? "Data Field"}
                </Typography>
                <Breadcrumbs>
                  <Link color='inherit' to={LINKS.home}>
                    {t("menu-home")}
                  </Link>
                  <Link color='inherit' to='/data-fields'>
                    {t("menu-data-fields")}
                  </Link>
                  {dataField && <Typography variant='body2'>{dataField.name}</Typography>}
                </Breadcrumbs>
              </Grid>
            </Grid>
          </TitleWrapper>

          <ContentWrapper>
            {!loadError && dataField && id ? (
              <DataFieldForm
                key={dataField.id}
                dataField={dataField}
                saveLabel='Update'
                onSave={async (input) => {
                  await updateDataField(id, input);
                  navigate("/data-fields");
                }}
              />
            ) : null}
          </ContentWrapper>
        </>
      )}
    </>
  );
}
