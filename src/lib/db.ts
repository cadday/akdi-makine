import Dexie, { type Table } from "dexie";
import type { IconName } from "lucide-react/dynamic";

export type DataFieldType = "text" | "number" | "select" | "multi-select" | "image" | "boolean";
export type DataFieldContainer = "specimen" | "test";
export type PresetType = "tensile" | "compression";
export type DynamicDataValue = string | number | boolean | string[] | UploadedImage[] | null;

export interface UploadedImage {
  id: string;
  name: string;
  url: string;
}

export interface SpecimenRecord {
  id?: number;
  name: string;
  customData: Record<string, DynamicDataValue>;
  createdAt: number;
  updatedAt: number;
}

export interface TestRecord {
  id?: number;
  name: string;
  specimenId?: number | null;
  presetId?: number | null;
  customData: Record<string, DynamicDataValue>;
  createdAt: number;
  updatedAt: number;
}

export interface PresetRecord {
  id?: number;
  name: string;
  type: PresetType;
  preload: number;
  load: number;
  speed: number;
  createdAt: number;
  updatedAt: number;
}

export interface DataFieldDefinition {
  id?: number;
  type: DataFieldType;
  name: string;
  description: string;
  mandatory: boolean;
  icon: IconName;
  container: DataFieldContainer;
  options?: string[];
  accept?: string;
  multiple?: boolean;
  createdAt: number;
  updatedAt: number;
}

class AkdiMakineDatabase extends Dexie {
  specimens!: Table<SpecimenRecord, number>;
  tests!: Table<TestRecord, number>;
  presets!: Table<PresetRecord, number>;
  dataFields!: Table<DataFieldDefinition, number>;

  constructor() {
    super("akdi-makine-db");

    this.version(1).stores({
      specimens: "++id, &name, createdAt, updatedAt",
      tests: "++id, &name, specimenId, presetId, createdAt, updatedAt",
      presets: "++id, &name, type, createdAt, updatedAt",
      dataFields: "++id, container, type, &name, mandatory, createdAt, updatedAt",
    });
  }
}

export const db = new AkdiMakineDatabase();

export async function createSpecimen(input: Omit<SpecimenRecord, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();

  return db.specimens.add({
    ...input,
    customData: input.customData ?? {},
    createdAt: now,
    updatedAt: now,
  });
}

export async function getSpecimens() {
  return db.specimens.orderBy("createdAt").reverse().toArray();
}

export async function updateSpecimen(id: number, changes: Partial<Omit<SpecimenRecord, "id" | "createdAt">>) {
  return db.specimens.update(id, {
    ...changes,
    updatedAt: Date.now(),
  });
}

export async function createTest(input: Omit<TestRecord, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();

  return db.tests.add({
    ...input,
    customData: input.customData ?? {},
    createdAt: now,
    updatedAt: now,
  });
}

export async function getTests() {
  return db.tests.orderBy("createdAt").reverse().toArray();
}

export async function updateTest(id: number, changes: Partial<Omit<TestRecord, "id" | "createdAt">>) {
  return db.tests.update(id, {
    ...changes,
    updatedAt: Date.now(),
  });
}

export async function createPreset(input: Omit<PresetRecord, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();

  return db.presets.add({
    ...input,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getPresets() {
  return db.presets.orderBy("createdAt").reverse().toArray();
}

export async function updatePreset(id: number, changes: Partial<Omit<PresetRecord, "id" | "createdAt">>) {
  return db.presets.update(id, {
    ...changes,
    updatedAt: Date.now(),
  });
}

export async function createDataField(input: Omit<DataFieldDefinition, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();

  return db.dataFields.add({
    ...input,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getDataFields(container?: DataFieldContainer) {
  if (container) {
    return db.dataFields.where("container").equals(container).reverse().sortBy("createdAt");
  }

  return db.dataFields.orderBy("createdAt").reverse().toArray();
}

export async function updateDataField(id: number, changes: Partial<Omit<DataFieldDefinition, "id" | "createdAt">>) {
  return db.dataFields.update(id, {
    ...changes,
    updatedAt: Date.now(),
  });
}
