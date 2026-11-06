import { Card, CardContent, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { PresetRecord, SpecimenRecord } from "@/context/db-context";

type RecentRecord = Pick<SpecimenRecord | PresetRecord, "id" | "name" | "createdAt">;

interface RecentRecordsProps {
  title: string;
  emptyLabel: string;
  records: RecentRecord[];
  hrefBase: "specimens" | "presets";
  loading: boolean;
}

export default function RecentRecords({ title, emptyLabel, records, hrefBase, loading }: RecentRecordsProps) {
  const { t, i18n } = useTranslation();
  const columns: GridColDef<RecentRecord>[] = [
    {
      field: "name",
      headerName: t("listing-name"),
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams<RecentRecord, string>) => (
        <Link to={`/${hrefBase}/${params.row.id}`} className='text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors'>
          {params.value}
        </Link>
      ),
    },
    {
      field: "createdAt",
      headerName: t("view-date"),
      width: 110,
      valueFormatter: (value) => new Date(Number(value)).toLocaleDateString(i18n.resolvedLanguage ?? "en"),
    },
  ];
  const recentRecords = records.slice(0, 10);

  return (
    <>
      <Typography variant='h6' component='h2' className='mb-3'>
        {title}
      </Typography>
      <Card>
        <CardContent className={!loading && recentRecords.length === 0 ? "flex min-h-40 items-center justify-center" : undefined}>
          {!loading && recentRecords.length === 0 ? (
            <Typography>{emptyLabel}</Typography>
          ) : (
            <DataGrid
              autoHeight
              rows={recentRecords}
              columns={columns}
              loading={loading}
              hideFooter
              showToolbar={false}
              disableColumnMenu
              disableColumnSorting
              disableColumnFilter
              disableRowSelectionOnClick
              columnHeaderHeight={40}
              rowHeight={44}
              className='dense border-none'
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}