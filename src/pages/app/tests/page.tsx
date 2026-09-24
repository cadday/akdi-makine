import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Box, Breadcrumbs, Button, FormControl, Grid, InputLabel, Select, Typography } from "@mui/material";
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
  File,
  Filter,
  OctagonAlert,
  Pen,
  Play,
  Repeat2,
  Send,
  Trash,
  X,
  XSquare,
} from "lucide-react";
import {
  DataGrid,
  getGridDateOperators,
  GridActionsCellItem,
  type GridColDef,
  type GridRenderCellParams,
  type GridRowSelectionModel,
  type GridRowSpacingParams,
} from "@mui/x-data-grid";
import { DataGridPaginationFullPage } from "@/components/data-grid/data-grid-pagination";
import { DataGridListingToolbar } from "@/components/data-grid/data-grid-listing-toolbar";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { StoredImagePreviews } from "@/components/data-fields/image-data-field-input";
import Search from "@/components/layout/search/search";
import DataGridDateTimeFilter from "@/components/data-grid/data-grid-date-time-filter";
import { LINKS } from "@/constants";
import {
  useDb,
  type DataFieldDefinition,
  type PresetRecord,
  type SpecimenRecord,
  type TestRecord,
  type UploadedImage,
} from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";

type TestGridRow = TestRecord & {
  specimenName: string;
  presetName: string;
};

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getTests, getSpecimens, getPresets, getDataFields, deleteTest, deleteTests, duplicateTest, duplicateTests } = useDb();
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [specimens, setSpecimens] = useState<SpecimenRecord[]>([]);
  const [presets, setPresets] = useState<PresetRecord[]>([]);
  const [dataFields, setDataFields] = useState<DataFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

  const loadTests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [testData, specimenData, presetData, fieldData] = await Promise.all([getTests(), getSpecimens(), getPresets(), getDataFields("Test")]);
      setTests(testData);
      setSpecimens(specimenData);
      setPresets(presetData);
      setDataFields(fieldData);
    } catch (loadError) {
      const message = `Failed to load tests: ${String(loadError)}`;
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getDataFields, getPresets, getSpecimens, getTests, showError]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [testData, specimenData, presetData, fieldData] = await Promise.all([getTests(), getSpecimens(), getPresets(), getDataFields("Test")]);
        if (!cancelled) {
          setTests(testData);
          setSpecimens(specimenData);
          setPresets(presetData);
          setDataFields(fieldData);
        }
      } catch (loadError) {
        if (!cancelled) {
          const message = `Failed to load tests: ${String(loadError)}`;
          setError(message);
          showError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [getDataFields, getPresets, getSpecimens, getTests, showError]);

  const duplicateRows = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;
      try {
        const duplicated = ids.length === 1 ? [await duplicateTest(ids[0])] : await duplicateTests(ids);
        const newTests = duplicated.filter((item): item is TestRecord => Boolean(item));
        setTests((current) => [...newTests, ...current]);
        setRowSelectionModel({ type: "include", ids: new Set() });
      } catch (duplicateError) {
        showError(`Failed to duplicate test(s): ${String(duplicateError)}`);
      }
    },
    [duplicateTest, duplicateTests, showError],
  );

  const duplicateRow = useCallback((id: string) => async () => duplicateRows([id]), [duplicateRows]);

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
          setTests((current) => current.filter((test) => !ids.includes(test.id)));
          setRowSelectionModel({ type: "include", ids: new Set() });
        },
      });
    },
    [deleteTest, deleteTests, requestDelete],
  );

  const deleteRow = useCallback((id: string) => async () => deleteRows([id]), [deleteRows]);
  const handleAddItem = useCallback(() => navigate("/tests/add"), [navigate]);
  const getRowSpacing = useCallback((params: GridRowSpacingParams) => ({ top: params.isFirstVisible ? 0 : 5, bottom: 5 }), []);

  const rows = useMemo<TestGridRow[]>(() => {
    const specimenNames = new Map(specimens.map((specimen) => [specimen.id, specimen.name]));
    const presetNames = new Map(presets.map((preset) => [preset.id, preset.name]));
    return tests.map((test) => ({
      ...test,
      specimenName: test.specimenId ? (specimenNames.get(test.specimenId) ?? "-") : "-",
      presetName: test.presetId ? (presetNames.get(test.presetId) ?? "-") : "-",
    }));
  }, [presets, specimens, tests]);

  const columns = useMemo<GridColDef<TestGridRow>[]>(
    () => [
      { field: "id", headerName: "ID", width: 90, filterable: false },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
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
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        minWidth: 80,
        flex: 1,
        align: "right",
        headerAlign: "right",
        getActions: (params) => [
          <GridActionsCellItem key='view' icon={<Send size={16} />} label='View' onClick={() => navigate(`/tests/${params.id}`)} showInMenu />,
          <GridActionsCellItem key='edit' icon={<Pen size={16} />} label='Edit' onClick={() => navigate(`/tests/${params.id}/edit`)} showInMenu />,
          <GridActionsCellItem key='duplicate' icon={<Copy size={16} />} label='Duplicate' onClick={duplicateRow(String(params.id))} showInMenu />,
          <GridActionsCellItem
            className='hover:bg-error-light/10 hover:text-error'
            key='delete'
            icon={<XSquare size={16} />}
            label='Delete'
            onClick={deleteRow(String(params.id))}
            showInMenu
          />,
        ],
      },
    ],
    [dataFields, deleteRow, duplicateRow, navigate],
  );

  return (
    <>
      {dialog}
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("menu-tests")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("menu-tests")}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className='w-full'>
          <Grid size={12}>
            {error ? (
              <Box className='flex flex-col items-center gap-4'>
                <Box className='flex flex-col gap-2 items-center'>
                  <Box className='w-10 h-10 border border-dashed border-error flex items-center justify-center rounded-lg'>
                    <OctagonAlert className='text-error' />
                  </Box>
                </Box>
                <Button size='large' variant='outlined' color='grey' startIcon={<Repeat2 />} onClick={() => void loadTests()}>
                  Retry
                </Button>
              </Box>
            ) : isLoading ? (
              <Box></Box>
            ) : rows.length === 0 ? (
              <Box className='flex flex-col items-center gap-4'>
                <Box className='flex flex-col gap-2 items-center'>
                  <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
                    <File className='text-text-secondary' />
                  </Box>
                  <Typography>Nothing found to display!</Typography>
                </Box>
                <Button size='large' variant='outlined' color='grey' startIcon={<Play />} onClick={handleAddItem}>
                  Run Test
                </Button>
              </Box>
            ) : (
              <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                loading={isLoading}
                initialState={{
                  columns: { columnVisibilityModel: { id: false, createdAt: false } },
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                getRowSpacing={getRowSpacing}
                columnHeaderHeight={40}
                checkboxSelection
                disableRowSelectionOnClick
                className='full-page dense border-none'
                pagination
                rowSelectionModel={rowSelectionModel}
                pageSizeOptions={[10, 20, 50, 100]}
                disableRowSelectionExcludeModel
                onRowSelectionModelChange={setRowSelectionModel}
                hideFooterSelectedRowCount
                showToolbar
                slotProps={{
                  panel: { className: "mt-1!" },
                  toolbar: { rowSelectionModel, deleteRows, duplicateRows, onAddItem: handleAddItem, addLabel: "Run Test", addIcon: <Play /> },
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
              />
            )}
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
