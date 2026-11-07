/* eslint-disable react-refresh/only-export-components */
import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import {
  createDataField,
  addMachine,
  appendTestSample,
  createPreset,
  createSpecimen,
  createTest,
  db,
  deleteDataField,
  deleteDataFields,
  deleteMachine,
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
  getDataFieldListingPage,
  getConnectedMachine,
  getMachineByIp,
  getMachines,
  getRecordCounts,
  getLatestTestsForSpecimen,
  getLatestTestsForPreset,
  getLatestTests,
  getPreset,
  getPresets,
  getPresetListingPage,
  getSpecimen,
  getSpecimens,
  getSpecimenListingPage,
  getTest,
  getTests,
  getTestListingPage,
  getTestListingExportRows,
  getTestsForPreset,
  getTestsForSpecimen,
  updateDataField,
  setConnectedMachine,
  updatePreset,
  updateSpecimen,
  updateTest,
  updateTestResults,
  updateTestRunStatus,
  type DataFieldContainer,
  type DataFieldDefinition,
  type DataFieldType,
  type DynamicDataValue,
  type LoadDisplacementPoint,
  type MachineRecord,
  type PresetRecord,
  type PresetMethod,
  type PresetType,
    type SpecimenGeometry,
  type SpecimenRecord,
  type TestRecord,
  type TestListingPage,
  type TestListingQuery,
  type TestListingExportRow,
  type RecordListingPage,
  type RecordListingQuery,
  type TestGraphPoint,
  type TestResults,
  type TestSpecimenSnapshot,
  type StressStrainPoint,
  type UploadedImage,
} from "@/lib/db";

interface DbContextType {
  db: typeof db;
  addMachine: typeof addMachine;
  getMachines: typeof getMachines;
  getMachineByIp: typeof getMachineByIp;
  getConnectedMachine: typeof getConnectedMachine;
  setConnectedMachine: typeof setConnectedMachine;
  deleteMachine: typeof deleteMachine;
  createSpecimen: typeof createSpecimen;
  getSpecimens: typeof getSpecimens;
  getSpecimen: typeof getSpecimen;
  getSpecimenListingPage: typeof getSpecimenListingPage;
  updateSpecimen: typeof updateSpecimen;
  deleteSpecimen: typeof deleteSpecimen;
  deleteSpecimens: typeof deleteSpecimens;
  duplicateSpecimen: typeof duplicateSpecimen;
  duplicateSpecimens: typeof duplicateSpecimens;
  createTest: typeof createTest;
  getTests: typeof getTests;
  getLatestTests: typeof getLatestTests;
  getTestsForPreset: typeof getTestsForPreset;
  getLatestTestsForSpecimen: typeof getLatestTestsForSpecimen;
  getLatestTestsForPreset: typeof getLatestTestsForPreset;
  getTestsForSpecimen: typeof getTestsForSpecimen;
  getTest: typeof getTest;
  updateTest: typeof updateTest;
  getTestListingPage: typeof getTestListingPage;
  getTestListingExportRows: typeof getTestListingExportRows;
  updateTestResults: typeof updateTestResults;
  appendTestSample: typeof appendTestSample;
  updateTestRunStatus: typeof updateTestRunStatus;
  deleteTest: typeof deleteTest;
  deleteTests: typeof deleteTests;
  duplicateTest: typeof duplicateTest;
  duplicateTests: typeof duplicateTests;
  createPreset: typeof createPreset;
  getPresets: typeof getPresets;
  getPresetListingPage: typeof getPresetListingPage;
  getPreset: typeof getPreset;
  updatePreset: typeof updatePreset;
  deletePreset: typeof deletePreset;
  deletePresets: typeof deletePresets;
  duplicatePreset: typeof duplicatePreset;
  duplicatePresets: typeof duplicatePresets;
  createDataField: typeof createDataField;
  getDataFields: typeof getDataFields;
  getDataFieldListingPage: typeof getDataFieldListingPage;
  getRecordCounts: typeof getRecordCounts;
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
      addMachine,
      getMachines,
      getMachineByIp,
      getConnectedMachine,
      setConnectedMachine,
      deleteMachine,
      createSpecimen,
      getSpecimens,
      getSpecimenListingPage,
      getSpecimen,
      updateSpecimen,
      deleteSpecimen,
      deleteSpecimens,
      duplicateSpecimen,
      duplicateSpecimens,
      createTest,
      getTests,
      getLatestTests,
      getTestsForPreset,
      getLatestTestsForSpecimen,
      getLatestTestsForPreset,
      getTestsForSpecimen,
      getTest,
      getTestListingPage,
      getTestListingExportRows,
      updateTest,
      updateTestResults,
      appendTestSample,
      updateTestRunStatus,
      deleteTest,
      deleteTests,
      duplicateTest,
      duplicateTests,
      createPreset,
      getPresets,
      getPresetListingPage,
      getPreset,
      updatePreset,
      deletePreset,
      deletePresets,
      duplicatePreset,
      duplicatePresets,
      createDataField,
      getDataFields,
      getDataFieldListingPage,
      getRecordCounts,
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

export type {
  DataFieldContainer,
  DataFieldDefinition,
  DataFieldType,
  DynamicDataValue,
  LoadDisplacementPoint,
  MachineRecord,
  PresetRecord,
  PresetMethod,
  PresetType,
    SpecimenGeometry,
  SpecimenRecord,
  TestGraphPoint,
  TestRecord,
  TestListingPage,
  TestListingQuery,
  TestListingExportRow,
  RecordListingPage,
  RecordListingQuery,
  TestResults,
  TestSpecimenSnapshot,
  StressStrainPoint,
  UploadedImage,
};
