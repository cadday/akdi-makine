import { expect, test } from "@playwright/test";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { createSeedBackup, prepareBackupForE2E } from "./helpers/seed-backup";

test("sanitizes a disposable archive copy and preserves record relationships", () => {
  const originalArchive = createSeedBackup();
  const originalFiles = unzipSync(originalArchive);
  const originalRecords = JSON.parse(strFromU8(originalFiles["records.json"]));
  originalRecords.specimens[0].name = "Private specimen name";
  originalRecords.specimens[0].customData = { note: "Private specimen note" };
  originalRecords.tests[0].name = "Private test name";
  originalRecords.tests[0].customData = { note: "Private test note" };
  originalRecords.machines[0].ipAddress = "203.0.113.42";
  originalRecords.machines[0].connected = true;
  const inputArchive = zipSync({
    ...originalFiles,
    "records.json": strToU8(JSON.stringify(originalRecords)),
  });
  const inputSnapshot = new Uint8Array(inputArchive);

  const preparedArchive = prepareBackupForE2E(inputArchive);
  const sanitizedFiles = unzipSync(preparedArchive);
  const sanitizedRecords = JSON.parse(strFromU8(sanitizedFiles["records.json"]));

  expect(inputArchive).toEqual(inputSnapshot);
  expect(sanitizedRecords.specimens[0].name).toBe("E2E Specimen 1");
  expect(sanitizedRecords.specimens[0].customData.note).toBe("E2E value");
  expect(sanitizedRecords.tests[0].name).toBe("E2E Test 01");
  expect(sanitizedRecords.tests[0].customData.note).toBe("E2E value");
  expect(sanitizedRecords.tests[0].specimenId).toBe(sanitizedRecords.specimens[0].id);
  expect(sanitizedRecords.tests[0].specimenSnapshot.name).toBe("E2E Specimen 1");
  expect(sanitizedRecords.machines[0].ipAddress).toBe("192.0.2.1");
  expect(sanitizedRecords.machines[0].connected).toBe(false);
  expect(strFromU8(sanitizedFiles["records.json"])).not.toContain("Private");
});
