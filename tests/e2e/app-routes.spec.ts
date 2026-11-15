import { expect, test } from "./fixtures/electron-app";

test("opens each primary app route and seeded record detail", async ({ appPage, appUrl }) => {
  const routes = [
    ["/overview", "Overview"],
    ["/tests", "Tests"],
    ["/specimens", "Specimens"],
    ["/presets", "Presets"],
    ["/data-fields", "Data Fields"],
    ["/settings", "Settings"],
    ["/tests/e2e-test-25", "E2E Test 25"],
    ["/specimens/e2e-specimen-1", "E2E Specimen 1"],
    ["/presets/e2e-preset-1", "E2E Preset 1"],
    ["/data-fields/e2e-data-field-1", "E2E Data Field 1"],
  ] as const;

  for (const [route, heading] of routes) {
    await appPage.goto(`${appUrl}#${route}`);
    await expect(appPage.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
  }
});

test("searches specimen, preset, and data-field listings through async queries", async ({ appPage, appUrl }) => {
  const listings = [
    ["/specimens", "E2E Specimen 3", "E2E Specimen 1"],
    ["/presets", "Compression", "Tensile"],
    ["/data-fields", "E2E Data Field 1", "Missing E2E Data Field"],
  ] as const;

  for (const [route, matchingName, excludedName] of listings) {
    await appPage.goto(`${appUrl}#${route}`);
    await appPage.getByRole("textbox", { name: "Search" }).fill(matchingName);
    const grid = appPage.getByRole("grid");
    await expect(grid.getByText(matchingName, { exact: true })).toBeVisible();
    await expect(grid.getByText(excludedName, { exact: true })).toHaveCount(0);
  }
});

test("keeps listing grids available when search has no matches", async ({ appPage, appUrl }) => {
  const listings = [
    ["/tests", "E2E Test 25"],
    ["/specimens", "E2E Specimen 1"],
    ["/presets", "E2E Preset 1"],
    ["/data-fields", "E2E Data Field 1"],
  ] as const;

  for (const [route, existingName] of listings) {
    await appPage.goto(`${appUrl}#${route}`);
    const grid = appPage.getByRole("grid");
    const search = appPage.getByRole("textbox", { name: "Search" });
    await expect(grid.getByText(existingName, { exact: true })).toBeVisible();

    await search.fill("No matching record 12345");
    const noResults = appPage.getByText("No results found!", { exact: true });
    await expect(noResults).toBeVisible();
    await expect(noResults.locator("xpath=..").locator("svg")).toHaveCount(0);
    await expect(grid).toBeVisible();
    await expect(appPage.getByRole("button", { name: /Add/ })).toBeVisible();

    await search.fill("");
    await expect(grid.getByText(existingName, { exact: true })).toBeVisible();
  }
});

test("keeps the test grid available when a column filter has no matches", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests`);
  const grid = appPage.getByRole("grid");
  await expect(grid.getByText("E2E Test 25", { exact: true })).toBeVisible();
  await appPage.getByRole("button", { name: "Filters" }).click();
  const filterForm = appPage.locator(".MuiDataGrid-filterForm").first();
  await expect(filterForm).toBeVisible();
  await filterForm.getByRole("textbox", { name: "Value" }).fill("No matching record 12345");

  const noResults = appPage.getByText("No results found!", { exact: true });
  await expect(noResults).toBeVisible();
  await expect(noResults.locator("xpath=..").locator("svg")).toHaveCount(0);
  await expect(grid).toBeVisible();
  await expect(appPage.getByRole("button", { name: /Add/ })).toBeVisible();

  await filterForm.getByRole("textbox", { name: "Value" }).fill("");
  await expect(grid.getByText("E2E Test 25", { exact: true })).toBeVisible();
});

test("expands a test result graph into a full-screen dialog and closes it", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests/e2e-test-25`);
  await appPage.getByRole("button", { name: "Expand Graph" }).click();

  const dialog = appPage.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "E2E Test 25", exact: true })).toBeVisible();
  await expect(dialog.getByText("Stress-Strain Graph", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("img", { name: "Live Stress-Strain line chart" })).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
});
