import { expect, test } from "./fixtures/electron-app";

test("opens and switches between a record tab and the active Tests tab", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests`);
  await appPage.getByRole("grid").getByRole("row").nth(1).getByRole("link", { name: "E2E Specimen 1", exact: true }).click({ modifiers: ["Control"] });

  const tabs = appPage.getByRole("tablist", { name: "Open Tabs" });
  const specimenTab = tabs.getByRole("tab", { name: "E2E Specimen 1", exact: true });
  await expect(specimenTab).toBeVisible();
  await expect(tabs.getByRole("tab", { name: "Tests", exact: true })).toHaveAttribute("aria-selected", "true");

  await specimenTab.click();
  await expect(appPage).toHaveURL(/#\/specimens\/e2e-specimen-1$/);
  await expect(appPage.getByRole("heading", { level: 1, name: "E2E Specimen 1", exact: true })).toBeVisible();

  await tabs.getByRole("tab", { name: "Tests", exact: true }).click();
  await expect(appPage).toHaveURL(/#\/tests$/);
});

test("removes a deleted record from its background tab while keeping the list active", async ({ appPage, appUrl }) => {
  await appPage.goto(`${appUrl}#/tests`);
  await appPage.getByRole("grid").getByRole("row").nth(1).getByRole("link", { name: "E2E Specimen 1", exact: true }).click({ modifiers: ["Control"] });
  const tabs = appPage.getByRole("tablist", { name: "Open Tabs" });
  await expect(tabs.getByRole("tab", { name: "E2E Specimen 1", exact: true })).toBeVisible();

  await appPage.goto(`${appUrl}#/specimens`);
  const specimenRow = appPage.getByRole("row").filter({ hasText: "E2E Specimen 1" });
  await specimenRow.getByRole("button", { name: "Actions for E2E Specimen 1" }).click();
  await appPage.getByRole("menuitem", { name: "Delete", exact: true }).click();
  await appPage.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();

  await expect(specimenRow).toHaveCount(0);
  await expect(tabs.getByRole("tab", { name: "E2E Specimen 1", exact: true })).toHaveCount(0);
  await expect(tabs.getByRole("tab", { name: "Specimens", exact: true })).toHaveAttribute("aria-selected", "true");
});
