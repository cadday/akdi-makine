import { Link } from "react-router";

import { DataGridPaginationFullPage } from "@/components/data-grid/data-grid-pagination";
import { DataGridListingToolbar } from "@/components/data-grid/data-grid-listing-toolbar";
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
  File,
  OctagonAlert,
  Plus,
  Repeat2,
  Trash,
  X,
  XSquare,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Breadcrumbs, Button, FormControl, Grid, InputLabel, Select, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowSelectionModel, GridRowSpacingParams } from "@mui/x-data-grid";
import { PresetRecord, useDb } from "@/context/db-context";
import { Filter } from "lucide-react";
import Search from "@/components/layout/search/search";

type PresetGridRow = PresetRecord;

export default function Page() {
  const { t } = useTranslation();
  const { getPresets, deletePreset, deletePresets, duplicatePresets, duplicatePreset } = useDb();
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
      setError("Failed to load presets: " + err);
    } finally {
      setIsLoading(false);
    }
  }, [getPresets]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getPresets();
        if (!cancelled) setPresets(data);
      } catch (err) {
        if (!cancelled) setError("Failed to load presets: " + err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [getPresets]);

  const duplicateRows = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      try {
        const duplicated = ids.length === 1 ? [await duplicatePreset(ids[0])] : await duplicatePresets(ids);
        const newPresets = duplicated.filter((item): item is PresetRecord => Boolean(item));
        setPresets((current) => [...newPresets, ...current]);
        setRowSelectionModel({ type: "include", ids: new Set() });
      } catch (err) {
        setError("Failed to duplicate preset(s): " + err);
      }
    },
    [duplicatePresets, duplicatePreset],
  );

  const duplicateRow = useCallback((id: string) => async () => duplicateRows([id]), [duplicateRows]);

  const deleteRows = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      try {
        if (ids.length === 1) await deletePreset(ids[0]);
        else await deletePresets(ids);

        setPresets((current) => current.filter((preset) => !ids.includes(preset.id)));
        setRowSelectionModel({ type: "include", ids: new Set() });
      } catch (err) {
        setError("Failed to delete preset(s): " + err);
      }
    },
    [deletePreset, deletePresets],
  );

  const deleteRow = useCallback((id: string) => async () => deleteRows([id]), [deleteRows]);

  const handleAddItem = useCallback(() => {
    return;
  }, []);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => ({ top: params.isFirstVisible ? 0 : 5, bottom: 5 }), []);

  const rows = useMemo<PresetGridRow[]>(() => presets.map((preset) => ({ ...preset })), [presets]);

  const columns: GridColDef<PresetGridRow>[] = [
    { field: "id", headerName: "ID", width: 90, filterable: false },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <Link to='#' className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'>
          {params.value}
        </Link>
      ),
    },
    { field: "type", headerName: "Type", minWidth: 150 },
    { field: "preload", headerName: "Preload", minWidth: 130, type: "number" },
    { field: "load", headerName: "Load", minWidth: 130, type: "number" },
    { field: "speed", headerName: "Speed", minWidth: 130, type: "number" },
    {
      field: "createdAt",
      headerName: "Created",
      minWidth: 180,
      valueFormatter: (value) =>
        new Date(Number(value)).toLocaleString("en-GB", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      field: "updatedAt",
      headerName: "Updated",
      minWidth: 180,
      valueFormatter: (value) => new Date(Number(value)).toLocaleString(),
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
        <GridActionsCellItem key={0} icon={<Copy size={16} />} label='Duplicate' onClick={duplicateRow(String(params.id))} showInMenu />,
        <GridActionsCellItem
          className='hover:bg-error-light/10 hover:text-error'
          key={1}
          icon={<XSquare size={16} />}
          label='Delete'
          onClick={deleteRow(String(params.id))}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <>
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("menu-presets")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("menu-presets")}</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid size={{ xs: 12, md: "auto" }}>
            <Button size='large' className='icon-only surface-standard' color='grey' variant='surface'>
              <Ellipsis size={16} />
            </Button>
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
                  <Typography>{error}</Typography>
                </Box>
                <Button size='large' variant='outlined' color='grey' startIcon={<Repeat2 />} onClick={() => void loadPresets()}>
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
                <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} onClick={handleAddItem}>
                  Add
                </Button>
              </Box>
            ) : (
              <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                loading={isLoading}
                initialState={{
                  columns: { columnVisibilityModel: { id: false, updatedAt: false } },
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
                  toolbar: { rowSelectionModel, deleteRows, duplicateRows, onAddItem: handleAddItem },
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
