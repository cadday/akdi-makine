import { expect, test } from "./fixtures/electron-app";

test("creates, edits, and deletes a specimen without machine access", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/specimens/add`);
  await appPage.locator("form input[name='name']").fill("E2E Created Specimen");
  await appPage.getByRole("button", { name: "Save", exact: true }).click();
  await expect(appPage).toHaveURL(/#\/specimens$/);
  await expect(appPage.getByText("E2E Created Specimen", { exact: true })).toBeVisible();

  const specimenHref = await appPage.getByRole("link", { name: "E2E Created Specimen", exact: true }).getAttribute("href");
  const specimenId = specimenHref?.split("/").at(-1);
  expect(specimenId).toBeTruthy();
  await appPage.goto(`${appUrl}#/specimens/${specimenId}/edit`);
  await appPage.locator("form input[name='name']").fill("E2E Updated Specimen");
  await appPage.getByRole("button", { name: "Update", exact: true }).click();
  await expect(appPage).toHaveURL(new RegExp(`#\\/specimens\\/${specimenId}$`));
  await expect(appPage.getByRole("heading", { level: 1, name: "E2E Updated Specimen", exact: true })).toBeVisible();

  await appPage.goto(`${appUrl}#/specimens`);
  const row = appPage.getByRole("row").filter({ hasText: "E2E Updated Specimen" });
  await row.getByRole("button", { name: "Actions for E2E Updated Specimen" }).click();
  await appPage.getByRole("menuitem", { name: "Delete", exact: true }).click();
  await appPage.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  await expect(row).toHaveCount(0);
});

test("creates and edits a preset", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/presets/add`);
  await appPage.locator("form input[name='name']").fill("E2E Created Preset");
  const selectors = appPage.locator("form [role='combobox']");
  await selectors.nth(0).click();
  await appPage.getByRole("option", { name: "Tensile", exact: true }).click();
  await selectors.nth(1).click();
  await appPage.getByRole("option", { name: "Load", exact: true }).click();

  await appPage.locator("form input[type='number']").fill("1");
  await appPage.locator("form input[inputmode='decimal']").last().fill("100");
  await appPage.getByRole("button", { name: "Save", exact: true }).click();
  await expect(appPage).toHaveURL(/#\/presets$/);
  await expect(appPage.getByText("E2E Created Preset", { exact: true })).toBeVisible();

  const presetHref = await appPage.getByRole("link", { name: "E2E Created Preset", exact: true }).getAttribute("href");
  const presetId = presetHref?.split("/").at(-1);
  expect(presetId).toBeTruthy();
  await appPage.goto(`${appUrl}#/presets/${presetId}/edit`);
  await appPage.locator("form input[name='name']").fill("E2E Updated Preset");
  await appPage.getByRole("button", { name: "Update", exact: true }).click();
  await expect(appPage).toHaveURL(new RegExp(`#\\/presets\\/${presetId}$`));
  await expect(appPage.getByRole("heading", { level: 1, name: "E2E Updated Preset", exact: true })).toBeVisible();

  await appPage.goto(`${appUrl}#/presets`);
  const row = appPage.getByRole("row").filter({ hasText: "E2E Updated Preset" });
  await row.getByRole("button", { name: "Actions for E2E Updated Preset" }).click();
  await appPage.getByRole("menuitem", { name: "Delete", exact: true }).click();
  await appPage.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  await expect(row).toHaveCount(0);
});

test("creates and edits a specimen data field", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/data-fields/add`);
  const selectors = appPage.locator("form [role='combobox']");
  await selectors.nth(0).click();
  await appPage.getByRole("option", { name: "Text", exact: true }).click();
  await selectors.nth(1).click();
  await appPage.getByRole("option", { name: "Specimen", exact: true }).click();
  await appPage.locator("form input[name='name']").fill("E2E Created Field");
  await appPage.getByRole("button", { name: "Save", exact: true }).click();
  await expect(appPage).toHaveURL(/#\/data-fields$/);
  await expect(appPage.getByText("E2E Created Field", { exact: true })).toBeVisible();

  await appPage.getByRole("link", { name: "E2E Created Field", exact: true }).click();
  await expect(appPage).toHaveURL(/#\/data-fields\//);
  await appPage.locator("form input[name='name']").fill("E2E Updated Field");
  await appPage.getByRole("button", { name: "Update", exact: true }).click();
  await expect(appPage).toHaveURL(/#\/data-fields$/);
  await expect(appPage.getByText("E2E Updated Field", { exact: true })).toBeVisible();

  const row = appPage.getByRole("row").filter({ hasText: "E2E Updated Field" });
  await row.getByRole("button", { name: "Actions for E2E Updated Field" }).click();
  await appPage.getByRole("menuitem", { name: "Delete", exact: true }).click();
  await appPage.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  await expect(row).toHaveCount(0);
});

test("opens backup settings and exports through the native-dialog boundary", async ({ appPage, appUrl, electronApp }) => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showSaveDialog = async () => ({ canceled: true, filePath: "" });
  });
  await appPage.goto(`${appUrl}#/settings`);
  await expect(appPage.getByRole("heading", { level: 1, name: "Settings", exact: true })).toBeVisible();
  await expect(appPage.getByRole("button", { name: "Select Backup" })).toBeVisible();
  await appPage.getByRole("button", { name: "Download Backup" }).click();
  await expect(appPage.getByRole("button", { name: "Download Backup" })).toBeEnabled();
});
