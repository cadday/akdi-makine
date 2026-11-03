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
import { DataFieldDefinition, useDb } from "@/context/db-context";
import type { DataFieldContainer } from "@/context/db-context";
import { Filter } from "lucide-react";
import Search from "@/components/layout/search/search";
import DataGridDateTimeFilter from "@/components/data-grid/data-grid-date-time-filter";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";
import { NoDataFieldsFound } from "../components/no-entity-found";

type DataFieldGridRow = DataFieldDefinition;

export default function Page() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { getDataFields, deleteDataField, deleteDataFields } = useDb();
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [dataFields, setDataFields] = useState<DataFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDataFields = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getDataFields();
      setDataFields(data);
    } catch (_err) {
      const message = t("listing-load-data-fields-error", { error: String(_err) });
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getDataFields, showError, t]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getDataFields();
        if (!cancelled) {
          setDataFields(data);
        }
      } catch (_err) {
        if (!cancelled) {
          const message = t("listing-load-data-fields-error", { error: String(_err) });
          setError(message);
          showError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [getDataFields, showError, t]);

  const deleteRows = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;

      return requestDelete({
        title: t(ids.length === 1 ? "listing-delete-data-field-title" : "listing-delete-data-fields-title"),
        message: ids.length === 1 ? t("listing-delete-data-field-confirm") : t("listing-delete-data-fields-confirm", { count: ids.length }),
        errorMessage: (error) => t("listing-delete-data-field-error", { error: String(error) }),
        onConfirm: async () => {
          if (ids.length === 1) {
            await deleteDataField(ids[0]);
          } else {
            await deleteDataFields(ids);
          }

          setDataFields((current) => current.filter((item) => !ids.includes(item.id)));
          setRowSelectionModel({ type: "include", ids: new Set() });
        },
      });
    },
    [deleteDataField, deleteDataFields, requestDelete, t],
  );

  const deleteRow = useCallback(
    (id: string) => async () => {
      await deleteRows([id]);
    },
    [deleteRows],
  );

  const getRowActions = useCallback(
    (id: string): DataGridRowAction[] => {
      const dataField = dataFields.find((item) => item.id === id);
      if (!dataField) return [];

      return [
        { key: "view", icon: <Send size={16} />, label: t("view"), onClick: () => navigate(`/data-fields/${id}`) },
        {
          key: "duplicate",
          icon: <Copy size={16} />,
          label: t("duplicate"),
          onClick: () => navigate("/data-fields/add", { state: { initialDataField: { ...dataField, name: `${dataField.name} (Copy)` } } }),
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
    [dataFields, deleteRow, navigate, t],
  );

  const handleAddItem = useCallback(() => {
    navigate("/data-fields/add");
  }, [navigate]);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 5,
      bottom: 5,
    };
  }, []);

  const rows = useMemo<DataFieldGridRow[]>(() => {
    return dataFields.map((dataField) => ({ ...dataField }));
  }, [dataFields]);

  const columns: GridColDef<DataFieldGridRow>[] = [
    { field: "id", headerName: t("listing-id"), width: 90, filterable: false },
    {
      field: "name",
      headerName: t("listing-name"),
      minWidth: 260,
      renderCell: (params: GridRenderCellParams<DataFieldGridRow, string>) => (
        <Link
          to={`/data-fields/${params.row.id}`}
          className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "container",
      headerName: t("listing-container"),
      minWidth: 140,
      type: "singleSelect",
      valueOptions: (["Specimen", "Test"] satisfies DataFieldContainer[]).map((value) => ({ value, label: t(value === "Specimen" ? "specimen" : "test") })),
      valueFormatter: (value: DataFieldContainer) => t(value === "Specimen" ? "specimen" : "test"),
    },
    {
      field: "type",
      headerName: t("listing-type"),
      minWidth: 140,
      type: "singleSelect",
      valueOptions: (["Text", "Textarea", "Number", "Select", "Image", "Boolean"] as const).map((value) => ({
        value,
        label: t(`listing-data-field-${value.toLowerCase()}`),
      })),
      valueFormatter: (value: DataFieldDefinition["type"]) => t(`listing-data-field-${value.toLowerCase()}`),
    },
    {
      field: "unit",
      headerName: t("listing-unit"),
      minWidth: 120,
    },
    {
      field: "mandatory",
      headerName: t("listing-mandatory"),
      minWidth: 120,
      align: "left",
      headerAlign: "left",
      type: "boolean",
      renderCell: (params) => (params.value ? t("listing-true") : t("listing-false")),
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
              {t("data-fields")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("data-fields")}</Typography>
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
                <Button size='large' variant='outlined' color='grey' startIcon={<Repeat2 />} onClick={() => void loadDataFields()}>
                  {t("retry")}
                </Button>
              </Box>
            ) : isLoading ? (
              <Box></Box>
            ) : rows.length === 0 ? (
              <NoDataFieldsFound />
            ) : (
              <DataGridWithRowActions
                autoHeight
                rows={rows}
                columns={columns}
                loading={isLoading}
                initialState={{
                  columns: { columnVisibilityModel: { id: false, createdAt: false } },
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
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
                onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) => {
                  setRowSelectionModel(rowSelectionModel);
                }}
                hideFooterSelectedRowCount
                showToolbar
                slotProps={{
                  panel: {
                    className: "mt-1!",
                  },
                  toolbar: {
                    rowSelectionModel,
                    deleteRows,
                    onAddItem: handleAddItem,
                  },
                }}
                classes={{
                  main: "overflow-visible",
                }}
                slots={{
                  basePagination: DataGridPaginationFullPage,
                  columnSortedDescendingIcon: () => {
                    return <ArrowDown size={16}></ArrowDown>;
                  },
                  columnSortedAscendingIcon: () => {
                    return <ArrowUp size={16}></ArrowUp>;
                  },
                  columnFilteredIcon: () => {
                    return <Filter size={18}></Filter>;
                  },
                  columnReorderIcon: () => {
                    return <ChevronLeft></ChevronLeft>;
                  },
                  columnMenuIcon: () => {
                    return <EllipsisVertical size={16}></EllipsisVertical>;
                  },
                  columnMenuSortAscendingIcon: ArrowUp,
                  columnMenuSortDescendingIcon: ArrowDown,
                  columnMenuFilterIcon: Filter,
                  columnMenuHideIcon: EyeClosed,
                  columnMenuClearIcon: X,
                  columnMenuManageColumnsIcon: Columns,
                  filterPanelDeleteIcon: X,
                  filterPanelRemoveAllIcon: Trash,
                  baseSelect: (props: any) => {
                    return (
                      <FormControl size='small' variant='outlined'>
                        <InputLabel>{props.label}</InputLabel>
                        <Select {...props} IconComponent={ChevronDown} MenuProps={{ className: "outlined" }} />
                      </FormControl>
                    );
                  },
                  quickFilterIcon: () => {
                    return <Search />;
                  },
                  quickFilterClearIcon: () => {
                    return <X />;
                  },
                  baseButton: (props) => {
                    return <Button {...props} variant='pastel' color='grey'></Button>;
                  },
                  moreActionsIcon: () => {
                    return <Ellipsis size={16} />;
                  },
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
