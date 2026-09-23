import { Link, useNavigate } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import DataFieldInput from "@/components/data-fields/data-field-input";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type DynamicDataValue } from "@/context/db-context";
import { Alert, Breadcrumbs, Button, Card, CardContent, Grid, Input, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik, type FormikErrors } from "formik";

interface SpecimenFormValues {
  name: string;
  customData: Record<string, DynamicDataValue>;
}

function validateSpecimen(values: SpecimenFormValues, fields: DataFieldDefinition[]) {
  const errors: FormikErrors<SpecimenFormValues> = {};
  if (!values.name.trim()) {
    errors.name = "Specimen name is required";
  }

  const customDataErrors: Record<string, string> = {};
  for (const field of fields) {
    if (field.type === "Image") {
      if (field.mandatory) customDataErrors[field.id] = "Required image fields are not supported yet";
      continue;
    }

    const value = values.customData[field.id];
    if (!field.mandatory) continue;

    switch (field.type) {
      case "Text":
        if (typeof value !== "string" || !value.trim()) customDataErrors[field.id] = `${field.name} is required`;
        break;
      case "Number":
        if (typeof value !== "number" || !Number.isFinite(value)) customDataErrors[field.id] = `${field.name} is required`;
        break;
      case "Select":
        if (typeof value !== "string" || !field.options?.includes(value)) customDataErrors[field.id] = `${field.name} is required`;
        break;
      case "Multi-Select":
        if (!Array.isArray(value) || value.length === 0) customDataErrors[field.id] = `${field.name} is required`;
        break;
      case "Boolean":
        if (typeof value !== "boolean") customDataErrors[field.id] = `${field.name} is required`;
        break;
    }
  }

  if (Object.keys(customDataErrors).length) {
    errors.customData = customDataErrors as FormikErrors<Record<string, DynamicDataValue>>;
  }
  return errors;
}

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getDataFields, createSpecimen } = useDb();
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadFields = async () => {
      setIsLoadingFields(true);
      setLoadError(null);
      try {
        const data = await getDataFields("Specimen");
        if (!cancelled) setFields(data);
      } catch (error) {
        if (!cancelled) setLoadError(`Failed to load specimen fields: ${String(error)}`);
      } finally {
        if (!cancelled) setIsLoadingFields(false);
      }
    };

    void loadFields();
    return () => {
      cancelled = true;
    };
  }, [getDataFields]);

  const formik = useFormik<SpecimenFormValues>({
    initialValues: { name: "", customData: {} },
    validate: (values) => validateSpecimen(values, fields),
    onSubmit: async (values) => {
      setSaveError(null);
      const customData = Object.fromEntries(
        Object.entries(values.customData).filter(([, value]) => value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)),
      );

      try {
        await createSpecimen({ name: values.name.trim(), customData });
        navigate("/specimens");
      } catch (error) {
        setSaveError(`Failed to save specimen: ${String(error)}`);
      }
    },
    validateOnBlur: true,
    validateOnChange: false,
  });

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
        <Grid
          container
          size={12}
          spacing={5}
          className='w-full'
          component='form'
          onSubmit={(event) => {
            event.preventDefault();
            void formik.submitForm();
          }}
        >
          <Grid size={{ lg: 8, xs: 12 }} container spacing={5}>
            <Grid size={12}>
              <Typography variant='h6' component='h2' className='mb-3'>Specimen Info</Typography>
              <Card>
                <CardContent>
                  <Input
                    fullWidth
                    name='name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    placeholder='Specimen name'
                    aria-label='Specimen name'
                  />
                  {formik.touched.name && formik.errors.name && <Alert severity='error' className='mt-2'>{formik.errors.name}</Alert>}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={12}>
              <Typography variant='h6' component='h2' className='mb-3'>Custom Fields</Typography>
              <Card>
                <CardContent className='flex flex-col gap-5'>
                  {loadError ? (
                    <Alert severity='error'>{loadError}</Alert>
                  ) : isLoadingFields ? (
                    <Typography color='textSecondary'>Loading fields...</Typography>
                  ) : fields.length === 0 ? (
                    <Typography color='textSecondary'>No fields configured for specimens.</Typography>
                  ) : (
                    fields.map((field) => {
                      const error = formik.errors.customData?.[field.id];
                      return (
                        <DataFieldInput
                          key={field.id}
                          field={field}
                          value={formik.values.customData[field.id] ?? null}
                          onChange={(value) => void formik.setFieldValue(`customData.${field.id}`, value)}
                          error={typeof error === "string" ? error : undefined}
                        />
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </Grid>

            {saveError && <Grid size={12}><Alert severity='error'>{saveError}</Alert></Grid>}
            <Grid size={12}>
              <Button
                disabled={isLoadingFields || Boolean(loadError)}
                loading={formik.isSubmitting}
                loadingPosition='start'
                type='submit'
                size='large'
                variant='surface'
                color='text-primary'
                className='surface-standard'
                startIcon={<Save />}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}