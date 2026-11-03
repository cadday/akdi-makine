# Project Guidelines

## Forms
- Do not use MUI `FormHelperText` for field validation. Show validation errors in a form-level alert or error summary.

## PLC Distance and Load Values
- When a PLC value is identified as Distance or Load, treat it as a signed 32-bit DVP DWORD stored across two consecutive holding registers, low word first. Reuse `decodeDvpDword`, `encodeDvpDword`, and `validateScaledSignedDword` from `electron/plc-operations.ts` rather than implementing a separate codec.
- Distance is in mm and uses a PLC scale of 10,000 (four decimal places); Load is in N and uses a scale of 10 (one decimal place). Decode by dividing by the scale; write by validating precision and signed range, multiplying by the scale, then encoding.
- Preset base `Load` uses the Load scaling for its targets.
- Display Distance with four fixed decimal places and Load with one, including their units. Keep form values as strings when needed to preserve trailing zeros.
- Apply the scaling consistently across settings, live values, and test samples without double-scaling. Preserve field-specific sign behavior; do not make all Distance or Load values positive, since some targets may be negative.

## Internationalization
- Use `react-i18next` and the existing `src/i18n/messages/en.json` and `tr.json` dictionaries for app-owned, user-visible static text. Keep both dictionaries in sync.
- Use Title Case for app-owned UI titles and button labels: capitalize principal words and keep short articles, conjunctions, and prepositions such as `and`, `to`, and `from` lowercase. Apply equivalent language-appropriate capitalization in other locales.
- Use sentence case for descriptive text, instructions, messages, errors, and other body copy. Do not infer casing from a translation key or its dictionary section; follow the text's role in the UI. Apply the equivalent language-appropriate sentence casing in other locales.
- Translate for meaning and natural usage in the target language rather than mirroring English wording or grammar. Preserve the original intent and technical details, but prefer idiomatic phrasing that users would naturally expect in that locale.
- Group related locale dictionary entries by purpose and separate sections with blank lines. Keep the section order consistent between locales.
- Do not translate user-provided or persisted content, such as specimen names or user-defined data-field labels. Translate app-owned labels and controlled enum values at display time; preserve stored values and identifiers.
- Use interpolation for dynamic text, such as names and counts. Avoid concatenating translated sentence fragments.
- Format dates and numbers with the active locale instead of hard-coding a locale such as `en-GB`.
- Resolve translations at render time or when the active language changes. Avoid capturing translated strings once at module load in validation schemas, grid columns, or other static configuration.
- When adding translation keys, check both dictionaries and verify the affected UI in English and Turkish.
