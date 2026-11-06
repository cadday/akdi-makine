import { Link, useNavigate } from "react-router";

import { DataGridPaginationFullPage } from "@/components/data-grid/data-grid-pagination";
import { DataGridListingToolbar } from "@/components/data-grid/data-grid-listing-toolbar";
import DataGridWithRowActions, { type DataGridRowAction } from "@/components/data-grid/data-grid-with-row-actions";
import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useTranslation } from "react-i18next";
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
  OctagonAlert,
  Repeat2,
  Send,
  Trash,
  X,
  XSquare,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Breadcrumbs, Button, FormControl, Grid, InputLabel, Select, Typography } from "@mui/material";
import { getGridDateOperators, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridRowSpacingParams } from "@mui/x-data-grid";
import { PresetRecord, useDb } from "@/context/db-context";
import { Filter } from "lucide-react";
import Search from "@/components/layout/search/search";
import DataGridDateTimeFilter from "@/components/data-grid/data-grid-date-time-filter";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";
import { NoPresetsFound } from "../components/no-entity-found";
import { useTabs } from "@/components/layout/tabs/tab-context";
import PresetTypeTag from "./components/preset-type-tag";

type PresetGridRow = PresetRecord;

export default function Page() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { openTab } = useTabs();
  const { getPresets, deletePreset, deletePresets } = useDb();
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [presets, setPresets] = useState<PresetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPresets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPresets();
      setPresets(data);
    } catch (err) {
      const message = t("listing-load-presets-error", { error: String(err) });
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getPresets, showError, t]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getPresets();
        if (!cancelled) setPresets(data);
      } catch (err) {
        if (!cancelled) {
          const message = t("listing-load-presets-error", { error: String(err) });
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
  }, [getPresets, showError, t]);

  const deleteRows = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;

      return requestDelete({
        title: t(ids.length === 1 ? "listing-delete-preset-title" : "listing-delete-presets-title"),
        message: ids.length === 1 ? t("listing-delete-preset-confirm") : t("listing-delete-presets-confirm", { count: ids.length }),
        errorMessage: (error) => t("listing-delete-preset-error", { error: String(error) }),
        onConfirm: async () => {
          if (ids.length === 1) await deletePreset(ids[0]);
          else await deletePresets(ids);

          setPresets((current) => current.filter((preset) => !ids.includes(preset.id)));
          setRowSelectionModel({ type: "include", ids: new Set() });
        },
      });
    },
    [deletePreset, deletePresets, requestDelete, t],
  );

  const deleteRow = useCallback((id: string) => async () => deleteRows([id]), [deleteRows]);

  const getRowActions = useCallback(
    (id: string): DataGridRowAction[] => {
      const preset = presets.find((item) => item.id === id);
      if (!preset) return [];

      return [
        { key: "view", icon: <Send size={16} />, label: t("view"), onClick: () => navigate(`/presets/${id}`) },
        {
          key: "duplicate",
          icon: <Copy size={16} />,
          label: t("duplicate"),
          onClick: () => navigate("/presets/add", { state: { initialPreset: { ...preset, name: `${preset.name} (Copy)` } } }),
        },
        {
          key: "delete",
          icon: <XSquare size={16} />,
          label: t("delete"),
          onClick: deleteRow(id),
          className: "hover:bg-error-light/10 hover:text-error",
        },
      ];
    },
    [deleteRow, navigate, presets, t],
  );

  const handleAddItem = useCallback(
    (openInBackground = false) => {
      if (openInBackground) openTab("/presets/add", false);
      else navigate("/presets/add");
    },
    [navigate, openTab],
  );

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => ({ top: params.isFirstVisible ? 0 : 5, bottom: 5 }), []);

  const rows = useMemo<PresetGridRow[]>(() => presets.map((preset) => ({ ...preset })), [presets]);

  const columns: GridColDef<PresetGridRow>[] = [
    { field: "id", headerName: t("listing-id"), width: 90, filterable: false },
    {
      field: "name",
      headerName: t("listing-name"),
      minWidth: 240,
      renderCell: (params) => (
        <Link
          to={`/presets/${params.row.id}`}
          className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "type",
      headerName: t("listing-type"),
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const value = params.value;
        if (value === "Tensile" || value === "Compression") return <PresetTypeTag type={value} />;
        return value;
      },
    },
    { field: "velocity", headerName: t("listing-velocity"), minWidth: 150, type: "number", align: "left", headerAlign: "left" },
    { field: "method", headerName: t("listing-method"), minWidth: 130, valueFormatter: (value) => (value === "Load" ? t("listing-load") : t("listing-distance")) },
    {
      field: "targets",
      headerName: t("listing-targets"),
      minWidth: 180,
      valueGetter: (_value, row) =>
        (row.targets ?? [])
          .map((target) => `${row.method === "Load" ? target.toFixed(1) : target.toFixed(4)} ${row.method === "Load" ? "N" : "mm"}`)
          .join(", "),
    },
    {
      field: "createdAt",
      headerName: t("listing-created"),
      minWidth: 180,
      valueFormatter: (value) =>
        new Date(Number(value)).toLocaleString(i18n.language, {
          dateStyle: "short",
          timeStyle: "short",
        }),
      filterOperators: getGridDateOperators(false).map((item) => ({
        ...item,
        InputComponent: DataGridDateTimeFilter,
      })),
    },
    {
      field: "updatedAt",
      headerName: t("listing-updated"),
      minWidth: 180,
      valueFormatter: (value) =>
        new Date(Number(value)).toLocaleString(i18n.language, {
          dateStyle: "short",
          timeStyle: "short",
        }),
      filterOperators: getGridDateOperators(false).map((item) => ({
        ...item,
        InputComponent: DataGridDateTimeFilter,
      })),
    },
  ];

  return (
    <>
      {dialog}
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("presets")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("presets")}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container rowSpacing={5} columnSpacing={7} className='w-full'>
          <Grid size={12}>
            {error ? (
              <Box className='flex flex-col items-center gap-4'>
                <Box className='flex flex-col gap-2 items-center'>
                  <Box className='w-10 h-10 border border-dashed border-error flex items-center justify-center rounded-lg'>
                    <OctagonAlert className='text-error' />
                  </Box>
                </Box>
                <Button size='large' variant='outlined' color='grey' startIcon={<Repeat2 />} onClick={() => void loadPresets()}>
                  {t("retry")}
                </Button>
              </Box>
            ) : isLoading ? (
              <Box></Box>
            ) : rows.length === 0 ? (
              <NoPresetsFound />
            ) : (
              <DataGridWithRowActions
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
                  toolbar: { rowSelectionModel, deleteRows, onAddItem: handleAddItem },
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
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
