import { forwardRef, type InputHTMLAttributes } from 'react';
import { IMaskInput } from 'react-imask';

interface DecimalMaskInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'mask' | 'min' | 'max' | 'value'> {
  min?: number;
  max?: number;
  scale?: number;
  onAccept?: (value: string, event?: InputEvent) => void;
  value?: string;
}

export const DecimalMaskInput = forwardRef<HTMLInputElement, DecimalMaskInputProps>(
  (
    {
      autoComplete,
      className,
      disabled,
      id,
      inputMode,
      max = Number.MAX_SAFE_INTEGER,
      min = Number.MIN_SAFE_INTEGER,
      name,
      onBlur,
      onChange,
      onFocus,
      onAccept,
      placeholder,
      readOnly,
      required,
      scale = 1,
      tabIndex,
      title,
      value,
    },
    ref,
  ) => (
    <IMaskInput
      inputRef={ref}
      autoComplete={autoComplete}
      className={className}
      disabled={disabled}
      id={id}
      inputMode={inputMode}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      tabIndex={tabIndex}
      title={title}
      value={value}
      mask={Number}
      scale={scale}
      min={min}
      max={max}
      radix="."
      thousandsSeparator=""
      normalizeZeros={false}
      padFractionalZeros
      unmask={false}
      onAccept={(acceptedValue, _mask, event) => onAccept?.(String(acceptedValue), event)}
    />
  ),
);
DecimalMaskInput.displayName = 'DecimalMaskInput';
