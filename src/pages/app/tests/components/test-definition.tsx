import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert, AlertTitle, Box, Button, capitalize, Card, CardContent, FormControl, FormLabel, Grid, Input, Typography } from "@mui/material";
import { CalendarCog, CalendarPlus, Hexagon, Pen, Save, Tag, X, XSquare } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import DataFieldInput from "@/components/data-fields/data-field-input";
import ImageLightboxGallery from "@/components/data-fields/image-lightbox-gallery";
import { useDb, type DataFieldDefinition, type DynamicDataValue, type TestRecord, type UploadedImage } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";

interface TestDefinitionValues {
  name: string;
  customData: Record<string, DynamicDataValue>;
  pendingImages: Record<string, File[]>;
}

interface TestDefinitionProps {
  test: TestRecord;
  fields: DataFieldDefinition[];
  onTestUpdated: (test: TestRecord) => void;
}

function buildValidationSchema(fields: DataFieldDefinition[]) {
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
      name: yup.string().trim().required("Test name is required"),
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

function getInitialValues(test: TestRecord, fields: DataFieldDefinition[]): TestDefinitionValues {
  const customData = { ...test.customData };
  for (const field of fields) {
    if (!(field.id in customData) && field.name in customData) customData[field.id] = customData[field.name];
    if (field.name !== field.id) delete customData[field.name];
  }
  return { name: test.name, customData, pendingImages: {} };
}

function renderValue(field: DataFieldDefinition, value: DynamicDataValue) {
  if (value == null) return "-";
  if (field.type === "Image" && Array.isArray(value)) return <ImageLightboxGallery images={value as UploadedImage[]} />;
  if (typeof value === "boolean") return value ? "True" : "False";
  const displayValue = Array.isArray(value)
    ? value.map((item) => (item && typeof item === "object" && "name" in item ? item.name : String(item))).join(", ")
    : String(value);
  return field.unit ? `${displayValue} ${field.unit}` : displayValue;
}

export default function TestDefinition({ test, fields, onTestUpdated }: TestDefinitionProps) {
  const { updateTest } = useDb();
  const { showError } = useAppNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const validationSchema = useMemo(() => buildValidationSchema(fields), [fields]);
  const initialValues = useMemo(() => getInitialValues(test, fields), [fields, test]);
  const formik = useFormik<TestDefinitionValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const customData = { ...values.customData };
      for (const field of fields) {
        if (field.type !== "Image") {
          const value = customData[field.id];
          if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) delete customData[field.id];
          continue;
        }

        const images = Array.isArray(customData[field.id]) ? [...(customData[field.id] as UploadedImage[])] : [];
        if (!field.multiple && (values.pendingImages[field.id]?.length ?? 0) > 0) images.length = 0;
        if (images.length > 0) customData[field.id] = images;
        else delete customData[field.id];
      }

      const savedImageIds: string[] = [];
      try {
        for (const field of fields) {
          if (field.type !== "Image") continue;
          const images = Array.isArray(customData[field.id]) ? [...(customData[field.id] as UploadedImage[])] : [];
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

        const name = values.name.trim();
        const updatedCount = await updateTest(test.id, { name, customData });
        if (updatedCount === 0) throw new Error("Test was not found and could not be updated.");

        onTestUpdated({ ...test, name, customData, updatedAt: Date.now() });
        setIsEditing(false);
        setSubmitted(false);
      } catch (error) {
        await Promise.allSettled(savedImageIds.map((imageId) => window.electronAPI.deleteImage(imageId)));
        showError(`Failed to update test: ${String(error)}`);
      }
    },
  });

  const handleCancel = () => {
    void formik.resetForm({ values: initialValues });
    setSubmitted(false);
    setIsEditing(false);
  };

  return (
    <Grid size={12} className='group/grid'>
      <Box className='flex flex-row items-center justify-between'>
        <Typography variant='h6' component='h6' className='mb-3'>
          Definition
        </Typography>
        {isEditing ? (
          <Box className='flex items-center gap-1'>
            <Button size='tiny' color='grey' variant='text' onClick={handleCancel} startIcon={<X size={16} />}>
              Cancel
            </Button>
            <Button
              size='tiny'
              color='text-primary'
              variant='text'
              type='submit'
              form='test-definition-form'
              loading={formik.isSubmitting}
              startIcon={<Save size={16} />}
            >
              Update
            </Button>
          </Box>
        ) : (
          <Button
            size='tiny'
            color='grey'
            variant='text'
            className={cn("group-hover/grid:opacity-100", "transition-all opacity-0")}
            onClick={() => setIsEditing(true)}
            startIcon={<Pen size={16} />}
          >
            Edit
          </Button>
        )}
      </Box>
      <Card>
        <CardContent className='flex flex-col gap-5'>
          {isEditing ? (
            <Box
              id='test-definition-form'
              component='form'
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
                void formik.submitForm();
              }}
              className='flex flex-col'
            >
              <Box className='flex flex-row gap-2'>
                <Tag className={cn(submitted && formik.errors.name && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={cn(submitted && formik.errors.name && "text-error!")}>
                    Name
                  </FormLabel>
                  <Input name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </FormControl>
              </Box>
              {fields.map((field) => {
                const error = formik.errors.customData?.[field.id] ?? formik.errors.pendingImages?.[field.id];
                return (
                  <DataFieldInput
                    key={field.id}
                    field={field}
                    value={formik.values.customData[field.id] ?? null}
                    onChange={(value) => void formik.setFieldValue(`customData.${field.id}`, value)}
                    editableImages
                    pendingFiles={formik.values.pendingImages[field.id] ?? []}
                    onPendingFilesChange={field.type === "Image" ? (files) => void formik.setFieldValue(`pendingImages.${field.id}`, files) : undefined}
                    error={typeof error === "string" && submitted ? error : undefined}
                  />
                );
              })}
              {submitted && !formik.isValid && (
                <Alert severity='error' icon={<XSquare />}>
                  <AlertTitle>Check the highlighted fields</AlertTitle>
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
                        <Typography>{message}</Typography>
                      </Box>
                    );
                  })}
                </Alert>
              )}
              <Box className='flex gap-1'>
                <Button type='submit' color='grey' variant='pastel' loading={formik.isSubmitting} startIcon={<Save size={16} />}>
                  Update
                </Button>
                <Button color='grey' variant='text' onClick={handleCancel} startIcon={<X size={16} />}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Box className='flex flex-row gap-2'>
                <Tag />
                <Box className='flex flex-col gap-1'>
                  <Typography variant='subtitle1'>Name</Typography>
                  <Typography>{test.name}</Typography>
                </Box>
              </Box>
              {fields.map((field) => (
                <Box key={field.id} className='flex flex-row gap-2'>
                  {field.icon ? <DynamicIcon name={field.icon} /> : <Hexagon />}
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='subtitle1'>{field.name}</Typography>
                    {renderValue(field, test.customData?.[field.id] ?? test.customData?.[field.name] ?? null)}
                  </Box>
                </Box>
              ))}
              <Box className='flex flex-row gap-2'>
                <CalendarPlus />
                <Box className='flex flex-col gap-1'>
                  <Typography variant='subtitle1'>Created</Typography>
                  <Typography>{new Date(test.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</Typography>
                </Box>
              </Box>
              <Box className='flex flex-row gap-2'>
                <CalendarCog />
                <Box className='flex flex-col gap-1'>
                  <Typography variant='subtitle1'>Updated</Typography>
                  <Typography>{new Date(test.updatedAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</Typography>
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
