import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Link, useNavigate } from "react-router";
import { Button, FormControl, InputLabel, Select } from "@mui/material";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
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
import { getGridDateOperators, type GridColDef, type GridRenderCellParams, type GridRowSelectionModel, type GridRowSpacingParams } from "@mui/x-data-grid";
import DataGridWithRowActions, { type DataGridRowAction } from "@/components/data-grid/data-grid-with-row-actions";
import { StoredImagePreviews } from "@/components/data-fields/image-data-field-input";
import { DataGridListingToolbar } from "@/components/data-grid/data-grid-listing-toolbar";
import { DataGridPaginationFullPage } from "@/components/data-grid/data-grid-pagination";
import Search from "@/components/layout/search/search";
import DataGridDateTimeFilter from "@/components/data-grid/data-grid-date-time-filter";
import { useDb, type DataFieldDefinition, type TestRecord, type UploadedImage } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";

type TestGridRow = TestRecord & { specimenName: string; presetName: string };

interface TestDataGridProps {
  tests: TestRecord[];
  dataFields: DataFieldDefinition[];
  onTestsChange: Dispatch<SetStateAction<TestRecord[]>>;
  onAddItem?: () => void;
}

export default function TestDataGrid({ tests, dataFields, onTestsChange, onAddItem }: TestDataGridProps) {
  const navigate = useNavigate();
  const { deleteTest, deleteTests, duplicateTest, duplicateTests } = useDb();
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

  const duplicateRows = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;
      try {
        const duplicated = ids.length === 1 ? [await duplicateTest(ids[0])] : await duplicateTests(ids);
        const newTests = duplicated.filter((test): test is TestRecord => Boolean(test));
        onTestsChange((current) => [...newTests, ...current].sort((first, second) => second.createdAt - first.createdAt || second.id.localeCompare(first.id)));
        setRowSelectionModel({ type: "include", ids: new Set() });
      } catch (error) {
        showError(`Failed to duplicate test(s): ${String(error)}`);
      }
    },
    [duplicateTest, duplicateTests, onTestsChange, showError],
  );
  const duplicateRow = useCallback((testId: string) => async () => duplicateRows([testId]), [duplicateRows]);
  const deleteRows = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      return requestDelete({
        title: ids.length === 1 ? "Delete Test" : "Delete Tests",
        message: ids.length === 1 ? "Delete this test? This action cannot be undone." : `Delete ${ids.length} tests? This action cannot be undone.`,
        errorMessage: "Failed to delete test(s):",
        onConfirm: async () => {
          if (ids.length === 1) await deleteTest(ids[0]);
          else await deleteTests(ids);
          onTestsChange((current) => current.filter((test) => !ids.includes(test.id)));
          setRowSelectionModel({ type: "include", ids: new Set() });
        },
      });
    },
    [deleteTest, deleteTests, onTestsChange, requestDelete],
  );
  const deleteRow = useCallback((testId: string) => async () => deleteRows([testId]), [deleteRows]);
  const handleCompare = useCallback(
    (ids: string[]) => {
      const params = new URLSearchParams();
      ids.forEach((testId) => params.append("testId", testId));
      navigate(`/tests/compare?${params.toString()}`);
    },
    [navigate],
  );
  const getRowSpacing = useCallback((params: GridRowSpacingParams) => ({ top: params.isFirstVisible ? 0 : 5, bottom: 5 }), []);
  const getRowActions = useCallback(
    (testId: string): DataGridRowAction[] => [
      { key: "view", icon: <Send size={16} />, label: "View", onClick: () => navigate(`/tests/${testId}`) },
      { key: "duplicate", icon: <Copy size={16} />, label: "Duplicate", onClick: duplicateRow(testId) },
      { key: "delete", icon: <XSquare size={16} />, label: "Delete", onClick: deleteRow(testId), className: "hover:bg-error-light/10 hover:text-error" },
    ],
    [deleteRow, duplicateRow, navigate],
  );
  const rows = useMemo<TestGridRow[]>(() => tests.map((test) => ({ ...test, specimenName: test.specimenSnapshot.name, presetName: test.presetSnapshot.name })), [tests]);
  const columns = useMemo<GridColDef<TestGridRow>[]>(
    () => [
      { field: "id", headerName: "ID", width: 90, filterable: false },
      {
        field: "name",
        headerName: "Name",
        minWidth: 220,
        renderCell: (params: GridRenderCellParams<TestGridRow, string>) => (
          <Link to={`/tests/${params.row.id}`} className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'>
            {params.value}
          </Link>
        ),
      },
      { field: "specimenName", headerName: "Specimen", minWidth: 180 },
      { field: "presetName", headerName: "Preset", minWidth: 180 },
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
            if (typeof value === "boolean") return value ? "True" : "False";
            const displayValue = Array.isArray(value)
              ? value.map((item) => (typeof item === "string" ? item : item && typeof item === "object" && "name" in item ? item.name : String(item))).join(", ")
              : String(value);
            return dataField.unit ? `${displayValue} ${dataField.unit}` : displayValue;
          },
        }),
      ),
      {
        field: "createdAt",
        headerName: "Created",
        minWidth: 180,
        valueFormatter: (value) => new Date(Number(value)).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }),
        filterOperators: getGridDateOperators(false).map((item) => ({ ...item, InputComponent: DataGridDateTimeFilter })),
      },
      {
        field: "updatedAt",
        headerName: "Updated",
        minWidth: 180,
        valueFormatter: (value) => new Date(Number(value)).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }),
        filterOperators: getGridDateOperators(false).map((item) => ({ ...item, InputComponent: DataGridDateTimeFilter })),
      },
    ],
    [dataFields],
  );

  return (
    <>
      {dialog}
      <DataGridWithRowActions
        autoHeight
        rows={rows}
        columns={columns}
        initialState={{
          columns: { columnVisibilityModel: { id: false, createdAt: false } },
          pagination: { paginationModel: { pageSize: 10 } },
        }}
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
            ...(onAddItem ? { onAddItem, addLabel: "Add Test", addIcon: <Play /> } : {}),
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
    </>
  );
}