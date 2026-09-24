import { Link, useNavigate } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import DataFieldInput from "@/components/data-fields/data-field-input";
import { LINKS } from "@/constants";
import { useDb, type DataFieldDefinition, type DynamicDataValue } from "@/context/db-context";
import { Alert, AlertTitle, Box, Breadcrumbs, Button, capitalize, Card, CardContent, FormControl, FormLabel, Grid, Input, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Save, Tag, XSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import * as yup from "yup";

interface SpecimenFormValues {
  name: string;
  customData: Record<string, DynamicDataValue>;
  pendingImages: Record<string, File[]>;
}

function buildSpecimenValidationSchema(fields: DataFieldDefinition[]) {
  const customDataShape: Record<string, yup.AnySchema> = {};
  const pendingImagesShape: Record<string, yup.AnySchema> = {};
  for (const field of fields) {
    switch (field.type) {
      case "Text": {
        let schema = yup.string().nullable();
        if (field.mandatory) schema = schema.required(`${field.name} is required`).trim();
        customDataShape[field.id] = schema;
        break;
      }
      case "Textarea": {
        let schema = yup.string().nullable();
        if (field.mandatory) schema = schema.required(`${field.name} is required`).trim();
        customDataShape[field.id] = schema;
        break;
      }
      case "Number": {
        let schema = yup.number().nullable().typeError(`${field.name} must be a number`);
        if (field.mandatory) schema = schema.required(`${field.name} is required`);
        customDataShape[field.id] = schema;
        break;
      }
      case "Select": {
        let schema = field.multipleSelection
          ? yup
              .array()
              .of(yup.string().oneOf(field.options ?? []))
              .nullable()
          : yup
              .string()
              .nullable()
              .oneOf(field.options ?? [], `${field.name} must be one of its configured options`);
        if (field.mandatory) {
          schema = field.multipleSelection
            ? schema.required(`${field.name} is required`).min(1, `${field.name} is required`)
            : schema.required(`${field.name} is required`);
        }
        customDataShape[field.id] = schema;
        break;
      }
      case "Boolean": {
        let schema = yup.boolean().nullable();
        if (field.mandatory) schema = schema.required(`${field.name} is required`);
        customDataShape[field.id] = schema;
        break;
      }
      case "Image": {
        customDataShape[field.id] = yup.mixed().nullable();
        let schema = yup.array().of(yup.mixed<File>().required()).nullable();
        if (field.mandatory) schema = schema.test("required-image", `${field.name} is required`, (files) => Boolean(files?.length));
        pendingImagesShape[field.id] = schema;
        break;
      }
    }
  }

  return yup.object({
    name: yup.string().trim().required("Specimen name is required"),
    customData: yup.object().shape(customDataShape),
    pendingImages: yup.object().shape(pendingImagesShape),
  });
}

function collectErrorMessages(errors: unknown, prefix = ""): Array<[string, string]> {
  if (typeof errors === "string") return [[prefix, errors]];
  if (!errors || typeof errors !== "object") return [];

  return Object.entries(errors).flatMap(([key, value]) => collectErrorMessages(value, prefix ? `${prefix}.${key}` : key));
}

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getDataFields, createSpecimen } = useDb();
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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

  const validationSchema = useMemo(() => buildSpecimenValidationSchema(fields), [fields]);
  const formik = useFormik<SpecimenFormValues>({
    validationSchema,
    onSubmit: async (values) => {
      setSaveError(null);
      const customData = Object.fromEntries(
        Object.entries(values.customData).filter(([, value]) => value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)),
      );
      const savedImageIds: string[] = [];

      try {
        for (const field of fields) {
          if (field.type !== "Image") continue;
          const images = Array.isArray(customData[field.id]) ? [...(customData[field.id] as import("@/context/db-context").UploadedImage[])] : [];
          for (const file of values.pendingImages[field.id] ?? []) {
            const savedImage = await window.electronAPI.saveImage({
              name: file.name,
              type: file.type,
              bytes: new Uint8Array(await file.arrayBuffer()),
            });
            savedImageIds.push(savedImage.id);
            images.push(savedImage);
          }
          if (images.length > 0) customData[field.id] = images;
        }

        await createSpecimen({ name: values.name.trim(), customData });
        navigate("/specimens");
      } catch (error) {
        await Promise.allSettled(savedImageIds.map((imageId) => window.electronAPI.deleteImage(imageId)));
        setSaveError(`Failed to save specimen: ${String(error)}`);
      }
    },
    initialValues: { name: "", customData: {}, pendingImages: {} },
    validateOnBlur: false,
    validateOnChange: true,
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
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            void formik.submitForm();
          }}
        >
          <Grid size={{ xs: 12 }} container spacing={5}>
            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Identity
              </Typography>
              <Card>
                <CardContent className='-mb-4'>
                  <Box className='flex flex-row gap-2'>
                    <Tag className={cn(formik.touched.name && formik.errors.name && submitted && "text-error!")} />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                      <FormLabel component='label' className={cn(formik.touched.name && formik.errors.name && submitted && "text-error!")}>
                        Name
                      </FormLabel>
                      <Input name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {fields.length !== 0 && (
              <Grid size={12}>
                <Typography variant='h6' component='h6' className='mb-3'>
                  Data Fields
                </Typography>
                <Card>
                  <CardContent className='flex flex-col gap-5 -mb-4'>
                    {fields.map((field) => {
                      const error = formik.errors.customData?.[field.id];
                      return (
                        <DataFieldInput
                          key={field.id}
                          field={field}
                          value={formik.values.customData[field.id] ?? null}
                          onChange={(value) => void formik.setFieldValue(`customData.${field.id}`, value)}
                          pendingFiles={formik.values.pendingImages[field.id] ?? []}
                          onPendingFilesChange={field.type === "Image" ? (files) => void formik.setFieldValue(`pendingImages.${field.id}`, files) : undefined}
                          error={typeof error === "string" && submitted ? error : undefined}
                        />
                      );
                    })}
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid size={12}>
              {saveError && <Alert severity='error'>{saveError}</Alert>}
              {submitted && !formik.isValid && (
                <Alert severity='error' icon={<XSquare />} className='neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5'>
                  <AlertTitle variant='subtitle2' className='pt-0.5'>
                    The following inputs have errors!
                  </AlertTitle>
                  {collectErrorMessages(formik.errors).map(([key, message]) => {
                    const fieldId = key.startsWith("customData.")
                      ? key.slice("customData.".length)
                      : key.startsWith("pendingImages.")
                        ? key.slice("pendingImages.".length)
                        : null;
                    const label = fieldId ? (fields.find((field) => field.id === fieldId)?.name ?? fieldId) : capitalize(key);
                    return (
                      <Box className='flex flex-row gap-0.5' key={key}>
                        <Typography className='text-error'>{label}:</Typography>
                        <Typography className='text-text-primary'>{message}</Typography>
                      </Box>
                    );
                  })}
                </Alert>
              )}
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
