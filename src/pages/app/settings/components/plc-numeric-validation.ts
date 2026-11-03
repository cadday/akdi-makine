import * as yup from 'yup';

export const PLC_INT32_MIN = -0x80000000;
export const PLC_INT32_MAX = 0x7fffffff;

export interface ScaledNumberValidationMessages {
  typeError: string;
  precisionError: string;
  minError: string;
  maxError: string;
  required: string;
}

export const requiredScaledNumber = (
  scale: number,
  decimalPlaces: number,
  min: number,
  max: number,
  messages: ScaledNumberValidationMessages,
) =>
  yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError(messages.typeError)
    .test(`${decimalPlaces}-decimal-places`, messages.precisionError, (value) => {
      if (value === undefined || value === null) return true;
      if (!Number.isFinite(value)) return false;
      const scaledValue = value * scale;
      const tolerance = Number.EPSILON * Math.max(1, Math.abs(scaledValue)) * 4;
      return Math.abs(scaledValue - Math.round(scaledValue)) <= tolerance;
    })
    .min(min, messages.minError)
    .max(max, messages.maxError)
    .required(messages.required);
