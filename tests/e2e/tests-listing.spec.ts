import { expect, test } from "./fixtures/electron-app";

test("pages through Tests and finds records outside the current page", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests`);
  await expect(appPage.getByText("E2E Test 25", { exact: true })).toBeVisible();
  await expect(appPage.getByText("E2E Test 15", { exact: true })).toHaveCount(0);

  await appPage.getByRole("button", { name: "Go to page 2" }).click();
  await expect(appPage.getByText("E2E Test 15", { exact: true })).toBeVisible();
  await expect(appPage.getByText("E2E Test 25", { exact: true })).toHaveCount(0);

  await appPage.getByRole("textbox", { name: "Search" }).fill("E2E Test 01");
  await expect(appPage.getByText("E2E Test 01", { exact: true })).toBeVisible();
  await expect(appPage.getByRole("row")).toHaveCount(2);
});

test("duplicates and compares existing completed tests without running a machine test", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests`);
  const firstRow = appPage.getByRole("grid").getByRole("row").nth(1);
  await firstRow.getByRole("button", { name: "Actions for E2E Test 25" }).click();
  await appPage.getByRole("menuitem", { name: "Duplicate", exact: true }).click();
  await expect(appPage.getByText("E2E Test 25 (Copy)", { exact: true })).toBeVisible();

  const grid = appPage.getByRole("grid");
  await grid.getByRole("row").nth(1).getByRole("checkbox", { name: "Select row" }).check();
  await grid.getByRole("row").nth(2).getByRole("checkbox", { name: "Select row" }).check();
  await appPage.getByRole("button", { name: "2 Items", exact: true }).click();
  await appPage.getByRole("menuitem", { name: "Compare", exact: true }).click();
  await expect(appPage).toHaveURL(/#\/tests\/compare\?testId=/);
  await expect(appPage.getByRole("heading", { level: 1, name: "Compare Tests", exact: true })).toBeVisible();
});

test("exports every matching row and scopes Tests by specimen and preset", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests`);
  await appPage.getByRole("textbox", { name: "Search" }).fill("E2E Test 01");
  await expect(appPage.getByText("E2E Test 01", { exact: true })).toBeVisible();

  await appPage.evaluate(() => {
    const testWindow = globalThis as typeof globalThis & { __e2eCsvText: string | null };
    testWindow.__e2eCsvText = null;
    const createObjectUrl = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (blob) => {
      if (blob instanceof Blob) void blob.text().then((text) => (testWindow.__e2eCsvText = text));
      return createObjectUrl(blob);
    };
  });
  await appPage.getByRole("button", { name: "Export" }).click();
  await appPage.getByRole("menuitem", { name: "Save as CSV" }).click();
  await expect.poll(() => appPage.evaluate(() => (globalThis as typeof globalThis & { __e2eCsvText: string | null }).__e2eCsvText)).not.toBeNull();
  const csvContent = await appPage.evaluate(() => (globalThis as typeof globalThis & { __e2eCsvText: string }).__e2eCsvText);
  expect(csvContent).toContain('"E2E Test 01"');
  expect(csvContent).not.toContain('"E2E Test 02"');

  await appPage.getByRole("link", { name: "E2E Specimen 1", exact: true }).click();
  await expect(appPage).toHaveURL(/#\/specimens\/e2e-specimen-1$/);
  await appPage.getByRole("tab", { name: "Tests", exact: true }).click();
  await expect(appPage.getByText("E2E Test 01", { exact: true })).toBeVisible();
  await expect(appPage.getByText("E2E Test 02", { exact: true })).toHaveCount(0);

  await appPage.goto(`${appUrl}#/presets/e2e-preset-1`);
  await appPage.getByRole("tab", { name: "Tests", exact: true }).click();
  await expect(appPage.getByText("E2E Test 25", { exact: true })).toBeVisible();
  await expect(appPage.getByText("E2E Test 24", { exact: true })).toHaveCount(0);
});
