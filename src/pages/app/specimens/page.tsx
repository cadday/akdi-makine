import { Link } from "react-router";

import ContentWrapper from "@/components/layout/containers/content-wrapper";
import TitleWrapper from "@/components/layout/containers/title-wrapper";
import { LINKS } from "@/constants";
import { useTranslation } from "react-i18next";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns,
  Copy,
  Download,
  Ellipsis,
  EllipsisVertical,
  EyeClosed,
  FileText,
  Filter,
  Plus,
  Printer,
  Search,
  Shield,
  Trash,
  X,
  XSquare,
} from "lucide-react";
import { SyntheticEvent, useCallback, useState } from "react";
import DataGridInput from "@/components/data-grid/data-grid-input";
import { DataGridPaginationFullPage } from "@/components/data-grid/data-grid-pagination";
import { cn } from "@/lib/utils";

import {
  Badge,
  Box,
  Breadcrumbs,
  Button,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PopoverVirtualElement,
  Select,
  SelectProps,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ColumnsPanelTrigger,
  DataGrid,
  ExportCsv,
  ExportPrint,
  FilterPanelTrigger,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowId,
  GridRowSelectionModel,
  GridRowSpacingParams,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
} from "@mui/x-data-grid";
import { TextFieldProps } from "@mui/x-data-grid/internals";

export default function Page() {
  const { t } = useTranslation();

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

  const [rows, setRows] = useState<Row[]>(initialRows);

  const deleteUser = useCallback(
    (id: GridRowId) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    [],
  );

  const toggleAdmin = useCallback(
    (id: GridRowId) => () => {
      setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, isAdmin: !row.isAdmin } : row)));
    },
    [],
  );

  const duplicateUser = useCallback(
    (id: GridRowId) => () => {
      setRows((prevRows) => {
        const rowToDuplicate = prevRows.find((row) => row.id === id)!;
        return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      });
    },
    [],
  );

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90, filterable: false },
    {
      field: "image",
      headerName: "Image",
      width: 80,
      editable: true,
      filterable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Box className='flex h-full items-center' component={Link} to='#'>
          <img src={params.value as string} alt='grid image' className='h-9 w-9 rounded-sm object-cover' />
        </Box>
      ),
    },
    {
      field: "fullName",
      headerName: "Full Name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 240,
      valueGetter: (_value, row) => `${row.first || ""} ${row.last || ""}`,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Link to='#' className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'>
          {params.value}
        </Link>
      ),
    },
    {
      field: "first",
      headerName: "First Name",
      width: 200,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => <DataGridInput {...params} />,
    },
    {
      field: "last",
      headerName: "Last Name",
      width: 200,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => <DataGridInput {...params} />,
    },
    {
      field: "age",
      headerName: "Age",
      width: 160,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => <DataGridInput {...params} />,
    },

    {
      field: "isAdmin",
      headerName: "Admin",
      align: "left",
      headerAlign: "left",
      type: "boolean",
      width: 120,
      editable: true,
      renderCell: (params: GridRenderCellParams<any, boolean>) => {
        const value = params.value;
        if (typeof value !== "undefined") {
          return value ? <Check className='text-success' /> : <X className='text-error' />;
        } else {
          return <Box></Box>;
        }
      },
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
        <GridActionsCellItem key={1} icon={<Shield />} label='Toggle Admin' onClick={toggleAdmin(params.id)} showInMenu />,
        <GridActionsCellItem key={2} icon={<Copy />} label='Duplicate' onClick={duplicateUser(params.id)} showInMenu />,
        <GridActionsCellItem key={0} icon={<XSquare />} label='Delete' onClick={deleteUser(params.id)} showInMenu />,
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
            <Button className='icon-only surface-standard' color='grey' variant='surface'>
              <Ellipsis size={16} />
            </Button>
          </Grid>
        </Grid>
      </TitleWrapper>

      <ContentWrapper>
        <Grid size={12} container spacing={5} className='w-full'>
          <Grid size={12}>
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
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
                toolbar: { rowSelectionModel },
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
                baseSelect: (props) => {
                  const propsCasted = props as unknown as SelectProps;
                  return (
                    <FormControl size='small' variant='filled' className='filled-outlined'>
                      <InputLabel>{props.label}</InputLabel>
                      <Select {...propsCasted} IconComponent={ChevronDown} MenuProps={{ className: "filled-outlined " }} />
                    </FormControl>
                  );
                },
                baseTextField: (props) => {
                  const propsCasted = props as TextFieldProps;
                  return <TextField {...propsCasted} variant='filled' size='small' className='filled-outlined' />;
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
                toolbar: CustomToolbar,
              }}
            />
          </Grid>
        </Grid>
      </ContentWrapper>
    </>
  );
}

const initialRows = [
  { id: 1, image: "/images/avatars/avatar-1.jpg", first: "Emily", last: "Johnson", age: 14, isAdmin: true },
  { id: 2, image: "/images/avatars/avatar-2.jpg", first: "Nathan", last: "Patel", age: 31, isAdmin: true },
  { id: 3, image: "/images/avatars/avatar-3.jpg", first: "Sophia", last: "Garcia", age: 31, isAdmin: true },
  { id: 4, image: "/images/avatars/avatar-4.jpg", first: "Jack", last: "Müller", age: 11, isAdmin: false },
  { id: 5, image: "/images/avatars/avatar-5.jpg", first: "Chloe", last: "Nakamura", age: 28, isAdmin: false },
  { id: 6, image: "/images/avatars/avatar-6.jpg", first: "Ethan", last: "Smith", age: 48, isAdmin: true },
  { id: 7, image: "/images/avatars/avatar-7.jpg", first: "Mia", last: "Dupont", age: 44, isAdmin: true },
  { id: 8, image: "/images/avatars/avatar-8.jpg", first: "Oliver", last: "Silva", age: 31, isAdmin: true },
  { id: 9, image: "/images/avatars/avatar-1.jpg", first: "Isabella", last: "Kim", age: 64, isAdmin: true },
  { id: 10, image: "/images/avatars/avatar-2.jpg", first: "Liam", last: "Brown", age: 45, isAdmin: false },
  { id: 11, image: "/images/avatars/avatar-3.jpg", first: "Lotte", last: "Schmidt", age: 23, isAdmin: true },
  { id: 12, image: "/images/avatars/avatar-4.jpg", first: "Aiden", last: "Lopez", age: 27, isAdmin: false },
  { id: 13, image: "/images/avatars/avatar-5.jpg", first: "Amelia", last: "Nguyen", age: 43, isAdmin: false },
  { id: 14, image: "/images/avatars/avatar-6.jpg", first: "Noah", last: "Evans", age: 25, isAdmin: true },
  { id: 15, image: "/images/avatars/avatar-7.jpg", first: "Zoe", last: "Jack", age: 32, isAdmin: false },
  { id: 16, image: "/images/avatars/avatar-8.jpg", first: "Henry", last: "King", age: 31, isAdmin: true },
  { id: 17, image: "/images/avatars/avatar-1.jpg", first: "Alexander", last: "Bennett", age: 64, isAdmin: true },
  { id: 18, image: "/images/avatars/avatar-2.jpg", first: "Grace", last: "Carter", age: 45, isAdmin: false },
  { id: 19, image: "/images/avatars/avatar-3.jpg", first: "Benjamin", last: "Davidson", age: 23, isAdmin: true },
  { id: 20, image: "/images/avatars/avatar-4.jpg", first: "Olivia", last: "Edwards", age: 27, isAdmin: false },
  { id: 21, image: "/images/avatars/avatar-5.jpg", first: "Lily", last: "Foster", age: 43, isAdmin: false },
  { id: 22, image: "/images/avatars/avatar-6.jpg", first: "Ava", last: "Green", age: 25, isAdmin: true },
  { id: 23, image: "/images/avatars/avatar-7.jpg", first: "Lucas", last: "Harrison", age: 32, isAdmin: false },
  { id: 24, image: "/images/avatars/avatar-8.jpg", first: "William", last: "Owens", age: 31, isAdmin: true },
  { id: 25, image: "/images/avatars/avatar-1.jpg", first: "Levi", last: "Jefferson", age: 28, isAdmin: true },
  { id: 26, image: "/images/avatars/avatar-2.jpg", first: "Violet", last: "Kennedy", age: 22, isAdmin: true },
  { id: 27, image: "/images/avatars/avatar-3.jpg", first: "Aaron", last: "Larson", age: 26, isAdmin: true },
  { id: 28, image: "/images/avatars/avatar-4.jpg", first: "Madeline", last: "Morris", age: 32, isAdmin: false },
  { id: 29, image: "/images/avatars/avatar-5.jpg", first: "Eleanor", last: "Palmer", age: 34, isAdmin: false },
  { id: 30, image: "/images/avatars/avatar-6.jpg", first: "Felix", last: "West", age: 19, isAdmin: true },
];

type Row = (typeof initialRows)[number];

const CustomToolbar = ({ rowSelectionModel }: { rowSelectionModel: GridRowSelectionModel }) => {
  const [anchorElExport, setAnchorElExport] = useState<EventTarget | Element | PopoverVirtualElement | null>(null);
  const openExport = Boolean(anchorElExport);
  const handleClickExport = (event: Event | SyntheticEvent) => {
    setAnchorElExport(event.currentTarget);
  };
  const handleCloseExport = () => {
    setAnchorElExport(null);
  };

  const [anchorElSelection, setAnchorElSelection] = useState<EventTarget | Element | PopoverVirtualElement | null>(null);
  const openSelection = Boolean(anchorElSelection);
  const handleClickSelection = (event: Event | SyntheticEvent) => {
    setAnchorElSelection(event.currentTarget);
  };
  const handleCloseSelection = () => {
    setAnchorElSelection(null);
  };

  return (
    <Toolbar className='min-h-auto border-none'>
      <Grid container className='mb-2 w-full mt-0.25' spacing={1}>
        <Grid className='w-full' size={{ xs: 12, md: "grow" }}>
          <QuickFilter
            render={() => (
              <QuickFilterControl
                render={({ ref, ...controlProps }, state) => (
                  <TextField
                    {...controlProps}
                    inputRef={ref}
                    variant='standard'
                    className='surface-standard w-full'
                    placeholder='Search'
                    size='medium'
                    slotProps={{
                      input: {
                        endAdornment: (
                          <>
                            <InputAdornment position='end' className={cn(state.value === "" && "hidden")}>
                              <QuickFilterClear>
                                <X className='text-text-disabled' />
                              </QuickFilterClear>
                            </InputAdornment>
                            <InputAdornment position='end' className={cn(state.value !== "" && "hidden")}>
                              <IconButton>{<Search className='text-text-disabled' />}</IconButton>
                            </InputAdornment>
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: "auto" }} className='flex flex-row items-start gap-1'>
          {rowSelectionModel.ids.size > 0 && (
            <>
              <Tooltip title='Selection'>
                <Button
                  className='surface-standard'
                  size='large'
                  color='text-primary'
                  variant='surface'
                  onClick={handleClickSelection}
                  endIcon={<ChevronRight size={16} className={cn("transition-transform rtl:rotate-180", openSelection && "rotate-90 rtl:rotate-90")} />}
                >
                  {rowSelectionModel.ids.size > 1 ? rowSelectionModel.ids.size + " Items" : rowSelectionModel.ids.size + " Item"}
                </Button>
              </Tooltip>

              <Menu
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                anchorEl={anchorElSelection as Element}
                open={openSelection}
                onClose={handleCloseSelection}
                className='mt-1'
              >
                <MenuItem
                  onClick={() => {
                    handleCloseSelection();
                  }}
                >
                  <ListItemIcon>
                    <Shield />
                  </ListItemIcon>
                  <ListItemText>Toggle Admin</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseSelection();
                  }}
                >
                  <ListItemIcon>
                    <Copy />
                  </ListItemIcon>
                  <ListItemText>Duplicate</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseSelection();
                  }}
                >
                  <ListItemIcon>
                    <XSquare />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}

          <Tooltip title='Columns'>
            <ColumnsPanelTrigger
              render={(props) => (
                <Button size='large' {...props} className='icon-only surface-standard flex-none' variant='surface' color='text-primary'>
                  <Columns />
                </Button>
              )}
            />
          </Tooltip>

          <Tooltip title='Filters'>
            <FilterPanelTrigger
              render={(props, state) => (
                <Button size='large' {...props} className='icon-only surface-standard flex-none' variant='surface' color='text-primary'>
                  <Badge badgeContent={state.filterCount} color='primary' variant='dot'>
                    <Filter size={18} />
                  </Badge>
                </Button>
              )}
            />
          </Tooltip>

          <Tooltip title='Export'>
            <Button
              className='icon-only surface-standard flex-none'
              color='text-primary'
              variant='surface'
              size='large'
              startIcon={<Download />}
              onClick={handleClickExport}
            />
          </Tooltip>

          <Menu
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            anchorEl={anchorElExport as Element}
            open={openExport}
            onClose={handleCloseExport}
            className='mt-1'
          >
            <ExportPrint
              render={
                <MenuItem>
                  <ListItemIcon>
                    <Printer />
                  </ListItemIcon>
                  <ListItemText>Print</ListItemText>
                </MenuItem>
              }
              onClick={handleCloseExport}
            />
            <ExportCsv
              render={
                <MenuItem>
                  <ListItemIcon>
                    <FileText />
                  </ListItemIcon>
                  <ListItemText>Export CSV</ListItemText>
                </MenuItem>
              }
              onClick={handleCloseExport}
            />
          </Menu>

          <Button size='large' className='surface-standard' color='text-primary' variant='surface' startIcon={<Plus />}>
            Add Item
          </Button>
        </Grid>
      </Grid>
    </Toolbar>
  );
};
