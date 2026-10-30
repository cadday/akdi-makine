import { useMemo } from 'react';
import { Link } from 'react-router';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { ChevronRight } from 'lucide-react';
import type { TestRecord } from '@/context/db-context';
import { NoTestsFound } from '@/pages/app/components/no-entity-found';
import { cn } from '@/lib/utils';

type LatestTestRow = TestRecord & { presetName: string; specimenName: string };

const latestTestColumns: GridColDef<LatestTestRow>[] = [
  {
    field: 'name',
    headerName: 'Name',
    minWidth: 220,
    flex: 1,
    renderCell: (params: GridRenderCellParams<LatestTestRow, string>) => (
      <Link
        to={`/tests/${params.row.id}`}
        className="text-text-primary link-primary link-underline hover:text-primary py-2 font-semibold transition-colors"
      >
        {params.value}
      </Link>
    ),
  },
  { field: 'presetName', headerName: 'Preset', minWidth: 120, flex: 1 },
  { field: 'specimenName', headerName: 'Specimen', minWidth: 120, flex: 1 },
  { field: 'machineIP', headerName: 'Machine IP', minWidth: 120, valueFormatter: (value) => value || '-' },
  {
    field: 'createdAt',
    headerName: 'Created',
    minWidth: 160,
    valueFormatter: (value) =>
      new Date(Number(value)).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
  },
];

export default function LatestTests({ tests }: { tests: TestRecord[] }) {
  const rows = useMemo<LatestTestRow[]>(
    () =>
      tests
        .slice(0, 10)
        .map((test) => ({ ...test, presetName: test.presetSnapshot.name, specimenName: test.specimenSnapshot.name })),
    [tests],
  );

  return (
    <Grid size={12} className="group/grid">
      <Box className="flex flex-row items-center justify-between">
        <Typography variant="h6" component="h6" className="mb-3">
          Latest Tests
        </Typography>
        <Button
          size="tiny"
          color="grey"
          variant="text"
          component={Link}
          to="/tests"
          className={cn('group-hover/grid:opacity-100', 'transition-all opacity-0')}
          startIcon={<ChevronRight size={16} />}
        >
          View All
        </Button>
      </Box>
      <Card>
        <CardContent className={cn('flex flex-col', !rows.length && 'min-h-80 justify-center')}>
          {rows.length === 0 ? (
            <NoTestsFound />
          ) : (
            <DataGrid
              autoHeight
              rows={rows}
              columns={latestTestColumns}
              hideFooter
              showToolbar={false}
              disableColumnMenu
              disableRowSelectionOnClick
              columnHeaderHeight={40}
              rowHeight={44}
              className="dense border-none"
            />
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
