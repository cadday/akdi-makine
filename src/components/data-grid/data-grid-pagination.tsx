import { PaginationItem, TablePagination, TablePaginationProps } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import {
  gridPageCountSelector,
  gridPaginationModelSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";


import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      variant="text"
      size="small"
      className={className}
      count={pageCount as number}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as never, newPage - 1);
      }}
      renderItem={(item) => (
        <PaginationItem
          slots={{
            previous: () => {
              return <ChevronLeft size={16} />;
            },
            next: () => {
              return <ChevronRight size={16} />;
            },
          }}
          {...item}
        />
      )}
    />
  );
}

export default function DataGridPagination(props: any) {
  return (
    <TablePagination
      {...props}
      component="div"
      ActionsComponent={Pagination}
      slotProps={{
        displayedRows: { className: "hidden!" },
        spacer: { className: "flex-none" },
        toolbar: { className: "px-0 flex justify-end" },
        selectLabel: {
          className: "hidden!",
        },
        select: {
          IconComponent: () => {
            return (
              <ChevronDown size={16} className="pointer-events-none absolute inset-e-1"></ChevronDown>
            );
          },
          className: "hidden!",
        },
      }}
    />
  );
}

function PaginationFullPage({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      variant="text"
      size="medium"
      className={className}
      count={pageCount as number}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as never, newPage - 1);
      }}
      renderItem={(item) => (
        <PaginationItem
          slots={{
            previous: () => {
              return <ChevronLeft size={16} />;
            },
            next: () => {
              return <ChevronRight size={16} />;
            },
          }}
          {...item}
        />
      )}
    />
  );
}

export function DataGridPaginationFullPage(props: any) {
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  return (
    <TablePagination
      {...props}
      component="div"
      ActionsComponent={(props) => {
        return <PaginationFullPage {...props} className={cn("surface-standard")} />;
      }}
      rowsPerPage={paginationModel.pageSize}
      labelRowsPerPage="Rows"
      rowsPerPageOptions={[10, 20, 50, 100]}
      page={paginationModel.page}
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count === -1 ? `more than ${to}` : count}`}
      onRowsPerPageChange={(event) => {
        const newSize = parseInt(event.target.value, 10);
        apiRef.current.setPageSize(newSize);
      }}
      slotProps={{
        spacer: { className: "flex-none" },
        toolbar: { className: "px-0 flex" },
        select: {
          IconComponent: () => {
            return (
              <ChevronDown size={16} className="pointer-events-none absolute inset-e-1"></ChevronDown>
            );
          },
        },
      }}
    />
  );
}
