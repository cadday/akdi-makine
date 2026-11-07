import { strToU8, unzipSync, zipSync } from "fflate";

const createdAt = Date.UTC(2025, 0, 1);
const specimens = Array.from({ length: 3 }, (_, index) => ({
  id: `e2e-specimen-${index + 1}`,
  name: `E2E Specimen ${index + 1}`,
  geometry: "Cylindrical",
  diameter: 10 + index,
  customData: {},
  createdAt,
  updatedAt: createdAt,
}));
const presets = Array.from({ length: 2 }, (_, index) => ({
  id: `e2e-preset-${index + 1}`,
  name: `E2E Preset ${index + 1}`,
  type: index === 0 ? "Tensile" : "Compression",
  velocity: 1,
  method: "Load",
  targets: [100],
  createdAt,
  updatedAt: createdAt,
}));
const tests = Array.from({ length: 25 }, (_, index) => {
  const specimen = specimens[index % specimens.length];
  const preset = presets[index % presets.length];
  return {
    id: `e2e-test-${String(index + 1).padStart(2, "0")}`,
    name: `E2E Test ${String(index + 1).padStart(2, "0")}`,
    machineIP: null,
    specimenId: specimen.id,
    presetId: preset.id,
    specimenSnapshot: {
      name: specimen.name,
      customData: {},
      geometry: specimen.geometry,
      diameter: specimen.diameter,
    },
    presetSnapshot: {
      name: preset.name,
      type: preset.type,
      velocity: preset.velocity,
      method: preset.method,
      targets: preset.targets,
    },
    customData: {},
    runStatus: "completed",
    createdAt: createdAt + index * 1000,
    updatedAt: createdAt + index * 1000,
  };
});
const records = {
  specimens,
  tests,
  presets,
  dataFields: [
    {
      id: "e2e-data-field-1",
      type: "Text",
      name: "E2E Data Field 1",
      unit: "",
      description: "Synthetic field for E2E coverage",
      mandatory: false,
      container: "Specimen",
      createdAt,
      updatedAt: createdAt,
    },
  ],
  machines: [
    {
      id: "e2e-machine-disconnected",
      ipAddress: "192.0.2.10",
      connected: false,
      createdAt,
      updatedAt: createdAt,
    },
  ],
};

export function createSeedBackup() {
  return zipSync(
    {
      "manifest.json": strToU8(
        JSON.stringify({
          formatVersion: 2,
          databaseVersion: 5,
          createdAt: new Date(createdAt).toISOString(),
          counts: {
            specimens: records.specimens.length,
            tests: records.tests.length,
            presets: records.presets.length,
            dataFields: records.dataFields.length,
            machines: records.machines.length,
          },
          images: [],
        }),
      ),
      "records.json": strToU8(JSON.stringify(records)),
    },
    { level: 6 },
  );
}

export function prepareBackupForE2E(bytes: Uint8Array) {
  const files = unzipSync(bytes);
  const recordsBytes = files["records.json"];
  const manifestBytes = files["manifest.json"];
  if (!recordsBytes || !manifestBytes) throw new Error("E2E backup is missing its manifest or database records");

  const backupRecords = JSON.parse(new TextDecoder().decode(recordsBytes)) as {
    specimens?: Array<Record<string, any>>;
    tests?: Array<Record<string, any>>;
    presets?: Array<Record<string, any>>;
    dataFields?: Array<Record<string, any>>;
    machines?: Array<Record<string, any>>;
  };
  const manifest = JSON.parse(new TextDecoder().decode(manifestBytes)) as {
    images?: Array<Record<string, any>>;
  };
  for (const table of ["specimens", "tests", "presets", "dataFields", "machines"] as const) {
    if (!Array.isArray(backupRecords[table])) throw new Error(`E2E backup is missing ${table} records`);
  }
  if (!Array.isArray(manifest.images)) throw new Error("E2E backup is missing image metadata");

  const specimenNames = new Map(backupRecords.specimens!.map((record, index) => [record.id, `E2E Specimen ${index + 1}`]));
  const presetNames = new Map(backupRecords.presets!.map((record, index) => [record.id, `E2E Preset ${index + 1}`]));
  const imageNames = new Map(manifest.images.map((image, index) => [image.id, `E2E Image ${index + 1}`]));
  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === "string") return "E2E value";
    if (Array.isArray(value)) return value.map(sanitizeValue);
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      if (typeof record.id === "string" && imageNames.has(record.id) && typeof record.type === "string") {
        return { ...record, name: imageNames.get(record.id) };
      }
      return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, sanitizeValue(item)]));
    }
    return value;
  };

  backupRecords.specimens = backupRecords.specimens!.map((specimen, index) => ({
    ...specimen,
    name: `E2E Specimen ${index + 1}`,
    customData: sanitizeValue(specimen.customData ?? {}),
  }));
  backupRecords.presets = backupRecords.presets!.map((preset, index) => ({
    ...preset,
    name: `E2E Preset ${index + 1}`,
  }));
  backupRecords.tests = backupRecords.tests!.map((test, index) => ({
    ...test,
    name: `E2E Test ${String(index + 1).padStart(2, "0")}`,
    machineIP: null,
    runError: undefined,
    specimenSnapshot: {
      ...test.specimenSnapshot,
      name: specimenNames.get(test.specimenId) ?? "E2E Specimen Snapshot",
      customData: sanitizeValue(test.specimenSnapshot?.customData ?? {}),
    },
    presetSnapshot: {
      ...test.presetSnapshot,
      name: presetNames.get(test.presetId) ?? "E2E Preset Snapshot",
    },
    customData: sanitizeValue(test.customData ?? {}),
  }));
  backupRecords.dataFields = backupRecords.dataFields!.map((field, index) => ({
    ...field,
    name: `E2E Data Field ${index + 1}`,
    description: field.description ? "E2E test field" : field.description,
    unit: undefined,
    options: field.options?.map(() => "E2E option"),
    accept: undefined,
  }));
  backupRecords.machines = backupRecords.machines!.map((machine, index) => ({
    ...machine,
    ipAddress: `192.0.2.${(index % 254) + 1}`,
    connected: false,
  }));
  manifest.images = manifest.images.map((image, index) => ({ ...image, name: `E2E Image ${index + 1}` }));

  files["records.json"] = strToU8(JSON.stringify(backupRecords));
  files["manifest.json"] = strToU8(JSON.stringify(manifest));
  return zipSync(files, { level: 6 });
}
