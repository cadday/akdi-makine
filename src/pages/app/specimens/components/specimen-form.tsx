import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  capitalize,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Bookmark, ChevronDown, Diameter, MoveVertical, RulerDimensionLine, Save, Shapes, XSquare } from "lucide-react";
import DataFieldInput from "@/components/data-fields/data-field-input";
import { type DataFieldDefinition, type DynamicDataValue, type SpecimenGeometry, type SpecimenRecord, type UploadedImage } from "@/context/db-context";
import { SPECIMEN_GEOMETRIES } from "@/lib/db";
import useAppNotifications from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";

interface SpecimenFormValues {
  name: string;
  geometry: SpecimenGeometry;
  diameter: number | "";
  side1: number | "";
  side2: number | "";
  height: number | "";
  customData: Record<string, DynamicDataValue>;
  pendingImages: Record<string, File[]>;
}

type SpecimenSaveInput = Omit<SpecimenRecord, "id" | "createdAt" | "updatedAt">;

interface SpecimenFormProps {
  fields: DataFieldDefinition[];
  isLoadingFields?: boolean;
  loadError?: string | null;
  specimen?: SpecimenRecord;
  initialSpecimen?: SpecimenRecord;
  saveLabel?: string;
  onSave: (input: SpecimenSaveInput) => Promise<void>;
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
      case "Image":
        customDataShape[field.id] = yup.mixed().nullable();
        pendingImagesShape[field.id] = yup.array().of(yup.mixed<File>().required()).nullable();
        break;
    }
  }

  return yup
    .object({
      name: yup.string().trim().required("Specimen name is required"),
      geometry: yup.string().oneOf(SPECIMEN_GEOMETRIES).required(),
      diameter: yup
        .number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .when("geometry", {
          is: "Cylindrical",
          then: (schema) => schema.typeError("Enter a number").moreThan(0, "Must be greater than zero").required("Diameter is required"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
      side1: yup
        .number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .when("geometry", {
          is: "Rectangular",
          then: (schema) => schema.typeError("Enter a number").moreThan(0, "Must be greater than zero").required("Side 1 is required"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
      side2: yup
        .number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .when("geometry", {
          is: "Rectangular",
          then: (schema) => schema.typeError("Enter a number").moreThan(0, "Must be greater than zero").required("Side 2 is required"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
      height: yup
        .number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .when("geometry", {
          is: (geometry: SpecimenGeometry) => geometry !== "Not Specified",
          then: (schema) => schema.typeError("Enter a number").moreThan(0, "Must be greater than zero").required("Height is required"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
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

  return {
    name: specimen?.name ?? "",
    geometry: specimen?.geometry ?? "Not Specified",
    diameter: specimen?.diameter ?? "",
    side1: specimen?.side1 ?? "",
    side2: specimen?.side2 ?? "",
    height: specimen?.height ?? "",
    customData,
    pendingImages: {},
  };
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

        await onSave({
          name: values.name.trim(),
          customData,
          geometry: values.geometry,
          ...(values.geometry === "Cylindrical"
            ? { diameter: Number(values.diameter), height: Number(values.height) }
            : values.geometry === "Rectangular"
              ? { side1: Number(values.side1), side2: Number(values.side2), height: Number(values.height) }
              : {}),
        });
      } catch (error) {
        await Promise.allSettled(savedImageIds.map((imageId) => window.electronAPI.deleteImage(imageId)));
        showError(`Failed to save specimen: ${String(error)}`);
      }
    },
  });

  const fieldError = (field: keyof SpecimenFormValues) => submitted && formik.errors[field];
  const setDimensionValue = (field: "diameter" | "side1" | "side2" | "height", value: string) =>
    void formik.setFieldValue(field, value === "" ? "" : Number(value));

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
                <Bookmark className={cn("flex-none", formik.touched.name && formik.errors.name && submitted && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={cn(formik.touched.name && formik.errors.name && submitted && "text-error!")}>
                    Name
                  </FormLabel>
                  <Input name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </FormControl>
              </Box>
              <Box className='flex flex-row gap-2'>
                <Shapes className={cn("flex-none", fieldError("geometry") && "text-error!")} />
                <FormControl fullWidth size='small' variant='standard' className='outlined'>
                  <FormLabel component='label' className={fieldError("geometry") ? "text-error!" : undefined}>
                    Geometry
                  </FormLabel>
                  <Select<SpecimenGeometry>
                    value={formik.values.geometry}
                    onChange={(event) => {
                      const geometry = event.target.value as SpecimenGeometry;
                      void formik.setValues((current) => ({ ...current, geometry, diameter: "", side1: "", side2: "", height: "" }));
                    }}
                    IconComponent={ChevronDown}
                    MenuProps={{ className: "outlined" }}
                  >
                    {SPECIMEN_GEOMETRIES.map((geometry) => (
                      <MenuItem key={geometry} value={geometry}>
                        {geometry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {formik.values.geometry === "Cylindrical" && (
                <Box className='flex flex-row gap-2'>
                  <Diameter className={cn("flex-none", fieldError("diameter") && "text-error!")} />
                  <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                    <FormLabel component='label' className={fieldError("diameter") ? "text-error!" : undefined}>
                      Diameter
                    </FormLabel>
                    <Input
                      type='number'
                      inputProps={{ min: 0, step: "any" }}
                      endAdornment={<InputAdornment position='end'>mm</InputAdornment>}
                      value={formik.values.diameter}
                      onChange={(event) => setDimensionValue("diameter", event.target.value)}
                    />
                  </FormControl>
                </Box>
              )}
              {formik.values.geometry === "Rectangular" && (
                <>
                  <Box className='flex flex-row gap-2'>
                    <RulerDimensionLine className={cn("flex-none", fieldError("side1") && "text-error!")} />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                      <FormLabel component='label' className={fieldError("side1") ? "text-error!" : undefined}>
                        Side 1
                      </FormLabel>
                      <Input
                        type='number'
                        inputProps={{ min: 0, step: "any" }}
                        endAdornment={<InputAdornment position='end'>mm</InputAdornment>}
                        value={formik.values.side1}
                        onChange={(event) => setDimensionValue("side1", event.target.value)}
                      />
                    </FormControl>
                  </Box>
                  <Box className='flex flex-row gap-2'>
                    <RulerDimensionLine className={cn("flex-none rotate-90", fieldError("side2") && "text-error!")} />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                      <FormLabel component='label' className={fieldError("side2") ? "text-error!" : undefined}>
                        Side 2
                      </FormLabel>
                      <Input
                        type='number'
                        inputProps={{ min: 0, step: "any" }}
                        endAdornment={<InputAdornment position='end'>mm</InputAdornment>}
                        value={formik.values.side2}
                        onChange={(event) => setDimensionValue("side2", event.target.value)}
                      />
                    </FormControl>
                  </Box>
                </>
              )}
              {formik.values.geometry !== "Not Specified" && (
                <Box className='flex flex-row gap-2'>
                  <MoveVertical className={cn("flex-none", fieldError("height") && "text-error!")} />
                  <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                    <FormLabel component='label' className={fieldError("height") ? "text-error!" : undefined}>
                      Height
                    </FormLabel>
                    <Input
                      type='number'
                      inputProps={{ min: 0, step: "any" }}
                      endAdornment={<InputAdornment position='end'>mm</InputAdornment>}
                      value={formik.values.height}
                      onChange={(event) => setDimensionValue("height", event.target.value)}
                    />
                  </FormControl>
                </Box>
              )}
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
              <AlertTitle variant='subtitle1' className='pt-0.5'>
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
