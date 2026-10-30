import { useCallback, useMemo, useState } from "react";
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { DataGrid, type DataGridProps, type GridColDef, type GridValidRowModel } from "@mui/x-data-grid";
import { Ellipsis } from "lucide-react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

export interface DataGridRowAction {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void | Promise<void>;
  className?: string;
}

interface RowMenuState {
  rowId: string;
  top: number;
  left: number;
  anchorEl?: HTMLElement;
  open: boolean;
}

export interface DataGridWithRowActionsProps<Row extends GridValidRowModel> extends Omit<DataGridProps<Row>, "columns" | "getRowClassName"> {
  columns: GridColDef<Row>[];
  getRowActions: (rowId: string) => DataGridRowAction[];
}

export default function DataGridWithRowActions<Row extends GridValidRowModel>({ columns, getRowActions, ...gridProps }: DataGridWithRowActionsProps<Row>) {
  const [rowMenu, setRowMenu] = useState<RowMenuState | null>(null);
  const activeRowId = rowMenu?.open ? rowMenu.rowId : null;
  const closeRowMenu = useCallback(() => {
    setRowMenu((current) => (current ? { ...current, open: false } : null));
  }, []);

  const handleRowContextMenu = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const row = target.closest<HTMLElement>("[role='row'][data-id]");
    const rowId = row?.dataset.id;
    if (!rowId) return;

    event.preventDefault();
    setRowMenu({ rowId, top: event.clientY, left: event.clientX, open: true });
  }, []);

  const columnsWithActions = useMemo<GridColDef<Row>[]>(
    () => [
      ...columns,
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 80,
        flex: 1,
        align: "right",
        headerAlign: "right",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Button
            aria-label={`Actions for ${String((params.row as { name?: string }).name ?? params.id)}`}
            aria-haspopup='menu'
            aria-expanded={activeRowId === String(params.id)}
            className='icon-only'
            size='small'
            color='grey'
            onClick={(event) => {
              event.stopPropagation();
              if (activeRowId === String(params.id)) {
                closeRowMenu();
                return;
              }
              setRowMenu({ rowId: String(params.id), top: 0, left: 0, anchorEl: event.currentTarget, open: true });
            }}
          >
            <Ellipsis size={16} />
          </Button>
        ),
      },
    ],
    [activeRowId, closeRowMenu, columns],
  );

  return (
    <>
      <Box onContextMenu={handleRowContextMenu}>
        <DataGrid
          {...gridProps}
          columns={columnsWithActions}
          getRowClassName={(params) => (String(params.id) === activeRowId ? "outline-primary-light/40 outline-2" : "")}
        />
      </Box>
      <Menu
        open={Boolean(rowMenu?.open)}
        onClose={closeRowMenu}
        anchorReference={rowMenu?.anchorEl ? "anchorEl" : "anchorPosition"}
        anchorEl={rowMenu?.anchorEl}
        anchorPosition={rowMenu && !rowMenu.anchorEl ? { top: rowMenu.top, left: rowMenu.left } : undefined}
        anchorOrigin={rowMenu?.anchorEl ? { vertical: "bottom", horizontal: "right" } : { vertical: "top", horizontal: "left" }}
        transformOrigin={rowMenu?.anchorEl ? { vertical: "top", horizontal: "right" } : { vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: { className: "outlined" },
          transition: {
            onExited: () => {
              setRowMenu((current) => (current && !current.open ? null : current));
            },
          },
        }}
      >
        {rowMenu &&
          getRowActions(rowMenu.rowId).map((action) => (
            <MenuItem
              key={action.key}
              className={action.className}
              onClick={() => {
                closeRowMenu();
                void action.onClick();
              }}
            >
              <ListItemIcon>{action.icon}</ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}
