import { SyntheticEvent, useState } from "react";

import {
  Badge,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PopoverVirtualElement,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  ColumnsPanelTrigger,
  ExportCsv,
  ExportPrint,
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { ChevronRight, Columns, Download, FileText, Filter, Printer, Search, X, XSquare } from "lucide-react";

import { cn } from "@/lib/utils";

export type ListingToolbarProps = {
  rowSelectionModel?: GridRowSelectionModel;
  deleteRows?: (ids: string[]) => Promise<void>;
  onAddItem?: () => void;
  addLabel?: string;
};

export const ListingToolbar = ({ rowSelectionModel, deleteRows, onAddItem, addLabel = "Add" }: ListingToolbarProps) => {
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

  const selectedCount = rowSelectionModel?.ids.size ?? 0;

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
          {selectedCount > 0 && (
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
                  {selectedCount > 1 ? selectedCount + " Items" : selectedCount + " Item"}
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
                {deleteRows && rowSelectionModel && (
                  <MenuItem
                    onClick={() => {
                      handleCloseSelection();
                      void deleteRows(Array.from(rowSelectionModel.ids, String));
                    }}
                  >
                    <ListItemIcon>
                      <XSquare />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                )}
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

          {onAddItem && (
            <Button size='large' className='surface-standard' color='text-primary' variant='surface' onClick={onAddItem}>
              {addLabel}
            </Button>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  );
};
