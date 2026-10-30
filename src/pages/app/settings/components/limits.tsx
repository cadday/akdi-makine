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
import { MoveVertical, Save, WeightTilde, XSquare } from 'lucide-react';
import { usePlcData } from '@/context/plc-context';
import useAppNotifications from '@/hooks/use-app-notifications';
import { cn } from '@/lib/utils';
import { DecimalMaskInput } from './masked-decimal-input';
import { PLC_INT32_MAX, requiredScaledNumber } from './plc-numeric-validation';

interface LimitValues {
  testDistanceLimit: string;
  testLoadLimit: string;
}

const limitFieldLabels: Record<string, string> = {
  testDistanceLimit: 'Test Distance Limit',
  testLoadLimit: 'Test Load Limit',
};

const validationSchema = yup.object({
  testDistanceLimit: requiredScaledNumber('Test Distance Limit', 10000, 4, 0, PLC_INT32_MAX / 10000),
  testLoadLimit: requiredScaledNumber('Test Load Limit', 10, 1, 0, PLC_INT32_MAX / 10),
});

const initialValues: LimitValues = {
  testDistanceLimit: '',
  testLoadLimit: '',
};

function fromPlcLimitValues(values: PlcLimitsValues): LimitValues {
  return {
    testDistanceLimit: Math.abs(values.testDistanceLimit).toFixed(4),
    testLoadLimit: Math.abs(values.testLoadLimit).toFixed(1),
  };
}

function toPlcLimitValues(values: LimitValues): PlcLimitsValues | null {
  if (Object.values(values).some((value) => value === '')) return null;

  return {
    testDistanceLimit: Math.abs(Number(values.testDistanceLimit)),
    testLoadLimit: Math.abs(Number(values.testLoadLimit)),
  };
}

export default function Limits() {
  const [submitted, setSubmitted] = useState(false);
  const [hasLoadedValues, setHasLoadedValues] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const { showError, showSuccess } = useAppNotifications();
  const { connectionStatus } = usePlcData();
  const { ipAddress, state } = connectionStatus;
  const isPlcOnline = state === 'online' && Boolean(ipAddress);
  const formik = useFormik<LimitValues>({
    initialValues,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      const limits = toPlcLimitValues(values);
      if (!limits || !isPlcOnline || !hasLoadedValues) return;

      try {
        await window.plcAPI.writeLimits(limits);
        helpers.resetForm({ values: fromPlcLimitValues(limits) });
        setSubmitted(false);
        showSuccess('PLC limits saved.');
      } catch (error) {
        showError(`Failed to save PLC limits: ${String(error)}`);
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
    const loadLimits = async () => {
      try {
        const values = await window.plcAPI.readLimits();
        if (cancelled) return;
        resetForm({ values: fromPlcLimitValues(values) });
        setHasLoadedValues(true);
      } catch (error) {
        if (!cancelled) showError(`Failed to read PLC limits: ${String(error)}`);
      } finally {
        if (!cancelled) setIsReading(false);
      }
    };

    void loadLimits();

    return () => {
      cancelled = true;
    };
  }, [ipAddress, isPlcOnline, resetForm, showError]);

  const fieldError = (field: keyof LimitValues) => submitted && formik.errors[field];
  const handleMaskedInputAccept = (field: keyof LimitValues) => (value: string, event?: InputEvent) => {
    if (!event) return;
    void formik.setFieldValue(field, value);
  };
  const formDisabled = !isPlcOnline || !hasLoadedValues || isReading || formik.isSubmitting;

  return (
    <Grid size={12}>
      <Typography variant="h6" component="h2" className="mb-3">
        Limits
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
                <MoveVertical className={cn('flex-none', fieldError('testDistanceLimit') && 'text-error!')} />
                <FormControl className="outlined" variant="standard" size="small" fullWidth required disabled={formDisabled}>
                  <FormLabel
                    component="label"
                    className={fieldError('testDistanceLimit') ? 'text-error!' : undefined}
                  >
                    Test Distance Limit
                  </FormLabel>
                  <Input
                    name="testDistanceLimit"
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: 'decimal',
                      scale: 4,
                      min: 0,
                      max: PLC_INT32_MAX / 10000,
                      onAccept: handleMaskedInputAccept('testDistanceLimit'),
                    }}
                    startAdornment={<InputAdornment position="start">+</InputAdornment>}
                    endAdornment={<InputAdornment position="end">mm</InputAdornment>}
                    value={isPlcOnline ? formik.values.testDistanceLimit : ''}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box className="flex flex-row gap-2">
                <WeightTilde className={cn('flex-none', fieldError('testLoadLimit') && 'text-error!')} />
                <FormControl className="outlined" variant="standard" size="small" fullWidth required disabled={formDisabled}>
                  <FormLabel component="label" className={fieldError('testLoadLimit') ? 'text-error!' : undefined}>
                    Test Load Limit
                  </FormLabel>
                  <Input
                    name="testLoadLimit"
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: 'decimal',
                      scale: 1,
                      min: 0,
                      max: PLC_INT32_MAX / 10,
                      onAccept: handleMaskedInputAccept('testLoadLimit'),
                    }}
                    startAdornment={<InputAdornment position="start">+</InputAdornment>}
                    endAdornment={<InputAdornment position="end">N</InputAdornment>}
                    value={isPlcOnline ? formik.values.testLoadLimit : ''}
                  />
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
                      <Typography className="text-error">{limitFieldLabels[field] ?? field}:</Typography>
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
