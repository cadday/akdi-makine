import { useState } from "react";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { Bookmark, ChevronDown, Clock3, Crosshair, Gauge, PencilRuler, Plus, Save, Split, X, XSquare } from "lucide-react";
import type { PresetBase, PresetRecord, PresetType } from "@/context/db-context";
import { PRESET_BASES, PRESET_TYPES } from "@/lib/db";
import useAppNotifications from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";

type PresetSaveInput = Omit<PresetRecord, "id" | "createdAt" | "updatedAt">;
type PresetFormValues = Omit<PresetSaveInput, "type" | "duration" | "base" | "speed" | "targets"> & {
  type: PresetType | "";
  duration: number | "";
  speed: number | "";
  base: PresetBase | "";
  targets: Array<number | "">;
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
    duration: preset?.duration ?? "",
    speed: preset?.speed ?? "",
    base: preset?.base ?? "",
    targets: preset?.targets?.length ? [...preset.targets] : [""],
  };
}

const validationSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  type: yup.string().oneOf(PRESET_TYPES).required("Type is required"),
  duration: yup.number().typeError("Enter a number").min(0, "Must be zero or greater").required("Duration is required"),
  speed: yup.number().typeError("Enter a number").moreThan(0, "Must be greater than zero").required("Speed is required"),
  base: yup.string().oneOf(PRESET_BASES).required("Base is required"),
  targets: yup
    .array()
    .of(yup.number().typeError("Enter a number").moreThan(0, "Must be greater than zero").required("Target is required"))
    .min(1, "At least one target is required")
    .max(5, "A maximum of five targets is allowed")
    .required("At least one target is required"),
});

export default function PresetForm({ onSave, preset, initialPreset, saveLabel = "Save" }: PresetFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { showError } = useAppNotifications();
  const formik = useFormik<PresetFormValues>({
    initialValues: getInitialValues(preset ?? initialPreset),
    enableReinitialize: true,
    validationSchema,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      if (!values.type || !values.base || values.duration === "" || values.speed === "" || values.targets.some((target) => target === "")) return;

      try {
        await onSave({
          name: values.name.trim(),
          type: values.type,
          duration: Number(values.duration),
          speed: Number(values.speed),
          base: values.base,
          targets: values.targets.map(Number),
        });
      } catch (error) {
        showError(`Failed to save preset: ${String(error)}`);
      }
    },
  });

  const fieldError = (field: keyof PresetFormValues) => submitted && formik.errors[field];

  return (
    <Grid container size={12} className='items-start w-full' spacing={5}>
      <Grid
        container
        size={{ xs: 12 }}
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
            Definition
          </Typography>
          <Card>
            <CardContent className='-mb-4'>
              <Box className='flex flex-row gap-2'>
                <Bookmark className={cn("flex-none", fieldError("name") && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("name") ? "text-error!" : undefined}>
                    Name
                  </FormLabel>
                  <Input name='name' value={formik.values.name} onChange={formik.handleChange} />
                </FormControl>
              </Box>

              <Box className='flex flex-row gap-2'>
                <PencilRuler className={cn("flex-none", fieldError("type") && "text-error!")} />
                <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                  <FormLabel component='label' className={fieldError("type") ? "text-error!" : undefined}>
                    Type
                  </FormLabel>
                  <Select<PresetType | "">
                    value={formik.values.type}
                    onChange={(event) => void formik.setFieldValue("type", event.target.value)}
                    IconComponent={ChevronDown}
                    MenuProps={{ className: "outlined" }}
                  >
                    {PRESET_TYPES.map((presetType) => (
                      <MenuItem key={presetType} value={presetType}>
                        {presetType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box className='flex flex-row gap-2'>
                <Gauge className={cn("flex-none", fieldError("speed") && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("speed") ? "text-error!" : undefined}>
                    Speed
                  </FormLabel>
                  <Input
                    type='number'
                    inputProps={{ min: 0, step: "any" }}
                    endAdornment={<InputAdornment position='end'>mm/s</InputAdornment>}
                    value={formik.values.speed}
                    onChange={(event) => void formik.setFieldValue("speed", event.target.value === "" ? "" : Number(event.target.value))}
                  />
                </FormControl>
              </Box>
              <Box className='flex flex-row gap-2'>
                <Clock3 className={cn("flex-none", fieldError("duration") && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("duration") ? "text-error!" : undefined}>
                    Mock Duration
                  </FormLabel>
                  <Input
                    name='duration'
                    type='number'
                    inputProps={{ min: 0, step: "any" }}
                    endAdornment={<InputAdornment position='end'>s</InputAdornment>}
                    value={formik.values.duration}
                    onChange={(event) => void formik.setFieldValue("duration", event.target.value === "" ? "" : Number(event.target.value))}
                  />
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Typography variant='h6' component='h6' className='mb-3'>
            Test Base and Parameters
          </Typography>
          <Card>
            <CardContent className='-mb-4'>
              <Box className='flex flex-row gap-2'>
                <Split className={cn("flex-none", fieldError("base") && "text-error!")} />
                <FormControl fullWidth size='small' variant='standard' className='outlined' required>
                  <FormLabel component='label' className={fieldError("base") ? "text-error!" : undefined}>
                    Base
                  </FormLabel>
                  <Select<PresetBase | "">
                    value={formik.values.base}
                    onChange={(event) => {
                      const nextBase = event.target.value as PresetBase | "";
                      void formik.setFieldValue("base", nextBase);
                      if (nextBase !== formik.values.base) void formik.setFieldValue("targets", [""]);
                    }}
                    IconComponent={ChevronDown}
                    MenuProps={{ className: "outlined" }}
                  >
                    {PRESET_BASES.map((base) => (
                      <MenuItem key={base} value={base}>
                        {base}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {formik.values.targets.map((target, index) => {
                const targetErrors = Array.isArray(formik.errors.targets) ? formik.errors.targets : [];
                const targetError = submitted && targetErrors[index];
                return (
                  <Box className='flex flex-row items-start gap-2' key={index}>
                    <Crosshair className={cn("mb-2 flex-none", targetError && "text-error!")} />
                    <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                      <FormLabel component='label' className={targetError ? "text-error!" : undefined}>
                        Target {index + 1}
                      </FormLabel>
                      <Input
                        type='number'
                        inputProps={{ min: 0, step: "any" }}
                        endAdornment={
                          <InputAdornment position='end'>{formik.values.base === "Force" ? "N" : formik.values.base === "Distance" ? "mm" : ""}</InputAdornment>
                        }
                        value={target}
                        onChange={(event) => {
                          const targets = [...formik.values.targets];
                          targets[index] = event.target.value === "" ? "" : Number(event.target.value);
                          void formik.setFieldValue("targets", targets);
                        }}
                      />
                    </FormControl>
                    <Tooltip title={`Remove Target ${index + 1}`} placement='bottom'>
                      <span>
                        <Button
                          disabled={index === 0}
                          aria-label={`Remove Target ${index + 1}`}
                          className='mt-7 icon-only hover:text-error hover:border-error-light/5 hover:bg-error-light/10'
                          color='grey'
                          variant='outlined'
                          onClick={() =>
                            void formik.setFieldValue(
                              "targets",
                              formik.values.targets.filter((_, targetIndex) => targetIndex !== index),
                            )
                          }
                          startIcon={
                            <Box className='flex h-5 w-5 items-center justify-center'>
                              <X size={14} />
                            </Box>
                          }
                        />
                      </span>
                    </Tooltip>
                  </Box>
                );
              })}
              {formik.values.targets.length < 5 && (
                <Button
                  className='ms-6.5 self-start mb-4'
                  variant='pastel'
                  color='grey'
                  startIcon={<Plus size={16} />}
                  onClick={() => void formik.setFieldValue("targets", [...formik.values.targets, ""])}
                >
                  Add Target
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          {submitted && !formik.isValid && (
            <Alert severity='error' icon={<XSquare />} className='neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5'>
              <AlertTitle variant='subtitle1' className='pt-0.5'>
                The following inputs have errors!
              </AlertTitle>
              {Object.entries(formik.errors).flatMap(([key, value]) => {
                if (key === "targets" && Array.isArray(value)) {
                  return value.flatMap((targetError, index) =>
                    typeof targetError === "string" ? (
                      <Box className='flex flex-row gap-0.5' key={`target-${index}`}>
                        <Typography className='text-error'>Target {index + 1}:</Typography>
                        <Typography className='text-text-primary'>{targetError}</Typography>
                      </Box>
                    ) : [],
                  );
                }

                return (
                  <Box className='flex flex-row gap-0.5' key={key}>
                    <Typography className='text-error'>{key[0].toUpperCase() + key.slice(1)}:</Typography>
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
            {saveLabel}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
