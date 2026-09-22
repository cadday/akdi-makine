import { Link } from "react-router";

import { DataGridPaginationFullPage } from "@/components/data-grid/data-grid-pagination";
import { ListingToolbar } from "@/components/data-grid/listing-toolbar";
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
  Shield,
  Trash,
  X,
  XSquare,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Breadcrumbs, Button, FormControl, Grid, InputLabel, Select, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridRowSpacingParams } from "@mui/x-data-grid";
import { SpecimenRecord, useDb } from "@/context/db-context";
import { Filter } from "lucide-react";
import Search from "@/components/layout/search/search";

type SpecimenGridRow = SpecimenRecord;

export default function Page() {
  const { t } = useTranslation();

  const { getSpecimens, deleteSpecimen, deleteSpecimens } = useDb();
  const [specimens, setSpecimens] = useState<SpecimenRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSpecimens = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getSpecimens();
      setSpecimens(data);
    } catch (_err) {
      setError("Failed to load specimens: " + _err);
    } finally {
      setIsLoading(false);
    }
  }, [getSpecimens]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getSpecimens();
        if (!cancelled) {
          setSpecimens(data);
        }
      } catch (_err) {
        if (!cancelled) {
          setError("Failed to load specimens: " + _err);
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
  }, [getSpecimens]);

  const deleteRows = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      try {
        if (ids.length === 1) {
          await deleteSpecimen(ids[0]);
        } else {
          await deleteSpecimens(ids);
        }

        setSpecimens((current) => current.filter((item) => !ids.includes(item.id)));
        setRowSelectionModel({ type: "include", ids: new Set() });
      } catch (err) {
        setError("Failed to delete specimen(s): " + err);
      }
    },
    [deleteSpecimen, deleteSpecimens],
  );

  const deleteRow = useCallback(
    (id: string) => async () => {
      await deleteRows([id]);
    },
    [deleteRows],
  );

  const handleAddItem = useCallback(() => {
    return;
  }, []);

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

  const columns: GridColDef<SpecimenGridRow>[] = [
    { field: "id", headerName: "ID", width: 90, filterable: false },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 260,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Link to='#' className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'>
          {params.value}
        </Link>
      ),
    },
    {
      field: "customData",
      headerName: "Data Fields",
      minWidth: 180,
      valueGetter: (_value, row) => Object.keys(row.customData ?? {}).length,
    },
    {
      field: "createdAt",
      headerName: "Created",
      minWidth: 180,
      valueFormatter: (value) => new Date(Number(value)).toLocaleString(),
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
        // <GridActionsCellItem key={1} icon={<Shield />} label='Toggle Admin' onClick={toggleAdmin(params.id)} showInMenu />,
        // <GridActionsCellItem key={2} icon={<Copy />} label='Duplicate' onClick={duplicateUser(params.id)} showInMenu />,
        // <GridActionsCellItem key={0} icon={<XSquare />} label='Delete' onClick={deleteUser(params.id)} showInMenu />,
        <GridActionsCellItem key={1} icon={<Shield />} label='Toggle Admin' onClick={() => {}} showInMenu />,
        <GridActionsCellItem key={2} icon={<Copy />} label='Duplicate' onClick={() => {}} showInMenu />,
        <GridActionsCellItem key={0} icon={<XSquare />} label='Delete' onClick={deleteRow(params.id as string)} showInMenu />,
      ],
    },
  ];

  return (
    <>
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
          <Grid size={{ xs: 12, md: "auto" }}>
            <Button size="large" className='icon-only surface-standard' color='grey' variant='surface'>
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
                <Button size='large' variant='outlined' color='grey' startIcon={<Plus />}>
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
                  columns: { columnVisibilityModel: { id: false } },
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
                  toolbar: ListingToolbar,
                }}
              />
            )}
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}
