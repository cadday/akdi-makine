import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { Alert, AlertTitle, Box, Button, Card, CardContent, FormControl, FormLabel, Grid, Input, InputAdornment, Typography } from "@mui/material";
import { LucideRulerDimensionLine, Save, Weight, XSquare } from "lucide-react";
import { usePlcData } from "@/context/plc-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";
import { DecimalMaskInput } from "@/components/base-ui/masked-decimal-input";
import { PLC_INT32_MAX, requiredScaledNumber } from "./plc-numeric-validation";

interface LimitValues {
  testDistanceLimit: string;
  testLoadLimit: string;
}

const initialValues: LimitValues = {
  testDistanceLimit: "",
  testLoadLimit: "",
};

function fromPlcLimitValues(values: PlcLimitsValues): LimitValues {
  return {
    testDistanceLimit: Math.abs(values.testDistanceLimit).toFixed(4),
    testLoadLimit: Math.abs(values.testLoadLimit).toFixed(1),
  };
}

function toPlcLimitValues(values: LimitValues): PlcLimitsValues | null {
  if (Object.values(values).some((value) => value === "")) return null;

  return {
    testDistanceLimit: Math.abs(Number(values.testDistanceLimit)),
    testLoadLimit: Math.abs(Number(values.testLoadLimit)),
  };
}

export default function Limits() {
  const { t, i18n } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [hasLoadedValues, setHasLoadedValues] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const { showError, showSuccess } = useAppNotifications();
  const { connectionStatus } = usePlcData();
  const { ipAddress, state } = connectionStatus;
  const isPlcOnline = state === "online" && Boolean(ipAddress);
  const limitFieldLabels: Record<string, string> = {
    testDistanceLimit: t("settings-limits-test-distance-limit"),
    testLoadLimit: t("settings-limits-test-load-limit"),
  };
  const validationMessages = (label: string, decimalPlaces: number) => ({
    typeError: t("settings-validation-number", { label }),
    precisionError: t("settings-validation-precision", { label, decimalPlaces }),
    minError: t("settings-validation-below-range", { label }),
    maxError: t("settings-validation-above-range", { label }),
    required: t("settings-validation-required", { label }),
  });
  const validationSchema = yup.object({
    testDistanceLimit: requiredScaledNumber(10000, 4, 0, PLC_INT32_MAX / 10000, validationMessages(limitFieldLabels.testDistanceLimit, 4)),
    testLoadLimit: requiredScaledNumber(10, 1, 0, PLC_INT32_MAX / 10, validationMessages(limitFieldLabels.testLoadLimit, 1)),
  });
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
        showSuccess(t("settings-limits-saved"));
      } catch (error) {
        showError(t("settings-limits-save-error", { error: String(error) }));
      }
    },
  });
  const { resetForm, validateForm } = formik;

  useEffect(() => {
    void validateForm();
  }, [validateForm, i18n.language]);

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
        if (!cancelled) showError(i18n.t("settings-limits-read-error", { error: String(error) }));
      } finally {
        if (!cancelled) setIsReading(false);
      }
    };

    void loadLimits();

    return () => {
      cancelled = true;
    };
  }, [ipAddress, isPlcOnline, i18n, resetForm, showError]);

  const fieldError = (field: keyof LimitValues) => submitted && formik.errors[field];
  const handleMaskedInputAccept = (field: keyof LimitValues) => (value: string, event?: InputEvent) => {
    if (!event) return;
    void formik.setFieldValue(field, value);
  };
  const formDisabled = !isPlcOnline || !hasLoadedValues || isReading || formik.isSubmitting;

  return (
    <Grid size={12}>
      <Typography variant='h6' component='h2' className='mb-3'>
        {t("settings-limits-title")}
      </Typography>
      <Card>
        <CardContent>
          <Grid
            container
            size={12}
            component='form'
            noValidate
            spacing={0}
            onSubmit={(event) => {
              setSubmitted(true);
              formik.handleSubmit(event);
            }}
          >
            <Grid size={12}>
              <Box className='flex flex-row gap-2'>
                <LucideRulerDimensionLine className={cn("flex-none", fieldError("testDistanceLimit") && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required disabled={formDisabled}>
                  <FormLabel component='label' className={fieldError("testDistanceLimit") ? "text-error!" : undefined}>
                    {t("settings-limits-test-distance-limit")}
                  </FormLabel>
                  <Input
                    name='testDistanceLimit'
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: "decimal",
                      scale: 4,
                      min: 0,
                      max: PLC_INT32_MAX / 10000,
                      onAccept: handleMaskedInputAccept("testDistanceLimit"),
                    }}
                    startAdornment={<InputAdornment position='start'>+</InputAdornment>}
                    endAdornment={<InputAdornment position='end'>mm</InputAdornment>}
                    value={isPlcOnline ? formik.values.testDistanceLimit : ""}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box className='flex flex-row gap-2'>
                <Weight className={cn("flex-none", fieldError("testLoadLimit") && "text-error!")} />
                <FormControl className='outlined' variant='standard' size='small' fullWidth required disabled={formDisabled}>
                  <FormLabel component='label' className={fieldError("testLoadLimit") ? "text-error!" : undefined}>
                    {t("settings-limits-test-load-limit")}
                  </FormLabel>
                  <Input
                    name='testLoadLimit'
                    inputComponent={DecimalMaskInput}
                    inputProps={{
                      inputMode: "decimal",
                      scale: 1,
                      min: 0,
                      max: PLC_INT32_MAX / 10,
                      onAccept: handleMaskedInputAccept("testLoadLimit"),
                    }}
                    startAdornment={<InputAdornment position='start'>+</InputAdornment>}
                    endAdornment={<InputAdornment position='end'>N</InputAdornment>}
                    value={isPlcOnline ? formik.values.testLoadLimit : ""}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid size={12}>
              {submitted && !formik.isValid && (
                <Alert severity='error' icon={<XSquare />} className='neutral rounded-3xl! bg-transparent! mb-2 mt-2 p-5'>
                  <AlertTitle variant='subtitle1' className='pt-0.5'>
                    {t("settings-validation-error-summary")}
                  </AlertTitle>
                  {Object.entries(formik.errors).map(([field, error]) => (
                    <Box className='flex flex-row gap-0.5' key={field}>
                      <Typography className='text-error'>{limitFieldLabels[field] ?? field}:</Typography>
                      <Typography className='text-text-primary'>{error}</Typography>
                    </Box>
                  ))}
                </Alert>
              )}
              <Button
                className='ms-7'
                loading={formik.isSubmitting}
                loadingPosition='start'
                size='large'
                disabled={formDisabled}
                color='grey'
                variant='pastel'
                type='submit'
                startIcon={<Save />}
              >
                {t("save")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
