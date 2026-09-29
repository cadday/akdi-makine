import { Unzip, UnzipInflate, UnzipPassThrough, strFromU8, strToU8, zipSync } from "fflate";
import {
  db,
  type DataFieldDefinition,
  type MachineRecord,
  type PresetRecord,
  type SpecimenRecord,
  type TestGraphPoint,
  type TestRecord,
  type UploadedImage,
} from "@/lib/db";

const BACKUP_FORMAT_VERSION = 1;
const DATABASE_VERSION = 5;
const MAX_ARCHIVE_BYTES = 512 * 1024 * 1024;
const MAX_UNCOMPRESSED_BYTES = 512 * 1024 * 1024;
const MAX_RECORDS_BYTES = 256 * 1024 * 1024;
const MAX_MANIFEST_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_COUNT = 10000;
const MAX_RECORD_COUNT = 100000;
const IMAGE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"]);

interface BackupImageMetadata extends UploadedImage {}

interface BackupManifest {
  formatVersion: number;
  databaseVersion: number;
  createdAt: string;
  counts: { specimens: number; tests: number; presets: number; dataFields: number; machines: number };
  images: BackupImageMetadata[];
}

interface BackupRecords {
  specimens: SpecimenRecord[];
  tests: TestRecord[];
  presets: PresetRecord[];
  dataFields: DataFieldDefinition[];
  machines: MachineRecord[];
}

export interface PreparedDatabaseBackup {
  manifest: BackupManifest;
  records: BackupRecords;
  images: Map<string, Uint8Array>;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isUploadedImage(value: unknown): value is UploadedImage {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.type === "string" &&
    typeof value.size === "number"
  );
}

function visitImageReferences(value: unknown, visit: (image: UploadedImage) => void) {
  if (Array.isArray(value)) {
    for (const item of value) visitImageReferences(item, visit);
    return;
  }
  if (isUploadedImage(value)) {
    visit(value);
    return;
  }
  if (isObject(value)) {
    for (const item of Object.values(value)) visitImageReferences(item, visit);
  }
}

function collectImageReferences(records: BackupRecords) {
  const references = new Map<string, UploadedImage>();
  const collect = (value: unknown) =>
    visitImageReferences(value, (image) => {
      const existing = references.get(image.id);
      if (existing && (existing.name !== image.name || existing.type !== image.type || existing.size !== image.size)) {
        throw new Error(`Image metadata is inconsistent for ${image.id}`);
      }
      references.set(image.id, image);
    });

  for (const specimen of records.specimens) collect(specimen.customData);
  for (const test of records.tests) {
    collect(test.customData);
    collect(test.specimenSnapshot?.customData);
  }
  return references;
}

function validateRecordArray<T>(value: unknown, tableName: string): T[] {
  if (!Array.isArray(value)) throw new Error(`Backup ${tableName} data is missing`);
  if (value.length > MAX_RECORD_COUNT) throw new Error(`Backup ${tableName} table exceeds the record limit`);
  const ids = new Set<string>();
  for (const record of value) {
    if (!isObject(record) || typeof record.id !== "string" || !record.id.trim()) {
      throw new Error(`Backup contains an invalid ${tableName} record`);
    }
    if (ids.has(record.id)) throw new Error(`Backup contains duplicate ${tableName} IDs`);
    ids.add(record.id);
  }
  return value as T[];
}

function parseJson<T>(bytes: Uint8Array, description: string): T {
  try {
    return JSON.parse(strFromU8(bytes)) as T;
  } catch {
    throw new Error(`Backup ${description} is not valid JSON`);
  }
}

function readZipEntries(bytes: Uint8Array) {
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_ARCHIVE_BYTES) {
    throw new Error("Backup archive is empty or exceeds the 512 MB limit");
  }

  const entries = new Map<string, Uint8Array>();
  let totalUncompressedBytes = 0;
  let failure: Error | null = null;
  const unzip = new Unzip((file) => {
    if (failure) {
      file.terminate();
      return;
    }
    if (entries.size >= MAX_IMAGE_COUNT + 2) {
      failure = new Error("Backup contains too many files");
      file.terminate();
      return;
    }
    if (entries.has(file.name) || file.name.endsWith("/") || file.name.includes("..") || file.name.startsWith("/")) {
      failure = new Error("Backup contains duplicate or invalid archive paths");
      file.terminate();
      return;
    }

    const maximumFileBytes = file.name === "manifest.json" ? MAX_MANIFEST_BYTES : file.name === "records.json" ? MAX_RECORDS_BYTES : MAX_IMAGE_BYTES;
    if (!Number.isSafeInteger(file.originalSize) || file.originalSize < 0 || file.originalSize > maximumFileBytes) {
      failure = new Error(`Backup entry exceeds the size limit: ${file.name}`);
      file.terminate();
      return;
    }
    totalUncompressedBytes += file.originalSize;
    if (totalUncompressedBytes > MAX_UNCOMPRESSED_BYTES) {
      failure = new Error("Backup expanded size exceeds the 512 MB limit");
      file.terminate();
      return;
    }

    const chunks: Uint8Array[] = [];
    let entryBytes = 0;
    file.ondata = (error, chunk, final) => {
      if (error) {
        failure = new Error(`Could not extract backup entry: ${file.name}`);
        return;
      }
      if (chunk) {
        entryBytes += chunk.byteLength;
        if (entryBytes > maximumFileBytes || entryBytes > file.originalSize) {
          failure = new Error(`Backup entry expanded beyond its declared size: ${file.name}`);
          file.terminate();
          return;
        }
        chunks.push(chunk);
      }
      if (final) {
        if (entryBytes !== file.originalSize) {
          failure = new Error(`Backup entry size does not match its declaration: ${file.name}`);
          return;
        }
        const content = new Uint8Array(entryBytes);
        let offset = 0;
        for (const part of chunks) {
          content.set(part, offset);
          offset += part.byteLength;
        }
        entries.set(file.name, content);
      }
    };
    try {
      file.start();
    } catch {
      failure = new Error(`Unsupported compression in backup entry: ${file.name}`);
      file.terminate();
    }
  });
  unzip.register(UnzipInflate);
  unzip.register(UnzipPassThrough);
  try {
    unzip.push(bytes, true);
  } catch {
    throw new Error("Backup archive is invalid or uses unsupported compression");
  }
  if (failure) throw failure;
  return entries;
}

function validateManifest(value: unknown): BackupManifest {
  if (!isObject(value)) throw new Error("Backup manifest is invalid");
  if (value.formatVersion !== BACKUP_FORMAT_VERSION) throw new Error("This backup format version is not supported");
  if (value.databaseVersion !== 3 && value.databaseVersion !== 4 && value.databaseVersion !== DATABASE_VERSION) {
    throw new Error("This database backup version is not supported");
  }
  if (typeof value.createdAt !== "string" || !Number.isFinite(Date.parse(value.createdAt))) throw new Error("Backup timestamp is invalid");
  if (!Array.isArray(value.images) || value.images.length > MAX_IMAGE_COUNT) throw new Error("Backup image list is invalid or too large");
  if (!isObject(value.counts)) throw new Error("Backup record counts are missing");
  for (const table of ["specimens", "tests", "presets", "dataFields"] as const) {
    if (!Number.isSafeInteger(value.counts[table]) || (value.counts[table] as number) < 0) throw new Error(`Backup ${table} count is invalid`);
  }
  const machineCount = value.counts.machines;
  if (value.databaseVersion >= 4 && (!Number.isSafeInteger(machineCount) || (machineCount as number) < 0)) {
    throw new Error("Backup machines count is invalid");
  }
  return {
    ...value,
    counts: { ...value.counts, machines: Number.isSafeInteger(machineCount) && (machineCount as number) >= 0 ? (machineCount as number) : 0 },
  } as unknown as BackupManifest;
}

function validateAndPrepare(entries: Map<string, Uint8Array>): PreparedDatabaseBackup {
  const manifestBytes = entries.get("manifest.json");
  const recordsBytes = entries.get("records.json");
  if (!manifestBytes || !recordsBytes) throw new Error("Backup is missing its manifest or database records");
  const manifest = validateManifest(parseJson<unknown>(manifestBytes, "manifest"));
  const parsedRecords = parseJson<Partial<BackupRecords>>(recordsBytes, "records");
  const tests = validateRecordArray<TestRecord>(parsedRecords.tests, "tests").map((test) => {
    const machineIP = (test as TestRecord & { machineIP?: unknown }).machineIP;
    if (manifest.databaseVersion >= 5 && machineIP !== null && typeof machineIP !== "string") {
      throw new Error("Backup contains an invalid test machine IP");
    }
    return { ...test, machineIP: typeof machineIP === "string" ? machineIP : null };
  });
  const records: BackupRecords = {
    specimens: validateRecordArray<SpecimenRecord>(parsedRecords.specimens, "specimens"),
    tests,
    presets: validateRecordArray<PresetRecord>(parsedRecords.presets, "presets"),
    dataFields: validateRecordArray<DataFieldDefinition>(parsedRecords.dataFields, "dataFields"),
    machines: parsedRecords.machines === undefined && manifest.databaseVersion === 3 ? [] : validateRecordArray<MachineRecord>(parsedRecords.machines, "machines"),
  };

  for (const table of ["specimens", "tests", "presets", "dataFields", "machines"] as const) {
    if (manifest.counts[table] !== records[table].length) throw new Error(`Backup ${table} count does not match its manifest`);
  }
  const recordCount = records.specimens.length + records.tests.length + records.presets.length + records.dataFields.length + records.machines.length;
  if (recordCount > MAX_RECORD_COUNT) throw new Error("Backup contains too many records");

  const references = collectImageReferences(records);
  const images = new Map<string, Uint8Array>();
  const manifestIds = new Set<string>();
  for (const metadata of manifest.images) {
    if (
      !isUploadedImage(metadata) ||
      !IMAGE_ID_PATTERN.test(metadata.id) ||
      !metadata.name.trim() ||
      !IMAGE_TYPES.has(metadata.type) ||
      !Number.isSafeInteger(metadata.size) ||
      metadata.size <= 0 ||
      metadata.size > MAX_IMAGE_BYTES ||
      manifestIds.has(metadata.id)
    ) {
      throw new Error("Backup contains invalid image metadata");
    }
    manifestIds.add(metadata.id);
    if (!references.has(metadata.id)) throw new Error(`Backup contains an unreferenced image: ${metadata.id}`);
    const imageBytes = entries.get(`images/${metadata.id}`);
    if (!imageBytes || imageBytes.byteLength !== metadata.size) throw new Error(`Backup image is missing or has an invalid size: ${metadata.name}`);
    images.set(metadata.id, imageBytes);
  }
  for (const id of references.keys()) {
    if (!manifestIds.has(id)) throw new Error(`Backup is missing a referenced image: ${id}`);
  }
  for (const entryName of entries.keys()) {
    if (entryName !== "manifest.json" && entryName !== "records.json" && !/^images\/[0-9a-f-]+$/i.test(entryName)) {
      throw new Error(`Backup contains an unexpected file: ${entryName}`);
    }
    if (entryName.startsWith("images/") && !images.has(entryName.slice("images/".length))) {
      throw new Error(`Backup contains an unlisted image: ${entryName}`);
    }
  }
  return { manifest, records, images };
}

export async function createDatabaseBackup() {
  const [specimens, tests, presets, dataFields, machines] = await Promise.all([
    db.specimens.toArray(),
    db.tests.toArray(),
    db.presets.toArray(),
    db.dataFields.toArray(),
    db.machines.toArray(),
  ]);
  const records: BackupRecords = { specimens, tests, presets, dataFields, machines };
  const imageReferences = collectImageReferences(records);
  if (imageReferences.size > MAX_IMAGE_COUNT) throw new Error("Database has too many referenced images to back up");

  const files: Record<string, Uint8Array> = Object.create(null) as Record<string, Uint8Array>;
  const manifest: BackupManifest = {
    formatVersion: BACKUP_FORMAT_VERSION,
    databaseVersion: DATABASE_VERSION,
    createdAt: new Date().toISOString(),
    counts: {
      specimens: specimens.length,
      tests: tests.length,
      presets: presets.length,
      dataFields: dataFields.length,
      machines: machines.length,
    },
    images: [],
  };
  files["records.json"] = strToU8(JSON.stringify(records));
  if (files["records.json"].byteLength > MAX_RECORDS_BYTES) throw new Error("Database records exceed the 256 MB backup limit");

  let totalBytes = files["records.json"].byteLength;
  for (const [id, metadata] of imageReferences) {
    if (!IMAGE_ID_PATTERN.test(id) || !IMAGE_TYPES.has(metadata.type)) throw new Error(`Database contains invalid image metadata: ${metadata.name}`);
    const result = await window.electronAPI.readImage(id);
    if (!result || result.bytes.byteLength !== metadata.size || result.bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new Error(`Image file is missing or invalid: ${metadata.name}`);
    }
    totalBytes += result.bytes.byteLength;
    if (totalBytes > MAX_UNCOMPRESSED_BYTES) throw new Error("Database backup would exceed the 512 MB uncompressed limit");
    files[`images/${id}`] = result.bytes;
    manifest.images.push(metadata);
  }
  files["manifest.json"] = strToU8(JSON.stringify(manifest));
  const archive = zipSync(files, { level: 6 });
  if (archive.byteLength > MAX_ARCHIVE_BYTES) throw new Error("Database backup exceeds the 512 MB archive limit");
  return archive;
}

export function prepareDatabaseBackup(bytes: Uint8Array) {
  return validateAndPrepare(readZipEntries(bytes));
}

function rewriteImageReferences(value: unknown, imageMap: Map<string, UploadedImage>): unknown {
  if (Array.isArray(value)) return value.map((item) => rewriteImageReferences(item, imageMap));
  if (!isObject(value)) return value;
  if (isUploadedImage(value)) {
    const replacement = imageMap.get(value.id);
    if (!replacement) throw new Error(`Backup image reference could not be restored: ${value.id}`);
    return replacement;
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewriteImageReferences(item, imageMap)]));
}

function rewriteCustomData(value: Record<string, unknown>, imageMap: Map<string, UploadedImage>) {
  return rewriteImageReferences(value, imageMap) as Record<string, import("@/lib/db").DynamicDataValue>;
}

export async function replaceDatabaseFromBackup(backup: PreparedDatabaseBackup) {
  const currentRecords: BackupRecords = {
    specimens: await db.specimens.toArray(),
    tests: await db.tests.toArray(),
    presets: await db.presets.toArray(),
    dataFields: await db.dataFields.toArray(),
    machines: await db.machines.toArray(),
  };
  const previousImageIds = [...collectImageReferences(currentRecords).keys()];
  const imageMap = new Map<string, UploadedImage>();
  const stagedImageIds: string[] = [];

  try {
    for (const metadata of backup.manifest.images) {
      const bytes = backup.images.get(metadata.id);
      if (!bytes) throw new Error(`Backup image is unavailable: ${metadata.name}`);
      const restored = await window.electronAPI.saveImage({ name: metadata.name, type: metadata.type, bytes });
      stagedImageIds.push(restored.id);
      imageMap.set(metadata.id, restored);
    }

    const records: BackupRecords = {
      specimens: backup.records.specimens.map((record) => ({ ...record, customData: rewriteCustomData(record.customData, imageMap) })),
      tests: backup.records.tests.map((record) => ({
        ...record,
        customData: rewriteCustomData(record.customData, imageMap),
        specimenSnapshot: {
          ...record.specimenSnapshot,
          customData: rewriteCustomData(record.specimenSnapshot?.customData ?? {}, imageMap),
        },
      })),
      presets: backup.records.presets,
      dataFields: backup.records.dataFields,
      machines: backup.records.machines,
    };

    await db.transaction("rw", db.specimens, db.tests, db.presets, db.dataFields, db.machines, async () => {
      await Promise.all([db.specimens.clear(), db.tests.clear(), db.presets.clear(), db.dataFields.clear(), db.machines.clear()]);
      if (records.specimens.length) await db.specimens.bulkAdd(records.specimens);
      if (records.tests.length) await db.tests.bulkAdd(records.tests);
      if (records.presets.length) await db.presets.bulkAdd(records.presets);
      if (records.dataFields.length) await db.dataFields.bulkAdd(records.dataFields);
      if (records.machines.length) await db.machines.bulkAdd(records.machines);
    });
  } catch (error) {
    await Promise.allSettled(stagedImageIds.map((id) => window.electronAPI.deleteImage(id)));
    throw error;
  }

  await Promise.allSettled(previousImageIds.map((id) => window.electronAPI.deleteImage(id)));
  return backup.manifest.counts;
}

export type { TestGraphPoint };