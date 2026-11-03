import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  capitalize,
  FormControl,
  FormLabel,
  Input,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { Bookmark, ChevronDown, DraftingCompass, Play, SlidersVertical, X, XSquare } from "lucide-react";
import { useDb, type PresetRecord, type SpecimenRecord } from "@/context/db-context";
import { useTestRun } from "@/context/test-run-context";
import { isMachineInterlocked, usePlcData } from "@/context/plc-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";

interface QuickTestValues {
  name: string;
  specimenId: string;
  presetId: string;
}

function collectErrorMessages(errors: unknown, prefix = ""): Array<[string, string]> {
  if (typeof errors === "string") return [[prefix, errors]];
  if (!errors || typeof errors !== "object") return [];
  return Object.entries(errors).flatMap(([key, value]) => collectErrorMessages(value, prefix ? `${prefix}.${key}` : key));
}

function createDefaultTestName() {
  const now = new Date();
  const twoDigits = (value: number) => String(value).padStart(2, "0");
  return `Test ${twoDigits(now.getDate())}-${twoDigits(now.getMonth() + 1)}-${String(now.getFullYear()).slice(-2)} ${twoDigits(now.getHours())}:${twoDigits(now.getMinutes())}`;
}

export default function QuickTestForm({ onTestCreated }: { onTestCreated?: () => void }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getSpecimens, getPresets, getConnectedMachine, createTest } = useDb();
  const { hasActiveTest, startTestRun } = useTestRun();
  const { connectionStatus, interlockStatus } = usePlcData();
  const { showError } = useAppNotifications();
  const [specimens, setSpecimens] = useState<SpecimenRecord[]>([]);
  const [presets, setPresets] = useState<PresetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [defaultTestName] = useState(createDefaultTestName);
  const testCreationDisabled =
    isMachineInterlocked(interlockStatus) || (connectionStatus.state === "online" && !interlockStatus);

  useEffect(() => {
    let cancelled = false;
    const loadOptions = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [specimenRecords, presetRecords] = await Promise.all([getSpecimens(), getPresets()]);
        if (cancelled) return;
        setSpecimens(specimenRecords);
        setPresets(presetRecords);
      } catch (error) {
        if (cancelled) return;
        const message = t("quick-test-load-error", { error: String(error) });
        setLoadError(message);
        showError(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadOptions();
    return () => {
      cancelled = true;
    };
  }, [getPresets, getSpecimens, showError, t]);

  const formik = useFormik<QuickTestValues>({
    initialValues: { name: defaultTestName, specimenId: "", presetId: "" },
    validationSchema: yup.object({
      name: yup.string().trim().required(t("quick-test-name-required")),
      specimenId: yup.string().required(t("quick-test-specimen-required")),
      presetId: yup.string().required(t("quick-test-preset-required")),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      if (testCreationDisabled) {
        showError(t("quick-test-interlock-error"));
        return;
      }

      if (hasActiveTest) {
        showError(t("quick-test-already-running"));
        return;
      }

      const specimen = specimens.find((item) => item.id === values.specimenId);
      const preset = presets.find((item) => item.id === values.presetId);
      if (!specimen || !preset) {
        showError(t("quick-test-selection-unavailable"));
        return;
      }

      try {
        const connectedMachine = await getConnectedMachine();
        if (!connectedMachine) {
          showError(t("quick-test-machine-required"));
          return;
        }

        const testId = await createTest({
          name: values.name.trim(),
          machineIP: connectedMachine?.ipAddress ?? null,
          specimenId: specimen.id,
          presetId: preset.id,
          specimenSnapshot: {
            name: specimen.name,
            customData: { ...specimen.customData },
            geometry: specimen.geometry,
            diameter: specimen.diameter,
            side1: specimen.side1,
            side2: specimen.side2,
            height: specimen.height,
          },
          presetSnapshot: {
            name: preset.name,
            type: preset.type,
            velocity: preset.velocity,
            method: preset.method,
            preload: preset.method === "Load" ? (preset.preload ?? 0) : undefined,
            targets: [...(preset.targets ?? [])],
          },
          customData: {},
        });
        try {
          await startTestRun({
            testId,
            preset: {
              type: preset.type,
              method: preset.method,
              velocity: preset.velocity,
              preload: preset.method === "Load" ? (preset.preload ?? 0) : undefined,
              targets: [...(preset.targets ?? [])],
            },
          });
        } catch (error) {
          showError(t("quick-test-start-error", { error: String(error) }));
        }
        onTestCreated?.();
        navigate(`/tests/${testId}`);
      } catch (error) {
        showError(t("quick-test-save-error", { error: String(error) }));
      }
    },
  });
  const { validateForm } = formik;

  useEffect(() => {
    void validateForm();
  }, [i18n.language, validateForm]);

  const selectedSpecimen = specimens.find((specimen) => specimen.id === formik.values.specimenId) ?? null;
  const selectedPreset = presets.find((preset) => preset.id === formik.values.presetId) ?? null;
  const specimenError = submitted && typeof formik.errors.specimenId === "string" ? formik.errors.specimenId : undefined;
  const presetError = submitted && typeof formik.errors.presetId === "string" ? formik.errors.presetId : undefined;
  const validationErrors = useMemo(() => collectErrorMessages(formik.errors), [formik.errors]);

  return (
    <Box
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
        <Bookmark className={cn("flex-none", submitted && formik.errors.name && "text-error!")} />
        <FormControl className='outlined' variant='standard' size='small' fullWidth required>
          <FormLabel component='label' className={cn(submitted && formik.errors.name && "text-error!")}>
            {t("quick-test-name")}
          </FormLabel>
          <Input name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </FormControl>
      </Box>

      <Box className='flex flex-row gap-2'>
        <DraftingCompass className={cn("flex-none", specimenError && "text-error!")} />
        <FormControl fullWidth required>
          <FormLabel component='label' className={cn(specimenError && "text-error!")}>
            {t("specimen")}
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
            noOptionsText={isLoading ? t("quick-test-loading-specimens") : t("no-specimens-found")}
            slotProps={{ popper: { className: "outlined" } }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='standard'
                className='outlined'
                placeholder={t("quick-test-search-specimens")}
                slotProps={{
                  htmlInput: { ...params.slotProps.htmlInput, autoComplete: "new-password" },
                  input: params.slotProps.input,
                }}
              />
            )}
          />
        </FormControl>
      </Box>

      <Box className='flex flex-row gap-2'>
        <SlidersVertical className={cn("flex-none", presetError && "text-error!")} />
        <FormControl fullWidth required>
          <FormLabel component='label' className={cn(presetError && "text-error!")}>
            {t("preset")}
          </FormLabel>
          <Autocomplete<PresetRecord, false, false, false>
            size='small'
            options={presets}
            value={selectedPreset}
            onChange={(_, preset) => void formik.setFieldValue("presetId", preset?.id ?? "")}
            filterOptions={createFilterOptions<PresetRecord>({ stringify: (preset) => `${preset.name} ${preset.type}` })}
            getOptionLabel={(preset) => preset.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, preset) => (
              <li {...props}>
                <Box className='flex w-full items-center justify-between gap-3'>
                  <Typography>{preset.name}</Typography>
                  <Button
                    component='span'
                    className='pointer-events-none self-center py-1 rounded-2xs'
                    size='tiny'
                    color={preset.type === "Tensile" ? "primary" : "accent-5"}
                    variant='outlined'
                  >
                    {preset.type === "Tensile" ? t("listing-tensile") : t("listing-compression")}
                  </Button>
                </Box>
              </li>
            )}
            popupIcon={<ChevronDown />}
            clearIcon={<X />}
            loading={isLoading}
            noOptionsText={isLoading ? t("quick-test-loading-presets") : t("no-presets-found")}
            slotProps={{ popper: { className: "outlined" } }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='standard'
                className='outlined'
                placeholder={t("quick-test-search-presets")}
                slotProps={{
                  htmlInput: { ...params.slotProps.htmlInput, autoComplete: "new-password" },
                  input: params.slotProps.input,
                }}
              />
            )}
          />
        </FormControl>
      </Box>

      {submitted && !formik.isValid && (
        <Alert severity='error' icon={<XSquare />} className='neutral rounded-xl! bg-transparent! mb-2 mt-2 py-3 px-5'>
          <AlertTitle>{t("quick-test-validation-summary")}</AlertTitle>
          {validationErrors.map(([key, message]) => (
            <Box className='flex flex-row gap-0.5' key={key}>
              <Typography className='text-error'>
                {key === "name" ? t("quick-test-name") : key === "specimenId" ? t("specimen") : key === "presetId" ? t("preset") : capitalize(key)}:
              </Typography>
              <Typography>{message}</Typography>
            </Box>
          ))}
        </Alert>
      )}

      {loadError && <Typography className='text-error'>{loadError}</Typography>}
      <Button
        disabled={isLoading || Boolean(loadError) || hasActiveTest || testCreationDisabled}
        loading={formik.isSubmitting}
        loadingPosition='start'
        type='submit'
        variant='pastel'
        color='grey'
        size='large'
        className='self-start ms-6.5 mt-2'
        startIcon={<Play />}
      >
        {t("quick-test-start")}
      </Button>
    </Box>
  );
}
