import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
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
import { Bookmark, ChevronDown, Crosshair, Gauge, PencilRuler, Plus, Save, Split, WeightTilde, XSquare } from "lucide-react";
import type { PresetMethod, PresetRecord, PresetType } from "@/context/db-context";
import { PRESET_METHODS, PRESET_TYPES } from "@/lib/db";
import useAppNotifications from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { DecimalMaskInput } from "@/components/base-ui/masked-decimal-input";
import PresetTypeTag from "./preset-type-tag";

type PresetSaveInput = Omit<PresetRecord, "id" | "createdAt" | "updatedAt">;
type PresetFormValues = Omit<PresetSaveInput, "type" | "method" | "velocity" | "preload" | "targets"> & {
  type: PresetType | "";
  velocity: number | "";
  method: PresetMethod | "";
  preload: string;
  targets: string[];
};

interface PresetFormProps {
  onSave: (input: PresetSaveInput) => Promise<void>;
  preset?: PresetRecord;
  initialPreset?: PresetRecord;
  saveLabel?: string;
}

function getInitialValues(preset?: PresetRecord): PresetFormValues {
  return {
    name: preset?.name ?? "",
    type: preset?.type ?? "",
    velocity: preset?.velocity ?? "",
    method: preset?.method ?? "",
    preload: Math.abs(preset?.preload ?? 0).toFixed(1),
    targets: preset?.targets?.length ? preset.targets.map((target) => Math.abs(target).toFixed(preset.method === "Load" ? 1 : 4)) : [""],
  };
}

function buildValidationSchema(t: ReturnType<typeof useTranslation>["t"]) {
  return yup.object({
    name: yup.string().trim().required(t("add-validation-required", { label: t("add-name") })),
    type: yup.string().oneOf(PRESET_TYPES).required(t("add-form-type-required")),
    velocity: yup
      .number()
      .typeError(t("add-validation-number", { label: t("listing-velocity") }))
      .moreThan(0, t("add-validation-greater-zero", { label: t("listing-velocity") }))
      .test("plc-precision", t("add-validation-precision", { label: t("listing-velocity"), decimalPlaces: 1 }), (value) => {
        if (value === undefined) return true;
        const scaled = value * 10;
        return Math.abs(scaled - Math.round(scaled)) < 1e-8;
      })
      .required(t("add-validation-required", { label: t("listing-velocity") })),
    method: yup.string().oneOf(PRESET_METHODS).required(t("add-form-method-required")),
    preload: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .min(0, t("add-validation-minimum", { label: t("add-preload") }))
      .test("plc-precision", t("add-validation-precision", { label: t("add-preload"), decimalPlaces: 1 }), (value) => {
        if (value === undefined) return true;
        const scaled = value * 10;
        return Math.abs(scaled - Math.round(scaled)) < 1e-8;
      })
      .optional(),
    targets: yup
      .array()
      .of(
        yup
          .number()
          .typeError(t("add-validation-number", { label: t("add-target-label") }))
          .moreThan(0, t("add-validation-greater-zero", { label: t("add-target-label") }))
          .required(t("add-validation-required", { label: t("add-target-label") })),
      )
      .min(1, t("add-validation-target-minimum"))
      .max(5, t("add-validation-target-maximum"))
      .required(t("add-validation-target-minimum")),
  });
}

export default function PresetForm({ onSave, preset, initialPreset, saveLabel }: PresetFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { showError } = useAppNotifications();
  const { t } = useTranslation();
  const validationSchema = useMemo(() => buildValidationSchema(t), [t]);
  const formik = useFormik<PresetFormValues>({
    initialValues: getInitialValues(preset ?? initialPreset),
    enableReinitialize: true,
    validationSchema,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      if (!values.type || !values.method || values.velocity === "" || values.targets.some((target) => target === "")) return;

      try {
        const targetSign = values.type === "Compression" ? -1 : 1;
        await onSave({
          name: values.name.trim(),
          type: values.type,
          velocity: Number(values.velocity),
          method: values.method,
          preload: values.method === "Load" ? Number(values.preload || 0) * targetSign : undefined,
          targets: values.targets.map((target) => Number(target) * targetSign),
        });
      } catch (error) {
        showError(t("add-form-save-preset-error", { error: String(error) }));
      }
    },
  });

  const fieldError = (field: keyof PresetFormValues) => submitted && formik.errors[field];

  return (
    <Grid container size={12} className='items-start w-full' spacing={5}>
      <Grid
        container
        size={{ lg: 8, xs: 12 }}
        spacing={5}
        component='form'
        noValidate
        onSubmit={(event) => {
          setSubmitted(true);
          formik.handleSubmit(event);
        }}
      >
        <Grid size={12}>
          <Typography variant='h6' component='h6' className='mb-3'>
            {t("add-definition")}
          </Typography>
          <Card>
            <CardContent className='-mb-4'>
              <Box className='flex flex-row gap-2'>
                <Bookmark className={cn("flex-none", fieldError("name") && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("name") ? "text-error!" : undefined}>
                    {t("add-name")}
                  </FormLabel>
                  <Input name='name' value={formik.values.name} onChange={formik.handleChange} />
                </FormControl>
              </Box>

              <Box className='flex flex-row gap-2'>
                <PencilRuler className={cn("flex-none", fieldError("type") && "text-error!")} />
                <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                  <FormLabel component='label' className={fieldError("type") ? "text-error!" : undefined}>
                    {t("add-type")}
                  </FormLabel>
                  <Select<PresetType | "">
                    value={formik.values.type}
                    onChange={(event) => void formik.setFieldValue("type", event.target.value)}
                    renderValue={(value) => (value ? <PresetTypeTag type={value} /> : null)}
                    IconComponent={ChevronDown}
                    MenuProps={{ className: "outlined" }}
                  >
                    {PRESET_TYPES.map((presetType) => (
                      <MenuItem key={presetType} value={presetType}>
                        <PresetTypeTag type={presetType} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box className='flex flex-row gap-2'>
                <Gauge className={cn("flex-none", fieldError("velocity") && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("velocity") ? "text-error!" : undefined}>
                    {t("listing-velocity")}
                  </FormLabel>
                  <Input
                    type='number'
                    inputProps={{
                      min: 0,
                      step: "any",
                      onKeyDown: (event) => {
                        if (event.key === "-" || event.key === "Subtract") event.preventDefault();
                      },
                      onPaste: (event) => {
                        if (event.clipboardData.getData("text").trim().startsWith("-")) event.preventDefault();
                      },
                    }}
                    endAdornment={<InputAdornment position='end'>{t("unit-velocity")}</InputAdornment>}
                    value={formik.values.velocity}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.trimStart().startsWith("-") || (value !== "" && Number(value) < 0)) return;
                      void formik.setFieldValue("velocity", value === "" ? "" : Number(value));
                    }}
                  />
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Typography variant='h6' component='h6' className='mb-3'>
            {t("add-test-method-parameters")}
          </Typography>
          <Card>
            <CardContent className='-mb-4'>
              <Box className='flex flex-row gap-2'>
                <Split className={cn("flex-none", fieldError("method") && "text-error!")} />
                <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                  <FormLabel component='label' className={fieldError("method") ? "text-error!" : undefined}>
                    {t("add-method")}
                  </FormLabel>
                  <Select<PresetMethod | "">
                    value={formik.values.method}
                    onChange={(event) => {
                      const nextMethod = event.target.value as PresetMethod | "";
                      void formik.setFieldValue("method", nextMethod);
                      if (nextMethod !== formik.values.method) {
                        void formik.setFieldValue("targets", [""]);
                        void formik.setFieldValue("preload", "0.0");
                      }
                    }}
                    IconComponent={ChevronDown}
                    MenuProps={{ className: "outlined" }}
                  >
                    {PRESET_METHODS.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method === "Load" ? t("listing-load") : t("listing-distance")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {formik.values.method === "Load" && (
                <Box className='flex flex-row gap-2'>
                  <WeightTilde className={cn("flex-none", fieldError("preload") && "text-error!")} />
                  <FormControl className='outlined' variant='standard' size='small' fullWidth>
                    <FormLabel component='label' className={fieldError("preload") ? "text-error!" : undefined}>
                      {t("add-preload")}
                    </FormLabel>
                    <Input
                      inputComponent={DecimalMaskInput}
                      inputProps={{
                        inputMode: "decimal",
                        scale: 1,
                        min: 0,
                        max: 0x7fffffff / 10,
                        onAccept: (value: string, event?: InputEvent) => {
                          if (event) void formik.setFieldValue("preload", value);
                        },
                      }}
                      startAdornment={
                        formik.values.type ? (
                          <InputAdornment position='start'>{formik.values.type === "Compression" ? "-" : "+"}</InputAdornment>
                        ) : undefined
                      }
                      endAdornment={<InputAdornment position='end'>N</InputAdornment>}
                      value={formik.values.preload}
                    />
                  </FormControl>
                </Box>
              )}
              {formik.values.targets.map((target, index) => {
                const targetErrors = Array.isArray(formik.errors.targets) ? formik.errors.targets : [];
                const targetError = submitted && targetErrors[index];
                return (
                  <Box className='flex flex-row items-start gap-2' key={index}>
                    <Crosshair className={cn("mb-2 flex-none", targetError && "text-error!")} />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                      <FormLabel component='label' className={targetError ? "text-error!" : undefined}>
                        {t("add-target")}
                      </FormLabel>
                      <Input
                        inputComponent={DecimalMaskInput}
                        inputProps={{
                          inputMode: "decimal",
                          scale: formik.values.method === "Load" ? 1 : 4,
                          min: 0,
                          max: 0x7fffffff / (formik.values.method === "Load" ? 10 : 10000),
                          onAccept: (value: string, event?: InputEvent) => {
                            if (!event) return;
                            const targets = [...formik.values.targets];
                            targets[index] = value;
                            void formik.setFieldValue("targets", targets);
                          },
                        }}
                        startAdornment={
                          formik.values.type ? (
                            <InputAdornment position='start'>{formik.values.type === "Compression" ? "-" : "+"}</InputAdornment>
                          ) : undefined
                        }
                        endAdornment={
                          <InputAdornment position='end'>{formik.values.method === "Load" ? "N" : formik.values.method === "Distance" ? "mm" : ""}</InputAdornment>
                        }
                        value={target}
                      />
                    </FormControl>
                  </Box>
                );
              })}
              {formik.values.targets.length < 5 && (
                <Button
                  className='ms-6.5 self-start mb-4 hidden'
                  variant='pastel'
                  color='grey'
                  startIcon={<Plus size={16} />}
                  onClick={() => void formik.setFieldValue("targets", [...formik.values.targets, ""])}
                >
                  {t("add-add-target")}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          {submitted && !formik.isValid && (
            <Alert severity='error' icon={<XSquare />} className='neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5'>
              <AlertTitle variant='subtitle1' className='pt-0.5'>
                {t("add-validation-summary")}
              </AlertTitle>
              {Object.entries(formik.errors).flatMap(([key, value]) => {
                if (key === "targets" && Array.isArray(value)) {
                  return value.flatMap((targetError, index) =>
                    typeof targetError === "string" ? (
                      <Box className='flex flex-row gap-0.5' key={`target-${index}`}>
                        <Typography className='text-error'>{t("add-target")}:</Typography>
                        <Typography className='text-text-primary'>{targetError}</Typography>
                      </Box>
                    ) : [],
                  );
                }

                return (
                  <Box className='flex flex-row gap-0.5' key={key}>
                    <Typography className='text-error'>
                      {(key === "name"
                        ? t("add-name")
                        : key === "type"
                          ? t("add-type")
                          : key === "velocity"
                            ? t("listing-velocity")
                            : key === "method"
                              ? t("add-method")
                              : key === "preload"
                                ? t("add-preload")
                                : t("add-targets")) + ":"}
                    </Typography>
                    <Typography className='text-text-primary'>{typeof value === "string" ? value : JSON.stringify(value)}</Typography>
                  </Box>
                );
              })}
            </Alert>
          )}
          <Button
            loading={formik.isSubmitting}
            loadingPosition='start'
            size='large'
            className='surface-standard'
            color='text-primary'
            variant='surface'
            type='submit'
            startIcon={<Save />}
          >
            {saveLabel ?? t("save")}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
