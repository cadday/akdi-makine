import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Gauge, MoveVertical, Save, WeightTilde, XSquare } from 'lucide-react';
import { usePlcData } from '@/context/plc-context';
import useAppNotifications from '@/hooks/use-app-notifications';
import { cn } from '@/lib/utils';

interface AdjustmentValues {
  manualVelocity: string;
  topDistanceLimit: string;
  bottomDistanceLimit: string;
  topLoadLimit: string;
  bottomLoadLimit: string;
}

const adjustmentFieldLabels: Record<string, string> = {
  manualVelocity: 'Manual Velocity',
  topDistanceLimit: 'Top Distance Limit',
  bottomDistanceLimit: 'Bottom Distance Limit',
  topLoadLimit: 'Top Load Limit',
  bottomLoadLimit: 'Bottom Load Limit',
};

const requiredScaledNumber = (label: string, scale: number, decimalPlaces: number) =>
  yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError(`${label} must be a number`)
    .test(`${decimalPlaces}-decimal-places`, `${label} may have at most ${decimalPlaces} decimal places`, (value) => {
    if (value === undefined || value === null) return true;
    if (!Number.isFinite(value)) return false;
    const scaledValue = value * scale;
    const tolerance = Number.EPSILON * Math.max(1, Math.abs(scaledValue)) * 4;
    return Math.abs(scaledValue - Math.round(scaledValue)) <= tolerance;
  })
    .min(-0x80000000 / scale, `${label} is below the PLC range`)
    .max(0x7fffffff / scale, `${label} exceeds the PLC range`)
    .required(`${label} is required`);

const validationSchema = yup.object({
  manualVelocity: requiredScaledNumber('Manual Velocity', 10, 1),
  topDistanceLimit: requiredScaledNumber('Top Distance Limit', 10000, 4),
  bottomDistanceLimit: requiredScaledNumber('Bottom Distance Limit', 10000, 4),
  topLoadLimit: requiredScaledNumber('Top Load Limit', 10, 1),
  bottomLoadLimit: requiredScaledNumber('Bottom Load Limit', 10, 1),
});

const initialValues: AdjustmentValues = {
  manualVelocity: '',
  topDistanceLimit: '',
  bottomDistanceLimit: '',
  topLoadLimit: '',
  bottomLoadLimit: '',
};

function fromPlcAdjustmentValues(values: PlcAdjustmentValues): AdjustmentValues {
  return {
    manualVelocity: values.manualVelocity.toFixed(1),
    topDistanceLimit: values.topDistanceLimit.toFixed(4),
    bottomDistanceLimit: values.bottomDistanceLimit.toFixed(4),
    topLoadLimit: values.topLoadLimit.toFixed(1),
    bottomLoadLimit: values.bottomLoadLimit.toFixed(1),
  };
}

function toPlcAdjustmentValues(values: AdjustmentValues): PlcAdjustmentValues | null {
  if (Object.values(values).some((value) => value === '')) return null;

  return {
    manualVelocity: Number(values.manualVelocity),
    topDistanceLimit: Number(values.topDistanceLimit),
    bottomDistanceLimit: Number(values.bottomDistanceLimit),
    topLoadLimit: Number(values.topLoadLimit),
    bottomLoadLimit: Number(values.bottomLoadLimit),
  };
}

export default function Adjustments() {
  const [submitted, setSubmitted] = useState(false);
  const [plcValues, setPlcValues] = useState<AdjustmentValues>(initialValues);
  const [hasLoadedValues, setHasLoadedValues] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const { showError, showSuccess } = useAppNotifications();
  const { connectionStatus } = usePlcData();
  const { ipAddress, state } = connectionStatus;
  const isPlcOnline = state === 'online' && Boolean(ipAddress);
  const formik = useFormik<AdjustmentValues>({
    initialValues: plcValues,
    enableReinitialize: true,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const adjustments = toPlcAdjustmentValues(values);
      if (!adjustments || !isPlcOnline || !hasLoadedValues) return;

      try {
        await window.plcAPI.writeAdjustments(adjustments);
        setPlcValues(fromPlcAdjustmentValues(adjustments));
        showSuccess('PLC adjustments saved.');
      } catch (error) {
        showError(`Failed to save PLC adjustments: ${String(error)}`);
      }
    },
  });

  useEffect(() => {
    let cancelled = false;
    setPlcValues(initialValues);
    setHasLoadedValues(false);

    if (!isPlcOnline) {
      setIsReading(false);
      return () => {
        cancelled = true;
      };
    }

    setIsReading(true);
    const loadAdjustments = async () => {
      try {
        const values = await window.plcAPI.readAdjustments();
        if (cancelled) return;
        setPlcValues(fromPlcAdjustmentValues(values));
        setHasLoadedValues(true);
      } catch (error) {
        if (!cancelled) showError(`Failed to read PLC adjustments: ${String(error)}`);
      } finally {
        if (!cancelled) setIsReading(false);
      }
    };

    void loadAdjustments();

    return () => {
      cancelled = true;
    };
  }, [ipAddress, isPlcOnline, showError]);

  const fieldError = (field: keyof AdjustmentValues) => submitted && formik.errors[field];
  const formDisabled = !isPlcOnline || !hasLoadedValues || isReading || formik.isSubmitting;

  return (
    <Grid size={12}>
      <Typography variant="h6" component="h2" className="mb-3">
        Adjustments
      </Typography>
      <Card>
        <CardContent>
          <Grid
            container
            size={12}
            component="form"
            noValidate
            spacing={2.5}
            onSubmit={(event) => {
              setSubmitted(true);
              formik.handleSubmit(event);
            }}
          >
            <Grid size={12}>
              <Box className="flex flex-row gap-2">
                <Gauge className={cn('flex-none', fieldError('manualVelocity') && 'text-error!')} />
                <FormControl className="outlined" variant="standard" size="small" fullWidth required disabled={formDisabled}>
                  <FormLabel
                    component="label"
                    className={fieldError('manualVelocity') ? 'text-error!' : undefined}
                  >
                    Manual Velocity
                  </FormLabel>
                  <Input
                    name="manualVelocity"
                    type="number"
                    inputProps={{ step: 0.1 }}
                    endAdornment={<InputAdornment position="end">mm/min</InputAdornment>}
                    value={isPlcOnline ? formik.values.manualVelocity : ''}
                    onChange={formik.handleChange}
                  />
                  {fieldError('manualVelocity') && (
                    <FormHelperText error>{fieldError('manualVelocity')}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box className="flex flex-row gap-2">
                <MoveVertical className={cn('flex-none', fieldError('topDistanceLimit') && 'text-error!')} />
                <FormControl className="outlined" variant="standard" size="small" fullWidth required disabled={formDisabled}>
                  <FormLabel
                    component="label"
                    className={fieldError('topDistanceLimit') ? 'text-error!' : undefined}
                  >
                    Top Distance Limit
                  </FormLabel>
                  <Input
                    name="topDistanceLimit"
                    type="number"
                    inputProps={{ step: 0.0001 }}
                    endAdornment={<InputAdornment position="end">mm</InputAdornment>}
                    value={isPlcOnline ? formik.values.topDistanceLimit : ''}
                    onChange={formik.handleChange}
                  />
                  {fieldError('topDistanceLimit') && (
                    <FormHelperText error>{fieldError('topDistanceLimit')}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box className="flex flex-row gap-2">
                <MoveVertical className={cn('flex-none', fieldError('bottomDistanceLimit') && 'text-error!')} />
                <FormControl className="outlined" variant="standard" size="small" fullWidth required disabled={formDisabled}>
                  <FormLabel
                    component="label"
                    className={fieldError('bottomDistanceLimit') ? 'text-error!' : undefined}
                  >
                    Bottom Distance Limit
                  </FormLabel>
                  <Input
                    name="bottomDistanceLimit"
                    type="number"
                    inputProps={{ step: 0.0001 }}
                    endAdornment={<InputAdornment position="end">mm</InputAdornment>}
                    value={isPlcOnline ? formik.values.bottomDistanceLimit : ''}
                    onChange={formik.handleChange}
                  />
                  {fieldError('bottomDistanceLimit') && (
                    <FormHelperText error>{fieldError('bottomDistanceLimit')}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box className="flex flex-row gap-2">
                <WeightTilde className={cn('flex-none', fieldError('topLoadLimit') && 'text-error!')} />
                <FormControl className="outlined" variant="standard" size="small" fullWidth required disabled={formDisabled}>
                  <FormLabel component="label" className={fieldError('topLoadLimit') ? 'text-error!' : undefined}>
                    Top Load Limit
                  </FormLabel>
                  <Input
                    name="topLoadLimit"
                    type="number"
                    inputProps={{ step: 0.1 }}
                    endAdornment={<InputAdornment position="end">N</InputAdornment>}
                    value={isPlcOnline ? formik.values.topLoadLimit : ''}
                    onChange={formik.handleChange}
                  />
                  {fieldError('topLoadLimit') && <FormHelperText error>{fieldError('topLoadLimit')}</FormHelperText>}
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box className="flex flex-row gap-2">
                <WeightTilde className={cn('flex-none', fieldError('bottomLoadLimit') && 'text-error!')} />
                <FormControl className="outlined" variant="standard" size="small" fullWidth required disabled={formDisabled}>
                  <FormLabel
                    component="label"
                    className={fieldError('bottomLoadLimit') ? 'text-error!' : undefined}
                  >
                    Bottom Load Limit
                  </FormLabel>
                  <Input
                    name="bottomLoadLimit"
                    type="number"
                    inputProps={{ step: 0.1 }}
                    endAdornment={<InputAdornment position="end">N</InputAdornment>}
                    value={isPlcOnline ? formik.values.bottomLoadLimit : ''}
                    onChange={formik.handleChange}
                  />
                  {fieldError('bottomLoadLimit') && (
                    <FormHelperText error>{fieldError('bottomLoadLimit')}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              {submitted && !formik.isValid && (
                <Alert severity="error" icon={<XSquare />} className="neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5">
                  <AlertTitle variant="subtitle1" className="pt-0.5">
                    The following inputs have errors!
                  </AlertTitle>
                  {Object.entries(formik.errors).map(([field, error]) => (
                    <Box className="flex flex-row gap-0.5" key={field}>
                      <Typography className="text-error">
                        {adjustmentFieldLabels[field] ?? field}:
                      </Typography>
                      <Typography className="text-text-primary">{error}</Typography>
                    </Box>
                  ))}
                </Alert>
              )}
              <Button
                loading={formik.isSubmitting}
                loadingPosition="start"
                size="large"
                disabled={formDisabled}
                color="grey"
                variant="pastel"
                type="submit"
                startIcon={<Save />}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
