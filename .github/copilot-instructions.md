# Project Guidelines

## Forms
- Do not use MUI `FormHelperText` for field validation. Show validation errors in a form-level alert or error summary.

## PLC Distance and Load Values
- When a PLC value is identified as Distance or Load, treat it as a signed 32-bit DVP DWORD stored across two consecutive holding registers, low word first. Reuse `decodeDvpDword`, `encodeDvpDword`, and `validateScaledSignedDword` from `electron/plc-operations.ts` rather than implementing a separate codec.
- Distance is in mm and uses a PLC scale of 10,000 (four decimal places); Load is in N and uses a scale of 10 (one decimal place). Decode by dividing by the scale; write by validating precision and signed range, multiplying by the scale, then encoding.
- Preset base `Load` uses the Load scaling for its targets.
- Display Distance with four fixed decimal places and Load with one, including their units. Keep form values as strings when needed to preserve trailing zeros.
- Apply the scaling consistently across settings, live values, and test samples without double-scaling. Preserve field-specific sign behavior; do not make all Distance or Load values positive, since some targets may be negative.
