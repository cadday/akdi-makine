import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  capitalize,
  Card,
  CardContent,
  createFilterOptions,
  FormControl,
  FormLabel,
  Grid,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronDown, DraftingCompass, Play, SlidersVertical, Tag, X, XSquare } from "lucide-react";
import DataFieldInput from "@/components/data-fields/data-field-input";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useTranslation } from "react-i18next";
import { useDb, type DataFieldDefinition, type DynamicDataValue, type PresetRecord, type SpecimenRecord, type UploadedImage } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";

interface TestFormValues {
  specimenId: string;
  presetId: string;
  name: string;
  customData: Record<string, DynamicDataValue>;
  pendingImages: Record<string, File[]>;
}

function buildTestValidationSchema(fields: DataFieldDefinition[]) {
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
      specimenId: yup.string().required("Specimen is required"),
      presetId: yup.string().required("Preset is required"),
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

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getSpecimens, getPresets, getDataFields, createTest } = useDb();
  const { showError } = useAppNotifications();
  const [specimens, setSpecimens] = useState<SpecimenRecord[]>([]);
  const [presets, setPresets] = useState<PresetRecord[]>([]);
  const [fields, setFields] = useState<DataFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [defaultTestName] = useState(() => {
    const now = new Date();
    const twoDigits = (value: number) => String(value).padStart(2, "0");
    return `Test ${twoDigits(now.getDate())}-${twoDigits(now.getMonth() + 1)}-${String(now.getFullYear()).slice(-2)} ${twoDigits(now.getHours())}:${twoDigits(now.getMinutes())}`;
  });

  useEffect(() => {
    let cancelled = false;
    const loadFormOptions = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [specimenRecords, presetRecords, testFields] = await Promise.all([getSpecimens(), getPresets(), getDataFields("Test")]);
        if (!cancelled) {
          setSpecimens(specimenRecords);
          setPresets(presetRecords);
          setFields(testFields);
        }
      } catch (error) {
        if (!cancelled) {
          const message = `Failed to load test form data: ${String(error)}`;
          setLoadError(message);
          showError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadFormOptions();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getPresets, getSpecimens, showError]);

  const validationSchema = useMemo(() => buildTestValidationSchema(fields), [fields]);
  const formik = useFormik<TestFormValues>({
    initialValues: { specimenId: "", presetId: "", name: defaultTestName, customData: {}, pendingImages: {} },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const specimen = specimens.find((item) => item.id === values.specimenId);
      const preset = presets.find((item) => item.id === values.presetId);
      if (!specimen || !preset) {
        showError("The selected specimen or preset is no longer available.");
        return;
      }

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

        const testId = await createTest({
          name: values.name.trim(),
          specimenId: values.specimenId,
          presetId: values.presetId,
          specimenSnapshot: { name: specimen.name, customData: { ...specimen.customData } },
          presetSnapshot: {
            name: preset.name,
            type: preset.type,
            preload: preset.preload,
            load: preset.load,
            speed: preset.speed,
          },
          customData,
        });
        navigate(`/tests/${testId}`);
      } catch (error) {
        await Promise.allSettled(savedImageIds.map((imageId) => window.electronAPI.deleteImage(imageId)));
        showError(`Failed to save test: ${String(error)}`);
      }
    },
  });

  const selectedSpecimen = specimens.find((specimen) => specimen.id === formik.values.specimenId) ?? null;
  const selectedPreset = presets.find((preset) => preset.id === formik.values.presetId) ?? null;
  const specimenError = submitted && typeof formik.errors.specimenId === "string" ? formik.errors.specimenId : undefined;
  const presetError = submitted && typeof formik.errors.presetId === "string" ? formik.errors.presetId : undefined;

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              Run Test
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Link color='inherit' to='/tests'>
                {t("menu-tests")}
              </Link>
              <Typography variant='body2'>Run Test</Typography>
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
            <Grid size={12} className='group/grid'>
              <Box className='flex flex-row items-center justify-between'>
                <Typography variant='h6' component='h6' className='mb-3'>
                  Specimen
                </Typography>
                {/* <Button
                  size='tiny'
                  color='grey'
                  variant='text'
                  className={cn(!specimenError && selectedSpecimen && "group-hover/grid:opacity-100", " transition-all opacity-0")}
                  startIcon={<Settings2 size={16} />}
                >
                  Configure
                </Button> */}
              </Box>
              <Card>
                <CardContent className='-mb-4'>
                  <Box className='flex flex-row gap-2'>
                    <DraftingCompass className={cn(specimenError && "text-error!")} />
                    <FormControl fullWidth required>
                      <FormLabel component='label' className={cn(specimenError && "text-error!")}>
                        Specimen
                      </FormLabel>
                      <Autocomplete<SpecimenRecord, false, false, false>
                        size='small'
                        options={specimens}
                        value={selectedSpecimen}
                        onChange={(_, specimen) => void formik.setFieldValue("specimenId", specimen?.id ?? "")}
                        filterOptions={createFilterOptions<SpecimenRecord>({ stringify: (specimen) => specimen.name })}
                        getOptionLabel={(specimen) => specimen.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        popupIcon={<ChevronDown />}
                        clearIcon={<X />}
                        loading={isLoading}
                        noOptionsText={isLoading ? "Loading specimens..." : "No specimens found"}
                        slotProps={{ popper: { className: "outlined" } }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='standard'
                            className='outlined'
                            placeholder='Search specimens'
                            slotProps={{
                              htmlInput: { ...params.slotProps.htmlInput, autoComplete: "new-password" },
                              input: params.slotProps.input,
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={12} className='group/grid'>
              <Box className='flex flex-row items-center justify-between'>
                <Typography variant='h6' component='h6' className='mb-3'>
                  Preset
                </Typography>
                {/* <Button
                  size='tiny'
                  color='grey'
                  variant='text'
                  className={cn(!presetError && selectedPreset && "group-hover/grid:opacity-100", " transition-all opacity-0")}
                  startIcon={<Settings2 size={16} />}
                >
                  Configure
                </Button> */}
              </Box>
              <Card>
                <CardContent className='-mb-4'>
                  <Box className='flex flex-row gap-2'>
                    <SlidersVertical className={cn(presetError && "text-error!")} />
                    <FormControl fullWidth required>
                      <FormLabel component='label' className={cn(presetError && "text-error!")}>
                        Preset
                      </FormLabel>
                      <Autocomplete<PresetRecord, false, false, false>
                        size='small'
                        options={presets}
                        value={selectedPreset}
                        onChange={(_, preset) => void formik.setFieldValue("presetId", preset?.id ?? "")}
                        filterOptions={createFilterOptions<PresetRecord>({ stringify: (preset) => `${preset.name} ${preset.type}` })}
                        getOptionLabel={(preset) => preset.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        popupIcon={<ChevronDown />}
                        clearIcon={<X />}
                        loading={isLoading}
                        noOptionsText={isLoading ? "Loading presets..." : "No presets found"}
                        slotProps={{ popper: { className: "outlined" } }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='standard'
                            className='outlined'
                            placeholder='Search presets'
                            slotProps={{
                              htmlInput: { ...params.slotProps.htmlInput, autoComplete: "new-password" },
                              input: params.slotProps.input,
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={12}>
              <Typography variant='h6' component='h6' className='mb-3'>
                Definition
              </Typography>
              <Card>
                <CardContent className='flex flex-col -mb-4'>
                  <Box className='flex flex-row gap-2'>
                    <Tag className={cn(submitted && formik.errors.name && "text-error!")} />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                      <FormLabel component='label' className={cn(submitted && formik.errors.name && "text-error!")}>
                        Name
                      </FormLabel>
                      <Input name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {fields.length > 0 && (
              <Grid size={12}>
                <Typography variant='h6' component='h6' className='mb-3'>
                  Data Fields
                </Typography>
                <Card>
                  <CardContent className='flex flex-col -mb-4'>
                    {fields.map((field) => {
                      const error = formik.errors.customData?.[field.id] ?? formik.errors.pendingImages?.[field.id];
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
                    const label = fieldId
                      ? (fields.find((field) => field.id === fieldId)?.name ?? fieldId)
                      : key === "specimenId"
                        ? "Specimen"
                        : key === "presetId"
                          ? "Preset"
                          : capitalize(key);
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
                disabled={isLoading || Boolean(loadError)}
                loading={formik.isSubmitting}
                loadingPosition='start'
                type='submit'
                size='large'
                variant='surface'
                color='text-primary'
                className='surface-standard'
                startIcon={<Play />}
              >
                Run
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
