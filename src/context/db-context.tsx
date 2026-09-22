import { createContext, type PropsWithChildren, useContext, useMemo } from "react";

import {
  createDataField,
  createPreset,
  createSpecimen,
  createTest,
  db,
  getDataFields,
  getPresets,
  getSpecimens,
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
  updateSpecimen: typeof updateSpecimen;
  createTest: typeof createTest;
  getTests: typeof getTests;
  updateTest: typeof updateTest;
  createPreset: typeof createPreset;
  getPresets: typeof getPresets;
  updatePreset: typeof updatePreset;
  createDataField: typeof createDataField;
  getDataFields: typeof getDataFields;
  updateDataField: typeof updateDataField;
}

const DbContext = createContext<DbContextType | null>(null);

export function DbProvider({ children }: PropsWithChildren) {
  const value = useMemo<DbContextType>(
    () => ({
      db,
      createSpecimen,
      getSpecimens,
      updateSpecimen,
      createTest,
      getTests,
      updateTest,
      createPreset,
      getPresets,
      updatePreset,
      createDataField,
      getDataFields,
      updateDataField,
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

export type {
  DataFieldContainer,
  DataFieldDefinition,
  DataFieldType,
  DynamicDataValue,
  PresetRecord,
  PresetType,
  SpecimenRecord,
  TestRecord,
  UploadedImage,
};
