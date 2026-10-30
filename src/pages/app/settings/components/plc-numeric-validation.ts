import * as yup from 'yup';

export const PLC_INT32_MIN = -0x80000000;
export const PLC_INT32_MAX = 0x7fffffff;

export const requiredScaledNumber = (
  label: string,
  scale: number,
  decimalPlaces: number,
  min: number,
  max: number,
  maxError = `${label} exceeds the PLC range`,
) =>
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
    .min(min, `${label} is below the PLC range`)
    .max(max, maxError)
    .required(`${label} is required`);
