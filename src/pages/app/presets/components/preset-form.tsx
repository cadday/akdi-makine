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
  Typography,
} from "@mui/material";
import { ChevronDown, Gauge, Save, Tag, Weight, WeightTilde, XSquare } from "lucide-react";
import type { PresetRecord, PresetType } from "@/context/db-context";
import { PRESET_TYPES } from "@/lib/db";
import useAppNotifications from "@/hooks/use-app-notifications";

type PresetSaveInput = Omit<PresetRecord, "id" | "createdAt" | "updatedAt">;
type PresetFormValues = Omit<PresetSaveInput, "type" | "preload" | "load" | "speed"> & {
  type: PresetType | "";
  preload: number | "";
  load: number | "";
  speed: number | "";
};

interface PresetFormProps {
  onSave: (input: PresetSaveInput) => Promise<void>;
}

const validationSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  type: yup.string().oneOf(PRESET_TYPES).required("Type is required"),
  preload: yup.number().typeError("Enter a number").min(0, "Must be zero or greater").required("Preload is required"),
  load: yup.number().typeError("Enter a number").min(0, "Must be zero or greater").required("Load is required"),
  speed: yup.number().typeError("Enter a number").min(0, "Must be zero or greater").required("Speed is required"),
});

export default function PresetForm({ onSave }: PresetFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { showError } = useAppNotifications();
  const formik = useFormik<PresetFormValues>({
    initialValues: { name: "", type: "", preload: "", load: "", speed: "" },
    validationSchema,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      if (!values.type || values.preload === "" || values.load === "" || values.speed === "") return;

      try {
        await onSave({
          name: values.name.trim(),
          type: values.type,
          preload: Number(values.preload),
          load: Number(values.load),
          speed: Number(values.speed),
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
                <Tag className={fieldError("name") ? "text-error!" : undefined} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("name") ? "text-error!" : undefined}>
                    Name
                  </FormLabel>
                  <Input name='name' value={formik.values.name} onChange={formik.handleChange} />
                </FormControl>
              </Box>

              <Box className='flex flex-row gap-2'>
                <Gauge className={fieldError("type") ? "text-error!" : undefined} />
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
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Typography variant='h6' component='h6' className='mb-3'>
            Parameters
          </Typography>
          <Card>
            <CardContent className='-mb-4'>
              <Box className='flex flex-row gap-2'>
                <WeightTilde className={fieldError("preload") ? "text-error!" : undefined} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("preload") ? "text-error!" : undefined}>
                    Preload
                  </FormLabel>
                  <Input
                    name='preload'
                    type='number'
                    inputProps={{ min: 0, step: "any" }}
                    endAdornment={<InputAdornment position='end'>N</InputAdornment>}
                    value={formik.values.preload}
                    onChange={(event) => void formik.setFieldValue("preload", event.target.value === "" ? "" : Number(event.target.value))}
                  />
                </FormControl>
              </Box>

              <Box className='flex flex-row gap-2'>
                <Weight className={fieldError("load") ? "text-error!" : undefined} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("load") ? "text-error!" : undefined}>
                    Load
                  </FormLabel>
                  <Input
                    name='load'
                    type='number'
                    inputProps={{ min: 0, step: "any" }}
                    endAdornment={<InputAdornment position='end'>N</InputAdornment>}
                    value={formik.values.load}
                    onChange={(event) => void formik.setFieldValue("load", event.target.value === "" ? "" : Number(event.target.value))}
                  />
                </FormControl>
              </Box>

              <Box className='flex flex-row gap-2'>
                <Gauge className={fieldError("speed") ? "text-error!" : undefined} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                  <FormLabel component='label' className={fieldError("speed") ? "text-error!" : undefined}>
                    Speed
                  </FormLabel>
                  <Input
                    name='speed'
                    type='number'
                    inputProps={{ min: 0, step: "any" }}
                    endAdornment={<InputAdornment position='end'>mm/s</InputAdornment>}
                    value={formik.values.speed}
                    onChange={(event) => void formik.setFieldValue("speed", event.target.value === "" ? "" : Number(event.target.value))}
                  />
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          {submitted && !formik.isValid && (
            <Alert severity='error' icon={<XSquare />} className='neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5'>
              <AlertTitle variant='subtitle2' className='pt-0.5'>
                The following inputs have errors!
              </AlertTitle>
              {Object.entries(formik.errors).map(([key, value]) => (
                <Box className='flex flex-row gap-0.5' key={key}>
                  <Typography className='text-error'>{key[0].toUpperCase() + key.slice(1)}:</Typography>
                  <Typography className='text-text-primary'>{typeof value === "string" ? value : JSON.stringify(value)}</Typography>
                </Box>
              ))}
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
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
