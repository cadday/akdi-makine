# TODO

## Seed Example Records on First Database Creation

- [x] Seed one example specimen and one example preset when the Dexie database is first created.
- [x] Choose names using the app's initial locale rule: if any browser/OS preferred language starts with `tr`, use Turkish; otherwise use English.
- [x] Use `Numune 0` and `Ön Tanım 0` for Turkish, or `Specimen 0` and `Preset 0` for English.
- [x] Match the examples shown: specimen geometry `Not Specified` with empty `customData`; preset type `Tensile`, velocity `5`, method `Distance`, and target `[5]`.
- [x] Store the names as regular record data; do not rename existing records when the app language changes.
- [x] Seed only on initial database creation, not on subsequent app launches.
