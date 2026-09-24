import Dexie, { type Table } from "dexie";
import type { IconName } from "lucide-react/dynamic";

export const DATA_FIELD_TYPES = ["Text", "Textarea", "Number", "Select", "Image", "Boolean"] as const;
export type DataFieldType = (typeof DATA_FIELD_TYPES)[number];
export const DATA_FIELD_CONTAINERS = ["Specimen", "Test"] as const;
export type DataFieldContainer = (typeof DATA_FIELD_CONTAINERS)[number];
export const PRESET_TYPES = ["Tensile", "Compression"] as const;
export type PresetType = (typeof PRESET_TYPES)[number];
export type DynamicDataValue = string | number | boolean | string[] | UploadedImage[] | null;

export interface UploadedImage {
  id: string;
  name: string;
  type: string;
  size: number;
}

export interface SpecimenRecord {
  id: string;
  name: string;
  customData: Record<string, DynamicDataValue>;
  createdAt: number;
  updatedAt: number;
}

export interface TestRecord {
  id: string;
  name: string;
  specimenId?: string | null;
  presetId?: string | null;
  customData: Record<string, DynamicDataValue>;
  createdAt: number;
  updatedAt: number;
}

export interface PresetRecord {
  id: string;
  name: string;
  type: PresetType;
  preload: number;
  load: number;
  speed: number;
  createdAt: number;
  updatedAt: number;
}

export interface DataFieldDefinition {
  id: string;
  type: DataFieldType;
  name: string;
  unit?: string;
  description?: string;
  mandatory?: boolean;
  icon?: IconName;
  container: DataFieldContainer;
  options?: string[];
  multipleSelection?: boolean;
  accept?: string;
  multiple?: boolean;
  createdAt: number;
  updatedAt: number;
}

class AkdiMakineDatabase extends Dexie {
  specimens!: Table<SpecimenRecord, string>;
  tests!: Table<TestRecord, string>;
  presets!: Table<PresetRecord, string>;
  dataFields!: Table<DataFieldDefinition, string>;

  constructor() {
    super("akdi-makine-db");

    this.version(2).stores({
      specimens: "&id, name, createdAt, updatedAt",
      tests: "&id, name, specimenId, presetId, createdAt, updatedAt",
      presets: "&id, name, type, createdAt, updatedAt",
      dataFields: "&id, container, type, name, mandatory, createdAt, updatedAt",
    });
  }
}

function createId() {
  return crypto.randomUUID();
}

export const db = new AkdiMakineDatabase();

export async function createSpecimen(input: Omit<SpecimenRecord, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();

  return db.specimens.add({
    id: createId(),
    ...input,
    customData: input.customData ?? {},
    createdAt: now,
    updatedAt: now,
  });
}

export async function getSpecimens() {
  return db.specimens.orderBy("createdAt").reverse().toArray();
}

export async function getSpecimen(id: string) {
  return db.specimens.get(id);
}

export async function updateSpecimen(id: string, changes: Partial<Omit<SpecimenRecord, "id" | "createdAt">>) {
  const previousSpecimen = await db.specimens.get(id);
  const updatedCount = await db.specimens.update(id, {
    ...changes,
    updatedAt: Date.now(),
  });

  if (updatedCount > 0 && previousSpecimen) {
    await deleteUnreferencedImages([previousSpecimen]).catch(() => undefined);
  }

  return updatedCount;
}

function getImageIds(records: Array<{ customData: Record<string, DynamicDataValue> }>) {
  const imageIds = new Set<string>();
  for (const record of records) {
    for (const value of Object.values(record.customData ?? {})) {
      if (!Array.isArray(value)) continue;
      for (const item of value) {
        if (item && typeof item === "object" && "id" in item && typeof item.id === "string") imageIds.add(item.id);
      }
    }
  }
  return imageIds;
}

async function deleteUnreferencedImages(records: Array<{ customData: Record<string, DynamicDataValue> }>) {
  if (typeof window === "undefined" || !window.electronAPI || records.length === 0) return;

  const candidateIds = getImageIds(records);
  if (candidateIds.size === 0) return;

  const [specimens, tests] = await Promise.all([db.specimens.toArray(), db.tests.toArray()]);
  const referencedIds = getImageIds([...specimens, ...tests]);
  const unreferencedIds = [...candidateIds].filter((imageId) => !referencedIds.has(imageId));
  await Promise.allSettled(unreferencedIds.map((imageId) => window.electronAPI.deleteImage(imageId)));
}

export async function deleteSpecimen(id: string) {
  const specimen = await db.specimens.get(id);
  await db.specimens.delete(id);
  if (specimen) await deleteUnreferencedImages([specimen]);
}

export async function deleteSpecimens(ids: string[]) {
  if (ids.length === 0) return;

  const specimens = (await db.specimens.bulkGet(ids)).filter((specimen): specimen is SpecimenRecord => Boolean(specimen));
  await db.transaction("rw", db.specimens, async () => {
    await db.specimens.bulkDelete(ids);
  });
  await deleteUnreferencedImages(specimens);
}

export async function duplicateSpecimen(id: string) {
  const original = await db.specimens.get(id);
  if (!original) return undefined;

  const now = Date.now();
  const duplicate: SpecimenRecord = {
    ...original,
    id: createId(),
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  await db.specimens.add(duplicate);
  return duplicate;
}

export async function duplicateSpecimens(ids: string[]) {
  if (ids.length === 0) return [];

  return db.transaction("rw", db.specimens, async () => {
    const originals = await db.specimens.bulkGet(ids);
    const now = Date.now();
    const duplicates = originals
      .filter((original): original is SpecimenRecord => Boolean(original))
      .map((original) => ({
        ...original,
        id: createId(),
        name: `${original.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      }));

    await db.specimens.bulkAdd(duplicates);
    return duplicates;
  });
}

export async function createTest(input: Omit<TestRecord, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();

  return db.tests.add({
    id: createId(),
    ...input,
    customData: input.customData ?? {},
    createdAt: now,
    updatedAt: now,
  });
}

export async function getTests() {
  return db.tests.orderBy("createdAt").reverse().toArray();
}

export async function getTest(id: string) {
  return db.tests.get(id);
}

export async function updateTest(id: string, changes: Partial<Omit<TestRecord, "id" | "createdAt">>) {
  return db.tests.update(id, {
    ...changes,
    updatedAt: Date.now(),
  });
}

export async function deleteTest(id: string) {
  await db.tests.delete(id);
}

export async function deleteTests(ids: string[]) {
  if (ids.length === 0) return;

  await db.transaction("rw", db.tests, async () => {
    await db.tests.bulkDelete(ids);
  });
}

export async function duplicateTest(id: string) {
  const original = await db.tests.get(id);
  if (!original) return undefined;

  const now = Date.now();
  const duplicate: TestRecord = {
    ...original,
    id: createId(),
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  await db.tests.add(duplicate);
  return duplicate;
}

export async function duplicateTests(ids: string[]) {
  if (ids.length === 0) return [];

  return db.transaction("rw", db.tests, async () => {
    const originals = await db.tests.bulkGet(ids);
    const now = Date.now();
    const duplicates = originals
      .filter((original): original is TestRecord => Boolean(original))
      .map((original) => ({
        ...original,
        id: createId(),
        name: `${original.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      }));

    await db.tests.bulkAdd(duplicates);
    return duplicates;
  });
}

export async function createPreset(input: Omit<PresetRecord, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();

  return db.presets.add({
    id: createId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getPresets() {
  return db.presets.orderBy("createdAt").reverse().toArray();
}

export async function getPreset(id: string) {
  return db.presets.get(id);
}

export async function updatePreset(id: string, changes: Partial<Omit<PresetRecord, "id" | "createdAt">>) {
  return db.presets.update(id, {
    ...changes,
    updatedAt: Date.now(),
  });
}

export async function deletePreset(id: string) {
  await db.presets.delete(id);
}

export async function deletePresets(ids: string[]) {
  if (ids.length === 0) return;

  await db.transaction("rw", db.presets, async () => {
    await db.presets.bulkDelete(ids);
  });
}

export async function duplicatePreset(id: string) {
  const original = await db.presets.get(id);
  if (!original) return undefined;

  const now = Date.now();
  const duplicate: PresetRecord = {
    ...original,
    id: createId(),
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  await db.presets.add(duplicate);
  return duplicate;
}

export async function duplicatePresets(ids: string[]) {
  if (ids.length === 0) return [];

  return db.transaction("rw", db.presets, async () => {
    const originals = await db.presets.bulkGet(ids);
    const now = Date.now();
    const duplicates = originals
      .filter((original): original is PresetRecord => Boolean(original))
      .map((original) => ({
        ...original,
        id: createId(),
        name: `${original.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      }));

    await db.presets.bulkAdd(duplicates);
    return duplicates;
  });
}

export async function createDataField(input: Omit<DataFieldDefinition, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();

  return db.dataFields.add({
    id: createId(),
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

export async function getDataField(id: string) {
  return db.dataFields.get(id);
}

export async function updateDataField(id: string, changes: Partial<Omit<DataFieldDefinition, "id" | "createdAt">>) {
  return db.dataFields.update(id, {
    ...changes,
    updatedAt: Date.now(),
  });
}

export async function deleteDataField(id: string) {
  await db.dataFields.delete(id);
}

export async function deleteDataFields(ids: string[]) {
  if (ids.length === 0) return;

  await db.transaction("rw", db.dataFields, async () => {
    await db.dataFields.bulkDelete(ids);
  });
}

export async function duplicateDataField(id: string) {
  const original = await db.dataFields.get(id);
  if (!original) return undefined;

  const now = Date.now();
  const duplicate: DataFieldDefinition = {
    ...original,
    id: createId(),
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  await db.dataFields.add(duplicate);
  return duplicate;
}

export async function duplicateDataFields(ids: string[]) {
  if (ids.length === 0) return [];

  return db.transaction("rw", db.dataFields, async () => {
    const originals = await db.dataFields.bulkGet(ids);
    const now = Date.now();
    const duplicates = originals
      .filter((original): original is DataFieldDefinition => Boolean(original))
      .map((original) => ({
        ...original,
        id: createId(),
        name: `${original.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      }));

    await db.dataFields.bulkAdd(duplicates);
    return duplicates;
  });
}
