import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";

import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
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

import { useDb, type GlobalSearchKind } from "@/context/db-context";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, DraftingCompass, FlaskConical, GalleryVerticalEnd, Network, SearchIcon, SlidersVertical, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { NothingToDisplay } from "@/pages/app/components/no-entity-found";

type SearchKind = GlobalSearchKind;
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
const SEARCH_KINDS: SearchKind[] = ["tests", "specimens", "presets", "data-fields"];

function emptyResults(): Record<SearchKind, SearchResult[]> {
  return { tests: [], specimens: [], presets: [], "data-fields": [] };
}

function emptyCursors(): Record<SearchKind, number | null> {
  return { tests: 0, specimens: 0, presets: 0, "data-fields": 0 };
}

function emptyHasMore(): Record<SearchKind, boolean> {
  return { tests: false, specimens: false, presets: false, "data-fields": false };
}

function formatDate(timestamp: number, locale: string) {
  return new Date(timestamp).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });
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

function toSearchResults(records: Array<{ id: string; kind: SearchKind; name: string; updatedAt: number }>, locale: string): SearchResult[] {
  return records.map((record) => ({
    ...record,
    secondary: formatDate(record.updatedAt, locale),
    to: `/${record.kind}/${record.id}`,
  }));
}

export default function Search() {
  const isMac = navigator.userAgent.includes("Mac");
  const navigate = useNavigate();
  const { searchRecords } = useDb();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultButtonRefs = useRef(new Map<string, HTMLAnchorElement>());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const loadingMoreRef = useRef(false);
  const [tooltipShow, setTooltipShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [tabValue, setTabValue] = useState<SearchTab>("all");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resultsByKind, setResultsByKind] = useState<Record<SearchKind, SearchResult[]>>(emptyResults);
  const [cursors, setCursors] = useState<Record<SearchKind, number | null>>(emptyCursors);
  const [hasMoreByKind, setHasMoreByKind] = useState<Record<SearchKind, boolean>>(emptyHasMore);
  const { t, i18n } = useTranslation();

  const handleClickOpenDialog = () => {
    setQuery("");
    setDebouncedQuery("");
    setTabValue("all");
    setSelectedIndex(-1);
    setLoadError(null);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
    setTabValue("all");
    setSelectedIndex(-1);
    requestId.current += 1;
    setResultsByKind(emptyResults());
    setCursors(emptyCursors());
    setHasMoreByKind(emptyHasMore());
    setIsLoading(false);
    setIsLoadingMore(false);
    loadingMoreRef.current = false;
    setLoadError(null);
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
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [open, query]);

  useEffect(() => {
    if (!open || !debouncedQuery) {
      setIsLoading(false);
      return;
    }

    const activeRequestId = ++requestId.current;
    const kinds = tabValue === "all" ? SEARCH_KINDS : [tabValue];
    setIsLoading(true);
    setIsLoadingMore(false);
    loadingMoreRef.current = false;
    setLoadError(null);
    setResultsByKind(emptyResults());
    setCursors(emptyCursors());
    setHasMoreByKind(emptyHasMore());

    void Promise.all(kinds.map(async (kind) => [kind, await searchRecords(kind, debouncedQuery, 0, RESULT_LIMIT)] as const))
      .then((pages) => {
        if (requestId.current !== activeRequestId) return;
        setResultsByKind((current) => {
          const next = { ...current };
          for (const [kind, page] of pages) next[kind] = toSearchResults(page.rows, i18n.language);
          return next;
        });
        setCursors((current) => {
          const next = { ...current };
          for (const [kind, page] of pages) next[kind] = page.nextCursor;
          return next;
        });
        setHasMoreByKind((current) => {
          const next = { ...current };
          for (const [kind, page] of pages) next[kind] = page.nextCursor !== null;
          return next;
        });
      })
      .catch((error: unknown) => {
        if (requestId.current === activeRequestId) setLoadError(String(error));
      })
      .finally(() => {
        if (requestId.current === activeRequestId) setIsLoading(false);
      });

    return () => {
      requestId.current += 1;
    };
  }, [debouncedQuery, i18n.language, loadAttempt, open, searchRecords, tabValue]);

  const groups = useMemo<SearchGroup[]>(() => {
    const searchGroups: SearchGroup[] = SEARCH_KINDS.map((kind) => ({
      kind,
      label: t(kind === "data-fields" ? "data-fields" : kind),
      results: resultsByKind[kind],
    }));
    return searchGroups.filter((group) => tabValue === "all" || group.kind === tabValue);
  }, [resultsByKind, tabValue, t]);

  const visibleResults = groups.flatMap((group) => group.results);
  const hasQuery = query.trim().length > 0;
  const hasResults = visibleResults.length > 0;
  const isDebouncing = query.trim() !== debouncedQuery;
  const visibleKinds = tabValue === "all" ? SEARCH_KINDS : [tabValue];
  const canLoadMore = visibleKinds.some((kind) => hasMoreByKind[kind] && cursors[kind] !== null);

  const loadMore = useCallback(async () => {
    if (!open || !debouncedQuery || !canLoadMore || loadingMoreRef.current) return;
    const activeRequestId = requestId.current;
    const kinds = (tabValue === "all" ? SEARCH_KINDS : [tabValue]).filter((kind) => hasMoreByKind[kind] && cursors[kind] !== null);
    if (kinds.length === 0) return;

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const pages = await Promise.all(
        kinds.map(async (kind) => [kind, await searchRecords(kind, debouncedQuery, cursors[kind] ?? 0, RESULT_LIMIT)] as const),
      );
      if (requestId.current !== activeRequestId) return;
      setResultsByKind((current) => {
        const next = { ...current };
        for (const [kind, page] of pages) next[kind] = [...current[kind], ...toSearchResults(page.rows, i18n.language)];
        return next;
      });
      setCursors((current) => {
        const next = { ...current };
        for (const [kind, page] of pages) next[kind] = page.nextCursor;
        return next;
      });
      setHasMoreByKind((current) => {
        const next = { ...current };
        for (const [kind, page] of pages) next[kind] = page.nextCursor !== null;
        return next;
      });
    } catch (error) {
      if (requestId.current === activeRequestId) setLoadError(String(error));
    } finally {
      if (requestId.current === activeRequestId) {
        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [canLoadMore, cursors, debouncedQuery, hasMoreByKind, i18n.language, open, searchRecords, tabValue]);

  useEffect(() => {
    const root = scrollContainerRef.current;
    const sentinel = loadMoreSentinelRef.current;
    if (!open || !hasQuery || !canLoadMore || !root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { root, rootMargin: "120px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canLoadMore, hasQuery, loadMore, open, visibleResults.length]);

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
    requestId.current += 1;
    setTabValue(newValue);
    setSelectedIndex(-1);
    setResultsByKind(emptyResults());
    setCursors(emptyCursors());
    setHasMoreByKind(emptyHasMore());
    setIsLoading(false);
    setIsLoadingMore(false);
    loadingMoreRef.current = false;
    setLoadError(null);
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
                component={Link}
                to={result.to}
                id={`search-result-${groupIndex}-${result.id}`}
                ref={(element: HTMLAnchorElement | null) => {
                  if (element) resultButtonRefs.current.set(resultKey, element);
                  else resultButtonRefs.current.delete(resultKey);
                }}
                classes={{ root: "group items-start px-2 rounded-lg" }}
                className={cn(isSelected && "bg-grey-75")}
                role='option'
                aria-selected={isSelected}
                onMouseMove={() => setSelectedIndex(resultIndex)}
                onClick={handleCloseDialog}
              >
                <ListItemAvatar>
                  <Avatar className={cn("medium me-3 rounded-sm", getAvatarClass(result.kind))}>{getResultIcon(result.kind)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      component='span'
                      className='leading-4 text-text-primary link-primary hover:text-primary group-hover:text-primary group-hover:no-underline transition-colors'
                      variant='subtitle2'
                    >
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
              const nextQuery = event.target.value;
              requestId.current += 1;
              setQuery(nextQuery);
              setSelectedIndex(-1);
              setResultsByKind(emptyResults());
              setCursors(emptyCursors());
              setHasMoreByKind(emptyHasMore());
              setIsLoading(nextQuery.trim().length > 0);
              setIsLoadingMore(false);
              loadingMoreRef.current = false;
              setLoadError(null);
            }}
            classes={{ input: "ps-0!" }}
            className='w-full py-6.5!'
            placeholder={t("search")}
            startAdornment={
              <InputAdornment position='start' className='h-7 w-7'>
                <SearchIcon />
              </InputAdornment>
            }
            endAdornment={
              query.length > 0 && (
                <InputAdornment position='end'>
                  <Button
                    aria-label={t("search-clear")}
                    className='icon-only hover:bg-grey-25! group'
                    variant='text'
                    color='grey'
                    size='tiny'
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      requestId.current += 1;
                      setQuery("");
                      setDebouncedQuery("");
                      setSelectedIndex(-1);
                      setResultsByKind(emptyResults());
                      setCursors(emptyCursors());
                      setHasMoreByKind(emptyHasMore());
                      setIsLoading(false);
                      setIsLoadingMore(false);
                      loadingMoreRef.current = false;
                      setLoadError(null);
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
              <Tab icon={<GalleryVerticalEnd className='me-0! md:me-1!' />} iconPosition='start' label={<Box className='hidden md:flex'>{t("all")}</Box>} value='all' />
              <Tab icon={<FlaskConical className='me-0! md:me-1!' />} iconPosition='start' label={<Box className='hidden md:flex'>{t("tests")}</Box>} value='tests' />
              <Tab
                icon={<DraftingCompass className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>{t("specimens")}</Box>}
                value='specimens'
              />
              <Tab
                icon={<SlidersVertical className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>{t("presets")}</Box>}
                value='presets'
              />
              <Tab
                icon={<Network className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>{t("data-fields")}</Box>}
                value='data-fields'
              />
            </Tabs>
            {isLoading || isDebouncing ? (
              <Box className='flex min-h-100 items-center justify-center'>
                <Typography color='textSecondary'>{t("search-loading")}</Typography>
              </Box>
            ) : loadError ? (
              <Box className='flex min-h-100 flex-col items-center justify-center gap-4'>
                <Alert severity='error'>{t("search-load-error", { error: loadError })}</Alert>
                <Button variant='outlined' color='grey' onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
                  {t("retry")}
                </Button>
              </Box>
            ) : hasResults ? (
              <TabPanel value={tabValue} className='flex min-h-100 flex-1 flex-col p-0'>
                <Box ref={scrollContainerRef} className='h-100 overflow-y-auto overflow-x-hidden -mx-2' role='listbox' aria-label={t("search-results-label")}>
                  {groups.map(renderGroup)}
                  <Box ref={loadMoreSentinelRef} className='flex min-h-8 items-center justify-center py-2'>
                    {isLoadingMore && <CircularProgress size={18} aria-label={t("search-loading")} />}
                  </Box>
                </Box>
              </TabPanel>
            ) : (
              <TabPanel value={tabValue} className='flex min-h-100 flex-1 flex-col p-0'>
                <Box className='flex min-h-100 flex-1 items-center justify-center'>
                  <NothingToDisplay message={hasQuery ? t("no-search-results") : undefined} />
                </Box>
              </TabPanel>
            )}
          </TabContext>
        </DialogContent>
      </Dialog>
    </>
  );
}