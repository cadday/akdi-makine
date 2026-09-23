import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition } from "@/context/db-context";
import { Breadcrumbs, Card, CardContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getDataField } = useDb();
  const [dataField, setDataField] = useState<DataFieldDefinition | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDataField = async () => {
      if (!id) {
        setTitle("Data Field not found");
        return;
      }

      setDataField(null);
      setTitle("");

      try {
        const record = await getDataField(id);
        if (cancelled) return;

        setDataField(record ?? null);
        setTitle(record?.name ?? "Data Field not found");
      } catch {
        if (!cancelled) setTitle("Failed to load Data Field");
      }
    };

    void loadDataField();
    return () => {
      cancelled = true;
    };
  }, [getDataField, id]);

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {dataField?.name ?? title}
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
        <Grid size={12} container spacing={5} className='w-full'>
          <Card className='w-full'>
              <CardContent className='flex flex-col gap-3'>
                {dataField ? (
                  <>
                    <Typography variant='h6' component='h2'>{dataField.type}</Typography>
                    <Typography><strong>Container:</strong> {dataField.container}</Typography>
                    {dataField.description && <Typography>{dataField.description}</Typography>}
                    {dataField.unit && <Typography><strong>Unit:</strong> {dataField.unit}</Typography>}
                    {dataField.type === "Image" && (
                      <>
                        <Typography><strong>Accepted types:</strong> {(dataField.accept ?? "image/*").split(",").join(", ")}</Typography>
                        <Typography><strong>Multiple images:</strong> {dataField.multiple ? "Yes" : "No"}</Typography>
                        <Typography color='textSecondary'>Images are uploaded when entered on a specimen.</Typography>
                      </>
                    )}
                  </>
                ) : <Typography>{title}</Typography>}
              </CardContent>
          </Card>
        </Grid>
      </ContentWrapper>
    </>
  );
}
