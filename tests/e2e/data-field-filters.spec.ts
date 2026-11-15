import { expect, test } from "./fixtures/electron-app";

async function chooseFilter(page: import("@playwright/test").Page, fieldName: string) {
  await page.getByRole("button", { name: "Filters" }).click();
  const filterForm = page.locator(".MuiDataGrid-filterForm").first();
  await expect(filterForm).toBeVisible();
  const selectors = filterForm.getByRole("combobox");
  await selectors.nth(0).click();
  await page.getByRole("option", { name: fieldName, exact: true }).click();
  await selectors.nth(1).click();
  await page.getByRole("option", { name: "is any of", exact: true }).click();
  return { filterForm, valueSelector: selectors.nth(2) };
}

test("filters Specimens with configured Select field options", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/specimens`);
  const grid = appPage.getByRole("grid");
  await expect(grid.getByText("E2E Specimen 1", { exact: true })).toBeVisible();

  const { valueSelector } = await chooseFilter(appPage, "E2E Specimen Material");
  await valueSelector.click();
  await expect(appPage.getByRole("option", { name: "Copper", exact: true })).toBeVisible();
  await expect(appPage.getByRole("option", { name: "Steel", exact: true })).toBeVisible();
  await appPage.getByRole("option", { name: "Copper", exact: true }).click();

  await expect(grid.getByText("E2E Specimen 1", { exact: true })).toBeVisible();
  await expect(grid.getByText("E2E Specimen 3", { exact: true })).toBeVisible();
  await expect(grid.getByText("E2E Specimen 2", { exact: true })).toHaveCount(0);
});

test("filters Test multi-select fields by any configured option", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests`);
  const grid = appPage.getByRole("grid");
  await expect(grid.getByText("E2E Test 25", { exact: true })).toBeVisible();

  const { valueSelector } = await chooseFilter(appPage, "E2E Test Checks");
  await valueSelector.click();
  await expect(appPage.getByRole("option", { name: "Visual", exact: true })).toBeVisible();
  await expect(appPage.getByRole("option", { name: "Dimensional", exact: true })).toBeVisible();
  await expect(appPage.getByRole("option", { name: "Chemical", exact: true })).toBeVisible();
  await appPage.getByRole("option", { name: "Visual", exact: true }).click();
  await valueSelector.click();
  await appPage.getByRole("option", { name: "Chemical", exact: true }).click();

  await expect(grid.getByText("E2E Test 25", { exact: true })).toBeVisible();
  await expect(grid.getByText("E2E Test 23", { exact: true })).toBeVisible();
  await expect(grid.getByText("E2E Test 24", { exact: true })).toHaveCount(0);
});
