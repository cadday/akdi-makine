import { expect, test } from "./fixtures/electron-app";

test.use({ videoDemoMode: true });

test("runs a saved demo test without connecting to or writing to a PLC", async ({ appPage, appUrl }) => {
  const status = await appPage.evaluate(() => window.plcAPI.getStatus());
  expect(status).toMatchObject({
    state: "online",
    ipAddress: "192.168.0.100",
    plcWorking: true,
    demoMode: true,
  });

  const machinePickerButton = appPage.getByRole("button", { name: /192\.168\.0\.100/ });
  await machinePickerButton.click();
  const virtualMachineRow = appPage.getByRole("listitem").filter({ hasText: "192.168.0.100" });
  await expect(virtualMachineRow.getByRole("button", { name: "Disconnect" })).toBeVisible();
  await expect(virtualMachineRow.getByText("Connected", { exact: true })).toBeVisible();
  await expect(virtualMachineRow.getByRole("button", { name: "Delete" })).toBeVisible();
  await expect(appPage.getByRole("button", { name: "Add Machine" })).toBeVisible();

  await virtualMachineRow.getByRole("button", { name: "Disconnect" }).click();
  await expect(virtualMachineRow.getByRole("button", { name: "Connect" })).toBeVisible();
  await virtualMachineRow.getByRole("button", { name: "Connect" }).click();
  await expect
    .poll(() => appPage.evaluate(() => window.plcAPI.getStatus()))
    .toMatchObject({ state: "online", ipAddress: "192.168.0.100" });

  await appPage.getByRole("button", { name: "Add Machine" }).click();
  await expect(appPage.locator('input[name="ipAddress"]')).toHaveValue("192.168.0.100");
  await appPage.getByRole("button", { name: "Connect", exact: true }).click();
  await expect(appPage.getByRole("heading", { name: "Connection Ready" })).toBeVisible();
  await appPage.getByRole("button", { name: "Complete", exact: true }).click();
  await expect
    .poll(() => appPage.evaluate(() => window.plcAPI.getStatus()))
    .toMatchObject({ state: "online", ipAddress: "192.168.0.100" });

  await machinePickerButton.click();

  await expect(
    appPage.evaluate(() => window.plcAPI.prepareConnection("192.168.0.100")),
  ).rejects.toThrow("Physical PLC controls are disabled in video demo mode");
  await expect(appPage.getByRole("button", { name: "Move Up" })).toBeEnabled();
  await expect(appPage.getByRole("button", { name: "Reset Stroke" })).toBeEnabled();
  await expect(appPage.getByRole("button", { name: "Halt" })).toBeEnabled();

  const controlResults = await appPage.evaluate(async () => {
    await window.plcAPI.setMoveUp(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    const moving = await window.plcAPI.readOverviewValues();
    await window.plcAPI.setMoveUp(false);
    await window.plcAPI.resetStroke();
    const reset = await window.plcAPI.readOverviewValues();
    await window.plcAPI.haltMachine();
    const halted = await window.plcAPI.readOverviewValues();
    await window.plcAPI.resumeMachine();
    const resumed = await window.plcAPI.readOverviewValues();
    return { moving, reset, halted, resumed };
  });
  expect(controlResults.moving.distance).toBeGreaterThan(0);
  expect(controlResults.reset.distance).toBe(0);
  expect(controlResults.halted.machineHalted).toBe(true);
  expect(controlResults.resumed.machineHalted).toBe(false);

  const demoLimits = await appPage.evaluate(async () => {
    const limits = await window.plcAPI.readLimits();
    const updatedLimits = { ...limits, testLoadLimit: limits.testLoadLimit + 100 };
    await window.plcAPI.writeLimits(updatedLimits);
    return window.plcAPI.readLimits();
  });
  expect(demoLimits.testLoadLimit).toBe(1100);

  await appPage.getByPlaceholder("Search specimens").click();
  await appPage.getByRole("option", { name: "E2E Specimen 1" }).click();
  await appPage.getByPlaceholder("Search presets").click();
  await appPage.getByRole("option", { name: /E2E Preset 1/ }).click();
  await appPage.getByRole("button", { name: "Start", exact: true }).click();

  await expect(appPage).toHaveURL(/#\/tests\/[\w-]+$/);
  const quickTestId = appPage.url().split("#/tests/").at(-1);
  expect(quickTestId).toBeTruthy();
  await expect(appPage.getByRole("heading", { level: 1 })).not.toHaveText("Overview");
  const quickTestTitle = (await appPage.getByRole("heading", { level: 1 }).textContent())?.trim();
  expect(quickTestTitle).toBeTruthy();
  expect(quickTestTitle).not.toMatch(/^Demo:/);
  await expect(appPage.getByRole("heading", { level: 1, name: quickTestTitle })).toBeVisible();

  await expect
    .poll(
      () =>
      appPage.evaluate(
        (testId) =>
          new Promise<{ name: string; machineIP: string | null; runStatus?: string; sampleCount: number } | null>((resolve) => {
            const request = indexedDB.open("akdi-makine-db");
            request.onsuccess = () => {
              const database = request.result;
              const transaction = database.transaction("tests", "readonly");
              const records = transaction.objectStore("tests").getAll();
              records.onsuccess = () => {
                const testRecord = records.result.find((record) => record.id === testId);
                resolve(
                  testRecord
                    ? {
                        name: testRecord.name,
                        machineIP: testRecord.machineIP,
                        runStatus: testRecord.runStatus,
                        sampleCount: testRecord.results?.loadDisplacementData?.length ?? 0,
                      }
                    : null,
                );
                database.close();
              };
            };
            request.onerror = () => resolve(null);
          }),
        quickTestId,
      ),
      { timeout: 10000 },
    )
    .toMatchObject({
      name: quickTestTitle,
      machineIP: "192.168.0.100",
      runStatus: "completed",
      sampleCount: expect.any(Number),
    });

  const demoTest = await appPage.evaluate(
    (testId) =>
      new Promise<{ sampleCount: number }>((resolve) => {
        const request = indexedDB.open("akdi-makine-db");
        request.onsuccess = () => {
          const database = request.result;
          const records = database.transaction("tests", "readonly").objectStore("tests").getAll();
          records.onsuccess = () => {
            const record = records.result.find((item) => item.id === testId);
            resolve({ sampleCount: record?.results?.loadDisplacementData?.length ?? 0 });
            database.close();
          };
        };
        request.onerror = () => resolve({ sampleCount: 0 });
      }),
    quickTestId,
  );
  expect(demoTest.sampleCount).toBeGreaterThan(0);

  const machineRecords = await appPage.evaluate(
    () =>
      new Promise<Array<{ ipAddress: string; connected: boolean }>>((resolve) => {
        const request = indexedDB.open("akdi-makine-db");
        request.onsuccess = () => {
          const database = request.result;
          const records = database.transaction("machines", "readonly").objectStore("machines").getAll();
          records.onsuccess = () => {
            resolve(records.result);
            database.close();
          };
        };
        request.onerror = () => resolve([]);
      }),
  );
  expect(machineRecords.some((machine) => machine.ipAddress === "192.168.0.100" || machine.connected)).toBe(false);

  await appPage.goto(`${appUrl}#/overview`);
  await expect(appPage.getByRole("button", { name: /192\.168\.0\.100/ })).toBeVisible();
});

test("starts and saves a mock test from the Add Test screen", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests/add`);
  await appPage.locator('input[name="name"]').fill("Add Screen Test");
  await appPage.getByPlaceholder("Search specimens").click();
  await appPage.getByRole("option", { name: "E2E Specimen 1" }).click();
  await appPage.getByPlaceholder("Search presets").click();
  await appPage.getByRole("option", { name: /E2E Preset 1/ }).click();
  await appPage.getByRole("button", { name: "Start", exact: true }).click();

  await expect(appPage).toHaveURL(/#\/tests\/[\w-]+$/);
  await expect(appPage.getByRole("heading", { level: 1, name: "Add Screen Test", exact: true })).toBeVisible();
  await expect
    .poll(
      () =>
        appPage.evaluate(
          () =>
            new Promise<{ runStatus?: string; sampleCount: number } | null>((resolve) => {
              const request = indexedDB.open("akdi-makine-db");
              request.onsuccess = () => {
                const database = request.result;
                const records = database.transaction("tests", "readonly").objectStore("tests").getAll();
                records.onsuccess = () => {
                  const record = records.result.find((item) => item.name === "Add Screen Test");
                  resolve(
                    record
                      ? { runStatus: record.runStatus, sampleCount: record.results?.loadDisplacementData?.length ?? 0 }
                      : null,
                  );
                  database.close();
                };
                records.onerror = () => {
                  database.close();
                  resolve(null);
                };
              };
              request.onerror = () => resolve(null);
            }),
        ),
      { timeout: 10000 },
    )
    .toMatchObject({ runStatus: "completed", sampleCount: expect.any(Number) });
});