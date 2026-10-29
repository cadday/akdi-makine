import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";

import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";

import { useDb, type DataFieldDefinition, type PresetRecord, type SpecimenRecord, type TestRecord } from "@/context/db-context";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, DraftingCompass, FlaskConical, GalleryVerticalEnd, Network, SearchIcon, SlidersVertical, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { NothingToDisplay } from "@/pages/app/components/no-entity-found";

type SearchKind = "tests" | "specimens" | "presets" | "data-fields";
type SearchTab = "all" | SearchKind;

interface SearchResult {
  id: string;
  kind: SearchKind;
  name: string;
  secondary: string;
  to: string;
}

interface SearchGroup {
  kind: SearchKind;
  label: string;
  results: SearchResult[];
}

const RESULT_LIMIT = 10;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" });
}

function getResultIcon(kind: SearchKind) {
  switch (kind) {
    case "tests":
      return <FlaskConical className='text-primary' />;
    case "specimens":
      return <DraftingCompass className='text-secondary' />;
    case "presets":
      return <SlidersVertical className='text-accent-1' />;
    case "data-fields":
      return <Network className='text-accent-2' />;
  }
}

function getAvatarClass(kind: SearchKind) {
  switch (kind) {
    case "tests":
      return "bg-primary-light/10";
    case "specimens":
      return "bg-secondary-light/10";
    case "presets":
      return "bg-accent-1/10";
    case "data-fields":
      return "bg-accent-2/10";
  }
}

function makeResults<T extends { id: string; name: string }>(records: T[], kind: SearchKind, query: string, getSecondary: (record: T) => string): SearchResult[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];

  return records
    .filter((record) => record.name.toLocaleLowerCase().includes(normalizedQuery))
    .slice(0, RESULT_LIMIT)
    .map((record) => ({
      id: record.id,
      kind,
      name: record.name,
      secondary: getSecondary(record),
      to: `/${kind}/${record.id}`,
    }));
}

export default function Search() {
  const isMac = navigator.userAgent.includes("Mac");
  const navigate = useNavigate();
  const { getTests, getSpecimens, getPresets, getDataFields } = useDb();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const [tooltipShow, setTooltipShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tabValue, setTabValue] = useState<SearchTab>("all");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [specimens, setSpecimens] = useState<SpecimenRecord[]>([]);
  const [presets, setPresets] = useState<PresetRecord[]>([]);
  const [dataFields, setDataFields] = useState<DataFieldDefinition[]>([]);
  const { t } = useTranslation();

  const handleClickOpenDialog = () => {
    setQuery("");
    setTabValue("all");
    setSelectedIndex(-1);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setQuery("");
    setTabValue("all");
    setSelectedIndex(-1);
  };

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const hasShortcutModifier = isMac ? event.metaKey : event.ctrlKey;
      if (!hasShortcutModifier || event.altKey || event.key.toLowerCase() !== "k") return;

      const target = event.target;
      const isSearchInput = target === searchInputRef.current;
      const isOtherEditableElement =
        target instanceof HTMLElement &&
        !isSearchInput &&
        (target.isContentEditable || target.closest("input, textarea, select, [contenteditable='true']") !== null);
      if (isOtherEditableElement) return;

      event.preventDefault();
      if (open) {
        searchInputRef.current?.focus();
      } else {
        handleClickOpenDialog();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMac, open]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    const loadRecords = async () => {
      try {
        const [testRecords, specimenRecords, presetRecords, dataFieldRecords] = await Promise.all([
          getTests(),
          getSpecimens(),
          getPresets(),
          getDataFields(),
        ]);
        if (cancelled) return;
        setTests(testRecords);
        setSpecimens(specimenRecords);
        setPresets(presetRecords);
        setDataFields(dataFieldRecords);
      } catch (error) {
        if (!cancelled) setLoadError(`Failed to load search results: ${String(error)}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadRecords();
    return () => {
      cancelled = true;
    };
  }, [open, loadAttempt, getDataFields, getPresets, getSpecimens, getTests]);

  const groups = useMemo<SearchGroup[]>(() => {
    const searchGroups: SearchGroup[] = [
      { kind: "tests", label: "Tests", results: makeResults(tests, "tests", query, (test) => formatDate(test.updatedAt)) },
      { kind: "specimens", label: "Specimens", results: makeResults(specimens, "specimens", query, (specimen) => formatDate(specimen.updatedAt)) },
      { kind: "presets", label: "Presets", results: makeResults(presets, "presets", query, (preset) => formatDate(preset.updatedAt)) },
      {
        kind: "data-fields",
        label: "Data Fields",
        results: makeResults(dataFields, "data-fields", query, (dataField) => formatDate(dataField.updatedAt)),
      },
    ];

    return searchGroups.filter((group) => tabValue === "all" || group.kind === tabValue);
  }, [dataFields, presets, query, specimens, tabValue, tests]);

  const visibleResults = groups.flatMap((group) => group.results);
  const hasQuery = query.trim().length > 0;
  const hasResults = visibleResults.length > 0;

  useEffect(() => {
    if (selectedIndex < 0) return;
    const result = visibleResults[selectedIndex];
    if (!result) {
      setSelectedIndex(visibleResults.length - 1);
      return;
    }
    resultButtonRefs.current.get(`${result.kind}:${result.id}`)?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, visibleResults]);

  const handleTabChange = (_event: SyntheticEvent, newValue: SearchTab) => {
    setTabValue(newValue);
    setSelectedIndex(-1);
  };

  const handleNavigate = (result: SearchResult) => {
    handleCloseDialog();
    navigate(result.to);
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" && visibleResults.length > 0) {
      event.preventDefault();
      setSelectedIndex((current) => (current + 1) % visibleResults.length);
    } else if (event.key === "ArrowUp" && visibleResults.length > 0) {
      event.preventDefault();
      setSelectedIndex((current) => (current <= 0 ? visibleResults.length - 1 : current - 1));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      const result = visibleResults[selectedIndex];
      if (result) handleNavigate(result);
    }
  };

  const renderGroup = (group: SearchGroup, groupIndex: number) => (
    <Box key={group.kind} >
      <List className='py-0'>
        {group.results.map((result) => {
          const resultIndex = visibleResults.findIndex((item) => item.kind === result.kind && item.id === result.id);
          const isSelected = resultIndex === selectedIndex;
          const resultKey = `${result.kind}:${result.id}`;
          return (
            <ListItem key={resultKey} className='p-0'>
              <ListItemButton
                component='button'
                id={`search-result-${groupIndex}-${result.id}`}
                ref={(element: HTMLButtonElement | null) => {
                  if (element) resultButtonRefs.current.set(resultKey, element);
                  else resultButtonRefs.current.delete(resultKey);
                }}
                classes={{ root: "group items-start px-2 rounded-lg" }}
                className={cn(isSelected && "bg-grey-75")}
                role='option'
                aria-selected={isSelected}
                onMouseMove={() => setSelectedIndex(resultIndex)}
                onClick={() => handleNavigate(result)}
              >
                <ListItemAvatar>
                  <Avatar className={cn("medium me-3 rounded-sm", getAvatarClass(result.kind))}>{getResultIcon(result.kind)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography component='span' className='leading-4' variant='subtitle2'>
                      {result.name}
                    </Typography>
                  }
                  secondary={result.secondary}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Tooltip title={`${t("search")} (${isMac ? "cmd" : "ctrl"}+k)`} placement='bottom' open={!open && tooltipShow}>
        <Button
          variant='text'
          size='large'
          color='text-primary'
          className={cn("icon-only [&.active]:text-primary! hover:bg-grey-75", open && "active bg-grey-75 text-primary!")}
          onClick={handleClickOpenDialog}
          onMouseEnter={() => setTooltipShow(true)}
          onMouseLeave={() => setTooltipShow(false)}
          startIcon={
            <Box className='w-6 h-6 flex items-center justify-center '>
              <SearchIcon />
            </Box>
          }
        />
      </Tooltip>

      <Dialog
        onClose={handleCloseDialog}
        onKeyDownCapture={handleDialogKeyDown}
        open={open}
        maxWidth='md'
        fullWidth
        classes={{ container: "items-start", paper: "mt-14" }}
        slotProps={{ transition: { onEntered: () => searchInputRef.current?.focus() } }}
      >
        <DialogTitle className='border-grey-100 border-b py-0!'>
          <Input
            inputRef={searchInputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(-1);
            }}
            classes={{ input: "ps-0!" }}
            className='w-full py-6.5!'
            placeholder='Search'
            startAdornment={
              <InputAdornment position='start' className='h-7 w-7'>
                <SearchIcon />
              </InputAdornment>
            }
            endAdornment={
              query.length > 0 && (
                <InputAdornment position='end'>
                  <Button
                    aria-label='Clear search'
                    className='icon-only hover:bg-grey-25! group'
                    variant='text'
                    color='grey'
                    size='tiny'
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setQuery("");
                      setSelectedIndex(-1);
                      searchInputRef.current?.focus();
                    }}
                  >
                    <X size={16} className='group-hover:text-text-primary!' />
                  </Button>
                </InputAdornment>
              )
            }
          />
        </DialogTitle>
        <DialogContent className='flex flex-col pt-6 pb-6'>
          <TabContext value={tabValue}>
            <Tabs
              variant='scrollable'
              allowScrollButtonsMobile
              onChange={handleTabChange}
              slots={{
                endScrollButtonIcon: () => <ChevronRight size={16} />,
                startScrollButtonIcon: () => <ChevronLeft size={16} />,
              }}
              className='flex-none'
              value={tabValue}
            >
              <Tab icon={<GalleryVerticalEnd className='me-0! md:me-1!' />} iconPosition='start' label={<Box className='hidden md:flex'>All</Box>} value='all' />
              <Tab icon={<FlaskConical className='me-0! md:me-1!' />} iconPosition='start' label={<Box className='hidden md:flex'>Tests</Box>} value='tests' />
              <Tab
                icon={<DraftingCompass className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>Specimens</Box>}
                value='specimens'
              />
              <Tab
                icon={<SlidersVertical className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>Presets</Box>}
                value='presets'
              />
              <Tab
                icon={<Network className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>Data Fields</Box>}
                value='data-fields'
              />
            </Tabs>
            {isLoading ? (
              <Box className='flex min-h-100 items-center justify-center'>
                <Typography color='textSecondary'>Loading search results...</Typography>
              </Box>
            ) : loadError ? (
              <Box className='flex min-h-100 flex-col items-center justify-center gap-4'>
                <Alert severity='error'>{loadError}</Alert>
                <Button variant='outlined' color='grey' onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
                  Retry
                </Button>
              </Box>
            ) : hasResults ? (
              <TabPanel value={tabValue} className='flex min-h-100 flex-1 flex-col p-0'>
                <Box className='h-100 overflow-y-auto overflow-x-hidden -mx-2' role='listbox' aria-label='Search results'>
                  {groups.map(renderGroup)}
                </Box>
              </TabPanel>
            ) : (
              <TabPanel value={tabValue} className='flex min-h-100 flex-1 flex-col p-0'>
                <Box className='flex min-h-100 flex-1 items-center justify-center'>
                  <NothingToDisplay message={hasQuery ? "No results found!" : undefined} />
                </Box>
              </TabPanel>
            )}
          </TabContext>
        </DialogContent>
      </Dialog>
    </>
  );
}