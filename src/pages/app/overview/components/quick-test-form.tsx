import { useEffect, useMemo, useState } from "react";
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
  const navigate = useNavigate();
  const { getSpecimens, getPresets, getConnectedMachine, createTest } = useDb();
  const { showError } = useAppNotifications();
  const [specimens, setSpecimens] = useState<SpecimenRecord[]>([]);
  const [presets, setPresets] = useState<PresetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [defaultTestName] = useState(createDefaultTestName);

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
        const message = `Failed to load Quick Test options: ${String(error)}`;
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
  }, [getPresets, getSpecimens, showError]);

  const formik = useFormik<QuickTestValues>({
    initialValues: { name: defaultTestName, specimenId: "", presetId: "" },
    validationSchema: yup.object({
      name: yup.string().trim().required("Test name is required"),
      specimenId: yup.string().required("Specimen is required"),
      presetId: yup.string().required("Preset is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const specimen = specimens.find((item) => item.id === values.specimenId);
      const preset = presets.find((item) => item.id === values.presetId);
      if (!specimen || !preset) {
        showError("The selected specimen or preset is no longer available.");
        return;
      }

      try {
        const connectedMachine = await getConnectedMachine();
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
            duration: preset.duration,
            speed: preset.speed,
            base: preset.base,
            targets: [...(preset.targets ?? [])],
          },
          customData: {},
        });
        onTestCreated?.();
        navigate(`/tests/${testId}`);
      } catch (error) {
        showError(`Failed to save test: ${String(error)}`);
      }
    },
  });

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
            Name
          </FormLabel>
          <Input name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </FormControl>
      </Box>

      <Box className='flex flex-row gap-2'>
        <DraftingCompass className={cn("flex-none", specimenError && "text-error!")} />
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

      <Box className='flex flex-row gap-2'>
        <SlidersVertical className={cn("flex-none", presetError && "text-error!")} />
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

      {submitted && !formik.isValid && (
        <Alert severity='error' icon={<XSquare />} className='neutral rounded-xl! bg-transparent! mb-2 mt-2 py-3 px-5'>
          <AlertTitle>Check the highlighted fields</AlertTitle>
          {validationErrors.map(([key, message]) => (
            <Box className='flex flex-row gap-0.5' key={key}>
              <Typography className='text-error'>{capitalize(key)}:</Typography>
              <Typography>{message}</Typography>
            </Box>
          ))}
        </Alert>
      )}

      {loadError && <Typography className='text-error'>{loadError}</Typography>}
      <Button
        disabled={isLoading || Boolean(loadError)}
        loading={formik.isSubmitting}
        loadingPosition='start'
        type='submit'
        variant='pastel'
        color='grey'
        size='large'
        className='self-start ms-6.5 mt-2'
        startIcon={<Play />}
      >
        Start
      </Button>
    </Box>
  );
}
