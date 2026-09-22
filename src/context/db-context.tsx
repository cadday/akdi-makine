/* eslint-disable react-refresh/only-export-components */
import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import {
  createDataField,
  createPreset,
  createSpecimen,
  createTest,
  db,
  deleteDataField,
  deleteDataFields,
  deletePreset,
  deletePresets,
  deleteSpecimen,
  deleteSpecimens,
  deleteTest,
  deleteTests,
  duplicateDataField,
  duplicateDataFields,
  duplicatePreset,
  duplicatePresets,
  duplicateSpecimen,
  duplicateSpecimens,
  duplicateTest,
  duplicateTests,
  getDataField,
  getDataFields,
  getPreset,
  getPresets,
  getSpecimen,
  getSpecimens,
  getTest,
  getTests,
  updateDataField,
  updatePreset,
  updateSpecimen,
  updateTest,
  type DataFieldContainer,
  type DataFieldDefinition,
  type DataFieldType,
  type DynamicDataValue,
  type PresetRecord,
  type PresetType,
  type SpecimenRecord,
  type TestRecord,
  type UploadedImage,
} from "@/lib/db";

interface DbContextType {
  db: typeof db;
  createSpecimen: typeof createSpecimen;
  getSpecimens: typeof getSpecimens;
  getSpecimen: typeof getSpecimen;
  updateSpecimen: typeof updateSpecimen;
  deleteSpecimen: typeof deleteSpecimen;
  deleteSpecimens: typeof deleteSpecimens;
  duplicateSpecimen: typeof duplicateSpecimen;
  duplicateSpecimens: typeof duplicateSpecimens;
  createTest: typeof createTest;
  getTests: typeof getTests;
  getTest: typeof getTest;
  updateTest: typeof updateTest;
  deleteTest: typeof deleteTest;
  deleteTests: typeof deleteTests;
  duplicateTest: typeof duplicateTest;
  duplicateTests: typeof duplicateTests;
  createPreset: typeof createPreset;
  getPresets: typeof getPresets;
  getPreset: typeof getPreset;
  updatePreset: typeof updatePreset;
  deletePreset: typeof deletePreset;
  deletePresets: typeof deletePresets;
  duplicatePreset: typeof duplicatePreset;
  duplicatePresets: typeof duplicatePresets;
  createDataField: typeof createDataField;
  getDataFields: typeof getDataFields;
  getDataField: typeof getDataField;
  updateDataField: typeof updateDataField;
  deleteDataField: typeof deleteDataField;
  deleteDataFields: typeof deleteDataFields;
  duplicateDataField: typeof duplicateDataField;
  duplicateDataFields: typeof duplicateDataFields;
}

const DbContext = createContext<DbContextType | null>(null);

export function DbProvider({ children }: PropsWithChildren) {
  const value = useMemo<DbContextType>(
    () => ({
      db,
      createSpecimen,
      getSpecimens,
      getSpecimen,
      updateSpecimen,
      deleteSpecimen,
      deleteSpecimens,
      duplicateSpecimen,
      duplicateSpecimens,
      createTest,
      getTests,
      getTest,
      updateTest,
      deleteTest,
      deleteTests,
      duplicateTest,
      duplicateTests,
      createPreset,
      getPresets,
      getPreset,
      updatePreset,
      deletePreset,
      deletePresets,
      duplicatePreset,
      duplicatePresets,
      createDataField,
      getDataFields,
      getDataField,
      updateDataField,
      deleteDataField,
      deleteDataFields,
      duplicateDataField,
      duplicateDataFields,
    }),
    [],
  );

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}

export function useDb() {
  const context = useContext(DbContext);

  if (!context) {
    throw new Error("useDb must be used within a DbProvider");
  }

  return context;
}

export type { DataFieldContainer, DataFieldDefinition, DataFieldType, DynamicDataValue, PresetRecord, PresetType, SpecimenRecord, TestRecord, UploadedImage };
