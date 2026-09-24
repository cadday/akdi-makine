import { Link, useNavigate } from "react-router";

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
  Pen,
  Plus,
  Repeat2,
  Send,
  Trash,
  X,
  XSquare,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Breadcrumbs, Button, FormControl, Grid, InputLabel, Select, Typography } from "@mui/material";
import {
  DataGrid,
  getGridDateOperators,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridRowSpacingParams,
} from "@mui/x-data-grid";
import { Filter } from "lucide-react";
import Search from "@/components/layout/search/search";
import DataGridDateTimeFilter from "@/components/data-grid/data-grid-date-time-filter";
import { StoredImagePreviews } from "@/components/data-fields/image-data-field-input";
import { DataFieldDefinition, SpecimenRecord, useDb, UploadedImage } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";

type SpecimenGridRow = SpecimenRecord;

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { getSpecimens, getDataFields, deleteSpecimen, deleteSpecimens, duplicateSpecimens, duplicateSpecimen } = useDb();
  const { showError } = useAppNotifications();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [specimens, setSpecimens] = useState<SpecimenRecord[]>([]);
  const [dataFields, setDataFields] = useState<DataFieldDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSpecimens = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [specimenData, fieldData] = await Promise.all([getSpecimens(), getDataFields("Specimen")]);
      setSpecimens(specimenData);
      setDataFields(fieldData);
    } catch (_err) {
      const message = "Failed to load specimens and data fields: " + _err;
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getSpecimens, getDataFields, showError]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [specimenData, fieldData] = await Promise.all([getSpecimens(), getDataFields("Specimen")]);
        if (!cancelled) {
          setSpecimens(specimenData);
          setDataFields(fieldData);
        }
      } catch (_err) {
        if (!cancelled) {
          const message = "Failed to load specimens and data fields: " + _err;
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
  }, [getSpecimens, getDataFields, showError]);

  const duplicateRows = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      try {
        const duplicated = ids.length === 1 ? [await duplicateSpecimen(ids[0])] : await duplicateSpecimens(ids);
        const newSpecimens = duplicated.filter((item): item is SpecimenRecord => Boolean(item));

        setSpecimens((current) => [...newSpecimens, ...current]);
        setRowSelectionModel({ type: "include", ids: new Set() });
      } catch (err) {
        showError("Failed to duplicate specimen(s): " + err);
      }
    },
    [duplicateSpecimens, duplicateSpecimen, showError],
  );

  const duplicateRow = useCallback(
    (id: string) => async () => {
      await duplicateRows([id]);
    },
    [duplicateRows],
  );

  const deleteRows = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;

      return requestDelete({
        title: ids.length === 1 ? "Delete Specimen" : "Delete Specimens",
        message: ids.length === 1 ? "Delete this specimen? This action cannot be undone." : `Delete ${ids.length} specimens? This action cannot be undone.`,
        errorMessage: "Failed to delete specimen(s):",
        onConfirm: async () => {
          if (ids.length === 1) {
            await deleteSpecimen(ids[0]);
          } else {
            await deleteSpecimens(ids);
          }

          setSpecimens((current) => current.filter((item) => !ids.includes(item.id)));
          setRowSelectionModel({ type: "include", ids: new Set() });
        },
      });
    },
    [deleteSpecimen, deleteSpecimens, requestDelete],
  );

  const deleteRow = useCallback(
    (id: string) => async () => {
      await deleteRows([id]);
    },
    [deleteRows],
  );

  const handleAddItem = useCallback(() => {
    navigate("/specimens/add");
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

  const rows = useMemo<SpecimenGridRow[]>(() => {
    return specimens.map((specimen) => ({ ...specimen }));
  }, [specimens]);

  const columns = useMemo<GridColDef<SpecimenGridRow>[]>(
    () => [
      { field: "id", headerName: "ID", width: 90, filterable: false },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<SpecimenGridRow, string>) => (
          <Link
            to={`/specimens/${params.row.id}`}
            className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'
          >
            {params.value}
          </Link>
        ),
      },
      ...dataFields.map(
        (dataField): GridColDef<SpecimenGridRow> => ({
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
          valueGetter: (_value: unknown, row: SpecimenGridRow) => row.customData?.[dataField.id] ?? row.customData?.[dataField.name],
          renderCell: (params: GridRenderCellParams<SpecimenGridRow>) => {
            const value = params.value;
            if (value == null) return "-";
            if (dataField.type === "Image" && Array.isArray(value)) {
              return <StoredImagePreviews images={value as UploadedImage[]} />;
            }
            if (typeof value === "boolean") return value ? "Yes" : "No";
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
        minWidth: 160,
        valueFormatter: (value) =>
          new Date(Number(value)).toLocaleString("tr-TR", {
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
        headerName: "Updated",
        minWidth: 160,
        valueFormatter: (value) =>
          new Date(Number(value)).toLocaleString("tr-TR", {
            dateStyle: "short",
            timeStyle: "short",
          }),
        filterOperators: getGridDateOperators(false).map((item) => ({
          ...item,
          InputComponent: DataGridDateTimeFilter,
        })),
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
          <GridActionsCellItem key='view' icon={<Send size={16} />} label='View' onClick={() => navigate(`/specimens/${params.id}`)} showInMenu />,
          <GridActionsCellItem key='edit' icon={<Pen size={16} />} label='Edit' onClick={() => navigate(`/specimens/${params.id}/edit`)} showInMenu />,
          <GridActionsCellItem key={0} icon={<Copy size={16} />} label='Duplicate' onClick={duplicateRow(params.id as string)} showInMenu />,
          <GridActionsCellItem
            className='hover:bg-error-light/10 hover:text-error'
            key={1}
            icon={<XSquare size={16} />}
            label='Delete'
            onClick={deleteRow(params.id as string)}
            showInMenu
          />,
        ],
      },
    ],
    [dataFields, deleteRow, duplicateRow],
  );

  return (
    <>
      {dialog}
      <TitleWrapper>
        <Grid size={12} container spacing={2.5}>
          <Grid size={{ xs: 12, md: "grow" }}>
            <Typography variant='h1' component='h1' className='mb-0'>
              {t("menu-specimens")}
            </Typography>
            <Breadcrumbs>
              <Link color='inherit' to={LINKS.home}>
                {t("menu-home")}
              </Link>
              <Typography variant='body2'>{t("menu-specimens")}</Typography>
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
                <Button size='large' variant='outlined' color='grey' startIcon={<Repeat2 />} onClick={() => void loadSpecimens()}>
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
                    duplicateRows,
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
              />
            )}
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
