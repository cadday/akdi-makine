import type { GridFilterModel } from "@mui/x-data-grid";

export function hasActiveGridQuery(filterModel: GridFilterModel): boolean {
  const hasSearch = (filterModel.quickFilterValues ?? []).some((value) => String(value).trim() !== "");
  const hasAppliedFilter = filterModel.items.some(
    (item) => (item.value != null && item.value !== "") || item.operator === "isEmpty" || item.operator === "isNotEmpty",
  );

  return hasSearch || hasAppliedFilter;
}