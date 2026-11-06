import { SyntheticEvent, useState } from "react";
import type { ReactNode } from "react";

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
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { ChevronRight, Columns, Copy, Download, FileText, Filter, GitCompareArrows, Plus, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type ListingToolbarProps = {
  rowSelectionModel?: GridRowSelectionModel;
  deleteRows?: (ids: string[]) => Promise<void>;
  duplicateRows?: (ids: string[]) => Promise<void>;
  onCompare?: (ids: string[]) => void;
  onAddItem?: (openInBackground?: boolean) => void;
  addDisabled?: boolean;
  addLabel?: string;
  addIcon?: ReactNode;
};

export const DataGridListingToolbar = ({
  rowSelectionModel,
  deleteRows,
  duplicateRows,
  onCompare,
  onAddItem,
  addDisabled = false,
  addLabel,
  addIcon = <Plus />,
}: ListingToolbarProps) => {
  const { t } = useTranslation();
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
                    className='surface-standard w-full mb-0'
                    placeholder={t("search")}
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
              <Button
                className='surface-standard'
                size='large'
                color='text-primary'
                variant='surface'
                onClick={handleClickSelection}
                endIcon={<ChevronRight size={16} className={cn("transition-transform rtl:rotate-180", openSelection && "rotate-90 rtl:rotate-90")} />}
              >
                {selectedCount > 1 ? t("selected-items", { count: selectedCount }) : t("selected-item", { count: selectedCount })}
              </Button>

              <Menu
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                anchorEl={anchorElSelection as Element}
                open={openSelection}
                onClose={handleCloseSelection}
                className='mt-1'
              >
                {duplicateRows && rowSelectionModel && (
                  <MenuItem
                    onClick={() => {
                      handleCloseSelection();
                      void duplicateRows(Array.from(rowSelectionModel.ids, String));
                    }}
                  >
                    <ListItemIcon>
                      <Copy size={16} />
                    </ListItemIcon>
                    <ListItemText>{t("duplicate")}</ListItemText>
                  </MenuItem>
                )}
                {onCompare && rowSelectionModel && selectedCount >= 2 && (
                  <MenuItem
                    onClick={() => {
                      handleCloseSelection();
                      onCompare(Array.from(rowSelectionModel.ids, String));
                    }}
                  >
                    <ListItemIcon>
                      <GitCompareArrows size={16} />
                    </ListItemIcon>
                    <ListItemText>{t("compare")}</ListItemText>
                  </MenuItem>
                )}
                {deleteRows && rowSelectionModel && (
                  <MenuItem
                    className='hover:bg-error-light/10 hover:text-error'
                    onClick={() => {
                      handleCloseSelection();
                      void deleteRows(Array.from(rowSelectionModel.ids, String));
                    }}
                  >
                    <ListItemIcon>
                      <X size={16} />
                    </ListItemIcon>
                    <ListItemText>{t("delete")}</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </>
          )}

          <Tooltip title={t("columns")}>
            <ColumnsPanelTrigger
              render={(props) => (
                <Button size='large' {...props} className='icon-only surface-standard flex-none' variant='surface' color='text-primary'>
                  <Columns />
                </Button>
              )}
            />
          </Tooltip>

          <Tooltip title={t("filters")}>
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

          <Tooltip title={t("export")}>
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
            <ExportCsv
              render={
                <MenuItem>
                  <ListItemIcon>
                    <FileText size={16} />
                  </ListItemIcon>
                  <ListItemText>{t("save-csv")}</ListItemText>
                </MenuItem>
              }
              onClick={handleCloseExport}
            />
          </Menu>

          {onAddItem && (
            <Button
              size='large'
              className='surface-standard'
              color='text-primary'
              variant='surface'
              onClick={() => onAddItem()}
              onAuxClick={(event) => {
                if (event.button !== 1) return;
                event.preventDefault();
                event.stopPropagation();
                if (!addDisabled) onAddItem(true);
              }}
              disabled={addDisabled}
              startIcon={addIcon}
            >
              {addLabel ?? t("add")}
            </Button>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  );
};
