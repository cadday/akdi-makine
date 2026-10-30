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
  Grid,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Gauge, MoveVertical, Save, WeightTilde, XSquare } from 'lucide-react';
import { usePlcData } from '@/context/plc-context';
import useAppNotifications from '@/hooks/use-app-notifications';
import { cn } from '@/lib/utils';
import { DecimalMaskInput } from './masked-decimal-input';
import { PLC_INT32_MAX, PLC_INT32_MIN, requiredScaledNumber } from './plc-numeric-validation';

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

const manualVelocityMaximum = 75;

const validationSchema = yup.object({
  manualVelocity: requiredScaledNumber(
    'Manual Velocity',
    10,
    1,
    PLC_INT32_MIN / 10,
    manualVelocityMaximum,
    'Manual Velocity cannot exceed 75.0',
  ),
  topDistanceLimit: requiredScaledNumber('Top Distance Limit', 10000, 4, 0, PLC_INT32_MAX / 10000),
  bottomDistanceLimit: requiredScaledNumber('Bottom Distance Limit', 10000, 4, 0, -PLC_INT32_MIN / 10000),
  topLoadLimit: requiredScaledNumber('Top Load Limit', 10, 1, 0, PLC_INT32_MAX / 10),
  bottomLoadLimit: requiredScaledNumber('Bottom Load Limit', 10, 1, 0, -PLC_INT32_MIN / 10),
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
    topDistanceLimit: Math.abs(values.topDistanceLimit).toFixed(4),
    bottomDistanceLimit: Math.abs(values.bottomDistanceLimit).toFixed(4),
    topLoadLimit: Math.abs(values.topLoadLimit).toFixed(1),
    bottomLoadLimit: Math.abs(values.bottomLoadLimit).toFixed(1),
  };
}

function toPlcAdjustmentValues(values: AdjustmentValues): PlcAdjustmentValues | null {
  if (Object.values(values).some((value) => value === '')) return null;

  return {
    manualVelocity: Number(values.manualVelocity),
    topDistanceLimit: Math.abs(Number(values.topDistanceLimit)),
    bottomDistanceLimit: -Math.abs(Number(values.bottomDistanceLimit)),
    topLoadLimit: Math.abs(Number(values.topLoadLimit)),
    bottomLoadLimit: -Math.abs(Number(values.bottomLoadLimit)),
  };
}

export default function Adjustments() {
  const [submitted, setSubmitted] = useState(false);
  const [hasLoadedValues, setHasLoadedValues] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const { showError, showSuccess } = useAppNotifications();
  const { connectionStatus } = usePlcData();
  const { ipAddress, state } = connectionStatus;
  const isPlcOnline = state === 'online' && Boolean(ipAddress);
  const formik = useFormik<AdjustmentValues>({
    initialValues,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      const adjustments = toPlcAdjustmentValues(values);
      if (!adjustments || !isPlcOnline || !hasLoadedValues) return;

      try {
        await window.plcAPI.writeAdjustments(adjustments);
        helpers.resetForm({ values: fromPlcAdjustmentValues(adjustments) });
        setSubmitted(false);
        showSuccess('PLC adjustments saved.');
      } catch (error) {
        showError(`Failed to save PLC adjustments: ${String(error)}`);
      }
    },
  });
  const { resetForm } = formik;

  useEffect(() => {
    let cancelled = false;
    setSubmitted(false);
    resetForm({ values: initialValues });
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
        const adjustmentValues = fromPlcAdjustmentValues(values);
        resetForm({ values: adjustmentValues });
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
  }, [ipAddress, isPlcOnline, resetForm, showError]);

  const hasManualVelocityValue = formik.values.manualVelocity.trim() !== '';
  const fieldError = (field: keyof AdjustmentValues) =>
    (submitted || (field === 'manualVelocity' && hasManualVelocityValue)) && formik.errors[field];
  const visibleErrors = Object.entries(formik.errors).filter(
    ([field]) => submitted || (field === 'manualVelocity' && hasManualVelocityValue),
  );
  const handleMaskedInputAccept = (field: keyof AdjustmentValues) => (value: string, event?: InputEvent) => {
    if (!event) return;
    void formik.setFieldValue(field, value);
  };
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
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: 'decimal',
                      scale: 1,
                      min: PLC_INT32_MIN / 10,
                      max: PLC_INT32_MAX / 10,
                      onAccept: handleMaskedInputAccept('manualVelocity'),
                    }}
                    endAdornment={<InputAdornment position="end">mm/min</InputAdornment>}
                    value={isPlcOnline ? formik.values.manualVelocity : ''}
                  />
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
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: 'decimal',
                      scale: 4,
                      min: 0,
                      max: PLC_INT32_MAX / 10000,
                      onAccept: handleMaskedInputAccept('topDistanceLimit'),
                    }}
                    startAdornment={<InputAdornment position="start">+</InputAdornment>}
                    endAdornment={<InputAdornment position="end">mm</InputAdornment>}
                    value={isPlcOnline ? formik.values.topDistanceLimit : ''}
                  />
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
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: 'decimal',
                      scale: 4,
                      min: 0,
                      max: -PLC_INT32_MIN / 10000,
                      onAccept: handleMaskedInputAccept('bottomDistanceLimit'),
                    }}
                    startAdornment={<InputAdornment position="start">-</InputAdornment>}
                    endAdornment={<InputAdornment position="end">mm</InputAdornment>}
                    value={isPlcOnline ? formik.values.bottomDistanceLimit : ''}
                  />
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
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: 'decimal',
                      scale: 1,
                      min: 0,
                      max: PLC_INT32_MAX / 10,
                      onAccept: handleMaskedInputAccept('topLoadLimit'),
                    }}
                    startAdornment={<InputAdornment position="start">+</InputAdornment>}
                    endAdornment={<InputAdornment position="end">N</InputAdornment>}
                    value={isPlcOnline ? formik.values.topLoadLimit : ''}
                  />
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
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: 'decimal',
                      scale: 1,
                      min: 0,
                      max: -PLC_INT32_MIN / 10,
                      onAccept: handleMaskedInputAccept('bottomLoadLimit'),
                    }}
                    startAdornment={<InputAdornment position="start">-</InputAdornment>}
                    endAdornment={<InputAdornment position="end">N</InputAdornment>}
                    value={isPlcOnline ? formik.values.bottomLoadLimit : ''}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              {visibleErrors.length > 0 && (
                <Alert severity="error" icon={<XSquare />} className="neutral rounded-xl! bg-transparent! mb-2 mt-2 p-5">
                  <AlertTitle variant="subtitle1" className="pt-0.5">
                    The following inputs have errors!
                  </AlertTitle>
                  {visibleErrors.map(([field, error]) => (
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
