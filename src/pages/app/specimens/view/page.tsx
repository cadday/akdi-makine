import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { StoredImagePreviews } from "@/components/data-fields/image-data-field-input";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type DynamicDataValue, type SpecimenRecord, type UploadedImage } from "@/context/db-context";
import { Box, Breadcrumbs, Card, CardContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getSpecimen, getDataFields } = useDb();
  const [specimen, setSpecimen] = useState<SpecimenRecord | null>(null);
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadSpecimen = async () => {
      if (!id) {
        setTitle("Specimen not found");
        return;
      }

      setSpecimen(null);
      setTitle("");

      try {
        const [record, dataFields] = await Promise.all([getSpecimen(id), getDataFields("Specimen")]);
        if (cancelled) return;

        setSpecimen(record ?? null);
        setFields(dataFields);
        setTitle(record?.name ?? "Specimen not found");
      } catch {
        if (!cancelled) setTitle("Failed to load specimen");
      }
    };

    void loadSpecimen();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getSpecimen, id]);

  const renderValue = (field: DataFieldDefinition, value: DynamicDataValue) => {
    if (value == null) return "-";
    if (field.type === "Image" && Array.isArray(value)) {
      return <StoredImagePreviews images={value as UploadedImage[]} />;
    }
    if (typeof value === "boolean") return value ? "Yes" : "No";
    const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
    return field.unit ? `${displayValue} ${field.unit}` : displayValue;
  };

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {specimen?.name ?? title}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/specimens'>
                {t("menu-specimens")}
              </Link>
              {specimen && <Typography variant='body2'>{specimen.name}</Typography>}
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        {specimen && (
          <Grid size={12} container spacing={5} className='w-full'>
            <Grid size={12}>
              <Typography variant='h6' component='h2' className='mb-3'>Custom Fields</Typography>
              <Card>
                <CardContent className='flex flex-col gap-5'>
                  {fields.length === 0 ? (
                    <Typography color='textSecondary'>No custom fields configured.</Typography>
                  ) : fields.map((field) => (
                    <Box key={field.id} className='flex flex-col gap-1'>
                      <Typography variant='subtitle2'>{field.name}</Typography>
                      {renderValue(field, specimen.customData?.[field.id] ?? specimen.customData?.[field.name] ?? null)}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </ContentWrapper>
    </>
  );
}
