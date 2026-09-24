import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert, AlertTitle, Box, Button, capitalize, Card, CardContent, FormControl, FormLabel, Grid, Input, Typography } from "@mui/material";
import { Save, Tag, XSquare } from "lucide-react";
import DataFieldInput from "@/components/data-fields/data-field-input";
import { type DataFieldDefinition, type DynamicDataValue, type SpecimenRecord, type UploadedImage } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";

interface SpecimenFormValues {
  name: string;
  customData: Record<string, DynamicDataValue>;
  pendingImages: Record<string, File[]>;
}

interface SpecimenFormProps {
  fields: DataFieldDefinition[];
  isLoadingFields?: boolean;
  loadError?: string | null;
  specimen?: SpecimenRecord;
  initialSpecimen?: SpecimenRecord;
  saveLabel?: string;
  onSave: (input: { name: string; customData: Record<string, DynamicDataValue> }) => Promise<void>;
}

function buildSpecimenValidationSchema(fields: DataFieldDefinition[]) {
  const customDataShape: Record<string, yup.AnySchema> = {};
  const pendingImagesShape: Record<string, yup.AnySchema> = {};

  for (const field of fields) {
    switch (field.type) {
      case "Text":
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
          ? yup.array().of(yup.string().oneOf(field.options ?? [])).nullable()
          : yup.string().nullable().oneOf(field.options ?? [], `${field.name} must be one of its configured options`);
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
      case "Image":
        customDataShape[field.id] = yup.mixed().nullable();
        pendingImagesShape[field.id] = yup.array().of(yup.mixed<File>().required()).nullable();
        break;
    }
  }

  return yup
    .object({
      name: yup.string().trim().required("Specimen name is required"),
      customData: yup.object().shape(customDataShape),
      pendingImages: yup.object().shape(pendingImagesShape),
    })
    .test("required-images", "Required image is missing", function (values) {
      for (const field of fields) {
        if (field.type !== "Image" || !field.mandatory) continue;
        const savedImages = values?.customData?.[field.id];
        const pendingFiles = values?.pendingImages?.[field.id];
        if ((!Array.isArray(savedImages) || savedImages.length === 0) && (!Array.isArray(pendingFiles) || pendingFiles.length === 0)) {
          return this.createError({ path: `pendingImages.${field.id}`, message: `${field.name} is required` });
        }
      }
      return true;
    });
}

function collectErrorMessages(errors: unknown, prefix = ""): Array<[string, string]> {
  if (typeof errors === "string") return [[prefix, errors]];
  if (!errors || typeof errors !== "object") return [];
  return Object.entries(errors).flatMap(([key, value]) => collectErrorMessages(value, prefix ? `${prefix}.${key}` : key));
}

function getInitialValues(specimen: SpecimenRecord | undefined, fields: DataFieldDefinition[]): SpecimenFormValues {
  const customData = { ...(specimen?.customData ?? {}) };
  for (const field of fields) {
    if (!(field.id in customData) && field.name in customData) {
      customData[field.id] = customData[field.name];
      delete customData[field.name];
    }
  }

  return { name: specimen?.name ?? "", customData, pendingImages: {} };
}

export default function SpecimenForm({ fields, isLoadingFields = false, loadError, specimen, initialSpecimen, saveLabel = "Save", onSave }: SpecimenFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { showError } = useAppNotifications();
  const validationSchema = useMemo(() => buildSpecimenValidationSchema(fields), [fields]);
  const initialValues = useMemo(() => getInitialValues(specimen ?? initialSpecimen, fields), [fields, specimen, initialSpecimen]);
  const formik = useFormik<SpecimenFormValues>({
    validationSchema,
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const customData = { ...values.customData };
      for (const field of fields) {
        if (field.type === "Image") {
          const retainedImages = Array.isArray(customData[field.id]) ? (customData[field.id] as UploadedImage[]) : [];
          const savedImages = [...retainedImages];
          if (!field.multiple && (values.pendingImages[field.id]?.length ?? 0) > 0) savedImages.length = 0;
          else if (!field.multiple) savedImages.splice(1);
          if (savedImages.length > 0) customData[field.id] = savedImages;
          else delete customData[field.id];
          continue;
        }

        const value = customData[field.id];
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) delete customData[field.id];
      }

      const savedImageIds: string[] = [];
      try {
        for (const field of fields) {
          if (field.type !== "Image") continue;
          const images = Array.isArray(customData[field.id]) ? [...(customData[field.id] as UploadedImage[])] : [];
          const pendingFiles = values.pendingImages[field.id] ?? [];
          for (const file of field.multiple ? pendingFiles : pendingFiles.slice(0, 1)) {
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

        await onSave({ name: values.name.trim(), customData });
      } catch (error) {
        await Promise.allSettled(savedImageIds.map((imageId) => window.electronAPI.deleteImage(imageId)));
        showError(`Failed to save specimen: ${String(error)}`);
      }
    },
  });

  return (
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
            Definition
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
                  const error = formik.errors.customData?.[field.id] ?? formik.errors.pendingImages?.[field.id];
                  return (
                    <DataFieldInput
                      key={field.id}
                      field={field}
                      value={formik.values.customData[field.id] ?? null}
                      onChange={(value) => void formik.setFieldValue(`customData.${field.id}`, value)}
                      editableImages={Boolean(specimen || initialSpecimen)}
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
            {saveLabel}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}