import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select, Typography } from "@mui/material";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  CircleSmall,
  Columns,
  Copy,
  Ellipsis,
  EllipsisVertical,
  EyeClosed,
  Filter,
  Play,
  Send,
  Trash,
  X,
  XSquare,
} from "lucide-react";
import {
  getGridDateOperators,
  GridLogicOperator,
  type GridColDef,
  type GridFilterModel,
  type GridPaginationModel,
  type GridRenderCellParams,
  type GridRowSelectionModel,
  type GridRowSpacingParams,
  type GridSortModel,
} from "@mui/x-data-grid";
import DataGridWithRowActions, { type DataGridRowAction } from "@/components/data-grid/data-grid-with-row-actions";
import DataGridLoading from "@/components/data-grid/data-grid-loading";
import { StoredImagePreviews } from "@/components/data-fields/image-data-field-input";
import { DataGridListingToolbar } from "@/components/data-grid/data-grid-listing-toolbar";
import { DataGridPaginationFullPage } from "@/components/data-grid/data-grid-pagination";
import Search from "@/components/layout/search/search";
import DataGridDateTimeFilter from "@/components/data-grid/data-grid-date-time-filter";
import { useDb, type DataFieldDefinition, type TestListingQuery, type TestRecord, type UploadedImage } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";
import { NoTestsFound } from "@/pages/app/components/no-entity-found";
import { getTestGraphType } from "@/lib/db";
import { useTranslation } from "react-i18next";

type TestGridRow = TestRecord & { specimenName: string; presetName: string };

interface TestDataGridProps {
  tests?: TestRecord[];
  dataFields: DataFieldDefinition[];
  onTestsChange?: (update: (current: TestRecord[]) => TestRecord[]) => void;
  scope?: TestListingQuery["scope"];
  onAddItem?: (openInBackground?: boolean) => void;
  addDisabled?: boolean;
}

export default function TestDataGrid({ tests: providedTests, dataFields, onTestsChange, scope, onAddItem, addDisabled }: TestDataGridProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { deleteTest, deleteTests, duplicateTest, duplicateTests, getTest, getTestListingPage, getTestListingExportRows } = useDb();
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [internalTests, setTests] = useState<TestRecord[]>(providedTests ?? []);
  const tests = providedTests ?? internalTests;
  const isServerMode = providedTests === undefined;
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "createdAt", sort: "desc" }]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const [refreshKey, setRefreshKey] = useState(0);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: "include", ids: new Set() });
  const [incompatibleTests, setIncompatibleTests] = useState<TestRecord[] | null>(null);
  const requestId = useRef(0);
  const query = useMemo<TestListingQuery>(
    () => ({
      ...paginationModel,
      ...(scope ? { scope } : {}),
      fieldAliases: Object.fromEntries(dataFields.map(({ id, name }) => [id, name])),
      quickFilterValues: filterModel.quickFilterValues?.map(String),
      filterModel: {
        items: filterModel.items.map(({ field, operator, value }) => ({ field, operator, value })),
        logicOperator: filterModel.logicOperator === GridLogicOperator.Or ? "or" : "and",
      },
      sortModel: sortModel.map(({ field, sort }) => ({ field, sort })),
    }),
    [dataFields, filterModel, paginationModel, scope, sortModel],
  );

  useEffect(() => {
    if (!isServerMode) {
      setRowCount(providedTests?.length ?? 0);
      setIsLoading(false);
      return;
    }
    const activeRequestId = ++requestId.current;
    setIsLoading(true);
    void getTestListingPage(query)
      .then(({ rows: pageRows, totalCount }) => {
        if (requestId.current !== activeRequestId) return;
        setTests(pageRows);
        setRowCount(totalCount);
        const lastPage = Math.max(0, Math.ceil(totalCount / paginationModel.pageSize) - 1);
        if (paginationModel.page > lastPage) setPaginationModel((current) => ({ ...current, page: lastPage }));
      })
      .catch((error: unknown) => {
        if (requestId.current === activeRequestId) showError(t("listing-load-tests-error", { error: String(error) }));
      })
      .finally(() => {
        if (requestId.current === activeRequestId) setIsLoading(false);
      });

    return () => {
      requestId.current += 1;
    };
  }, [getTestListingPage, isServerMode, paginationModel.pageSize, paginationModel.page, providedTests, query, refreshKey, showError, t]);

  const duplicateRows = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;
      try {
        const duplicated = ids.length === 1 ? [await duplicateTest(ids[0])] : await duplicateTests(ids);
        const newTests = duplicated.filter((test): test is TestRecord => Boolean(test));
        if (newTests.length > 0) {
          if (!isServerMode) {
            const updateTests = onTestsChange ?? setTests;
            updateTests((current) => [...newTests, ...current].sort((first, second) => second.createdAt - first.createdAt || second.id.localeCompare(first.id)));
          } else {
            setRefreshKey((current) => current + 1);
          }
        }
        setRowSelectionModel({ type: "include", ids: new Set() });
      } catch (error) {
        showError(t("listing-duplicate-test-error", { error: String(error) }));
      }
    },
    [duplicateTest, duplicateTests, isServerMode, onTestsChange, showError, t],
  );
  const duplicateRow = useCallback((testId: string) => async () => duplicateRows([testId]), [duplicateRows]);
  const deleteRows = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      return requestDelete({
        title: t(ids.length === 1 ? "listing-delete-test-title" : "listing-delete-tests-title"),
        message: ids.length === 1 ? t("listing-delete-test-confirm") : t("listing-delete-tests-confirm", { count: ids.length }),
        errorMessage: (error) => t("listing-delete-test-error", { error: String(error) }),
        onConfirm: async () => {
          if (ids.length === 1) await deleteTest(ids[0]);
          else await deleteTests(ids);
          if (isServerMode) setRefreshKey((current) => current + 1);
          else (onTestsChange ?? setTests)((current) => current.filter((test) => !ids.includes(test.id)));
          setRowSelectionModel({ type: "include", ids: new Set() });
        },
      });
    },
    [deleteTest, deleteTests, isServerMode, onTestsChange, requestDelete, t],
  );
  const deleteRow = useCallback((testId: string) => async () => deleteRows([testId]), [deleteRows]);
  const handleCompare = useCallback(
    async (ids: string[]) => {
      const selectedTests = (await Promise.all(ids.map((id) => getTest(id)))).filter((test): test is TestRecord => Boolean(test));
      if (selectedTests.length === ids.length && new Set(selectedTests.map((test) => getTestGraphType(test.specimenSnapshot.geometry))).size > 1) {
        setIncompatibleTests(selectedTests);
        return;
      }

      const params = new URLSearchParams();
      ids.forEach((testId) => params.append("testId", testId));
      navigate(`/tests/compare?${params.toString()}`);
    },
    [getTest, navigate],
  );
  const getRowSpacing = useCallback((params: GridRowSpacingParams) => ({ top: params.isFirstVisible ? 0 : 5, bottom: 5 }), []);
  const getRowActions = useCallback(
    (testId: string): DataGridRowAction[] => [
      { key: "view", icon: <Send size={16} />, label: t("view"), onClick: () => navigate(`/tests/${testId}`) },
      { key: "duplicate", icon: <Copy size={16} />, label: t("duplicate"), onClick: duplicateRow(testId) },
      { key: "delete", icon: <XSquare size={16} />, label: t("delete"), onClick: deleteRow(testId), className: "hover:bg-error-light/10 hover:text-error" },
    ],
    [deleteRow, duplicateRow, navigate, t],
  );
  const rows = useMemo<TestGridRow[]>(
    () => tests.map((test) => ({ ...test, specimenName: test.specimenSnapshot.name, presetName: test.presetSnapshot.name })),
    [tests],
  );
  const columns = useMemo<GridColDef<TestGridRow>[]>(
    () => [
      { field: "id", headerName: t("listing-id"), width: 90, filterable: false },
      {
        field: "name",
        headerName: t("listing-name"),
        minWidth: 220,
        renderCell: (params: GridRenderCellParams<TestGridRow, string>) => (
          <Link
            to={`/tests/${params.row.id}`}
            className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'
          >
            {params.value}
          </Link>
        ),
      },
      {
        field: "specimenName",
        headerName: t("specimen"),
        minWidth: 180,
        renderCell: (params: GridRenderCellParams<TestGridRow, string>) =>
          params.row.specimenId ? (
            <Link
              to={`/specimens/${params.row.specimenId}`}
              className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'
            >
              {params.value}
            </Link>
          ) : (
            params.value
          ),
      },
      {
        field: "presetName",
        headerName: t("preset"),
        minWidth: 180,
        renderCell: (params: GridRenderCellParams<TestGridRow, string>) =>
          params.row.presetId ? (
            <Link
              to={`/presets/${params.row.presetId}`}
              className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'
            >
              {params.value}
            </Link>
          ) : (
            params.value
          ),
      },
      { field: "machineIP", headerName: t("listing-machine-ip"), minWidth: 150, valueFormatter: (value) => value || "-" },
      ...dataFields.map(
        (dataField): GridColDef<TestGridRow> => ({
          field: dataField.id,
          headerName: dataField.name,
          minWidth: 120,
          type:
            dataField.type === "Number"
              ? "number"
              : dataField.type === "Boolean"
                ? "boolean"
                : dataField.type === "Select" && !dataField.multipleSelection
                  ? "singleSelect"
                  : "string",
          valueGetter: (_value: unknown, row: TestGridRow) => row.customData?.[dataField.id] ?? row.customData?.[dataField.name],
          renderCell: (params: GridRenderCellParams<TestGridRow>) => {
            const value = params.value;
            if (value == null) return "-";
            if (dataField.type === "Image" && Array.isArray(value)) {
              return <StoredImagePreviews images={value as UploadedImage[]} imageClassName='h-8 w-10' />;
            }
            if (typeof value === "boolean") return value ? t("listing-true") : t("listing-false");
            const displayValue = Array.isArray(value)
              ? value
                  .map((item) => (typeof item === "string" ? item : item && typeof item === "object" && "name" in item ? item.name : String(item)))
                  .join(", ")
              : String(value);
            return dataField.unit ? `${displayValue} ${dataField.unit}` : displayValue;
          },
        }),
      ),
      {
        field: "createdAt",
        headerName: t("listing-created"),
        minWidth: 180,
        valueFormatter: (value) => new Date(Number(value)).toLocaleString(i18n.language, { dateStyle: "short", timeStyle: "short" }),
        filterOperators: getGridDateOperators(false).map((item) => ({ ...item, InputComponent: DataGridDateTimeFilter })),
      },
      {
        field: "updatedAt",
        headerName: t("listing-updated"),
        minWidth: 180,
        valueFormatter: (value) => new Date(Number(value)).toLocaleString(i18n.language, { dateStyle: "short", timeStyle: "short" }),
        filterOperators: getGridDateOperators(false).map((item) => ({ ...item, InputComponent: DataGridDateTimeFilter })),
      },
    ],
    [dataFields, i18n.language, t],
  );

  const exportCsv = useCallback(async () => {
    try {
      const matchingTests = await getTestListingExportRows(query);
      const headers = [t("listing-id"), t("listing-name"), t("specimen"), t("preset"), t("listing-machine-ip"), ...dataFields.map((field) => field.name), t("listing-created"), t("listing-updated")];
      const csvValue = (value: unknown) => {
        let text = Array.isArray(value)
          ? value.map((item) => (item && typeof item === "object" && "name" in item ? String(item.name) : String(item))).join(", ")
          : value && typeof value === "object"
            ? JSON.stringify(value)
            : String(value ?? "");
        if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
        return `"${text.replace(/"/g, '""')}"`;
      };
      const lines = [headers, ...matchingTests.map((test) => [
        test.id,
        test.name,
        test.specimenSnapshot.name,
        test.presetSnapshot.name,
        test.machineIP,
        ...dataFields.map((field) => {
          const value = test.customData?.[field.id] ?? test.customData?.[field.name];
          return typeof value === "boolean" ? (value ? t("listing-true") : t("listing-false")) : value;
        }),
        new Date(test.createdAt).toLocaleString(i18n.language),
        new Date(test.updatedAt).toLocaleString(i18n.language),
      ])].map((line) => line.map(csvValue).join(","));
      const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tests.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showError(t("listing-load-tests-error", { error: String(error) }));
    }
  }, [dataFields, getTestListingExportRows, i18n.language, query, showError, t]);

  return (
    <>
      {dialog}
      <Dialog open={Boolean(incompatibleTests)} onClose={() => setIncompatibleTests(null)}>
        <DialogTitle>{t("listing-test-incompatible-title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("listing-test-incompatible-message")}
          </DialogContentText>
          <Box className='mt-4 flex flex-col gap-2'>
            {incompatibleTests?.map((test) => (
              <Box key={test.id} className='flex min-w-0 flex-row gap-2'>
                <CircleSmall size={12} className='text-text-secondary mt-0.75' />
                <Box className='flex flex-col'>
                  <Typography variant='body1' className='wrap-break-word font-semibold'>
                    {test.name}
                  </Typography>
                  <Typography variant='body1' className='text-error'>
                    {getTestGraphType(test.specimenSnapshot.geometry) === "stress-strain" ? t("listing-graph-stress-strain") : t("listing-graph-load-displacement")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIncompatibleTests(null)} color='grey'>
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
      {isLoading && (isServerMode ? rowCount : tests.length) === 0 ? (
        <DataGridLoading />
      ) : (isServerMode ? rowCount : tests.length) === 0 ? (
        <NoTestsFound />
      ) : (
        <DataGridWithRowActions
          autoHeight
          rows={rows}
          columns={columns}
          loading={isLoading}
          rowCount={isServerMode ? rowCount : undefined}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode={isServerMode ? "server" : "client"}
          sortModel={sortModel}
          onSortModelChange={(model) => {
            setSortModel(model);
            setPaginationModel((current) => ({ ...current, page: 0 }));
          }}
          sortingMode={isServerMode ? "server" : "client"}
          filterModel={filterModel}
          onFilterModelChange={(model) => {
            setFilterModel(model);
            setPaginationModel((current) => ({ ...current, page: 0 }));
          }}
          filterMode={isServerMode ? "server" : "client"}
          initialState={{ columns: { columnVisibilityModel: { id: false, createdAt: false } } }}
          getRowSpacing={getRowSpacing}
          columnHeaderHeight={40}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={rowSelectionModel}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionExcludeModel
          onRowSelectionModelChange={setRowSelectionModel}
          hideFooterSelectedRowCount
          className='full-page dense border-none'
          pagination
          showToolbar
          slotProps={{
            panel: { className: "mt-1!" },
            toolbar: {
              rowSelectionModel,
              deleteRows,
              duplicateRows,
              onCompare: handleCompare,
              ...(isServerMode ? { onExportCsv: exportCsv } : {}),
              ...(onAddItem ? { onAddItem, addDisabled, addLabel: t("add-test"), addIcon: <Play /> } : {}),
            },
          }}
          classes={{ main: "overflow-visible" }}
          slots={{
            basePagination: DataGridPaginationFullPage,
            columnSortedDescendingIcon: () => <ArrowDown size={16} />,
            columnSortedAscendingIcon: () => <ArrowUp size={16} />,
            columnFilteredIcon: () => <Filter size={18} />,
            columnReorderIcon: () => <ChevronLeft />,
            columnMenuIcon: () => <EllipsisVertical size={16} />,
            columnMenuSortAscendingIcon: ArrowUp,
            columnMenuSortDescendingIcon: ArrowDown,
            columnMenuFilterIcon: Filter,
            columnMenuHideIcon: EyeClosed,
            columnMenuClearIcon: X,
            columnMenuManageColumnsIcon: Columns,
            filterPanelDeleteIcon: X,
            filterPanelRemoveAllIcon: Trash,
            baseSelect: (props: any) => (
              <FormControl size='small' variant='outlined'>
                <InputLabel>{props.label}</InputLabel>
                <Select {...props} IconComponent={ChevronDown} MenuProps={{ className: "outlined" }} />
              </FormControl>
            ),
            quickFilterIcon: () => <Search />,
            quickFilterClearIcon: () => <X />,
            baseButton: (props) => <Button {...props} variant='pastel' color='grey'></Button>,
            moreActionsIcon: () => <Ellipsis size={16} />,
            toolbar: DataGridListingToolbar,
          }}
          getRowActions={getRowActions}
        />
      )}
    </>
  );
}
