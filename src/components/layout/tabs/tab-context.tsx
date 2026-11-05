/* eslint-disable react-refresh/only-export-components */
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";
import { useTestRun } from "@/context/test-run-context";

export interface AppTab {
  id: string;
  path: string;
  history: string[];
  historyIndex: number;
}

interface TabsContextValue {
  tabs: AppTab[];
  activeTabId: string;
  hasActiveTest: boolean;
  activateTab: (id: string) => void;
  openTab: (path: string, activate?: boolean) => void;
  closeTab: (id: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);
let nextTabId = 0;

function createTab(path: string): AppTab {
  return { id: `tab-${Date.now()}-${nextTabId++}`, path, history: [path], historyIndex: 0 };
}

function getLocationPath(location: ReturnType<typeof useLocation>) {
  return `${location.pathname}${location.search}${location.hash}`;
}

function getInternalPath(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href) return null;

  const parsed = new URL(href, window.location.href);
  const path = parsed.hash.startsWith("#/") ? parsed.hash.slice(1) : null;
  if (!path || path.startsWith("/print/") || path === "/404") return null;
  return path;
}

export function TabsProvider({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { hasActiveTest } = useTestRun();
  const currentPath = getLocationPath(location);
  const [tabs, setTabs] = useState<AppTab[]>(() => [{ id: "tab-initial", path: currentPath, history: [currentPath], historyIndex: 0 }]);
  const [activeTabId, setActiveTabId] = useState(() => "tab-initial");
  const pendingPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (pendingPathRef.current) {
      if (pendingPathRef.current !== currentPath) return;
      pendingPathRef.current = null;
    }

    setTabs((currentTabs) =>
      currentTabs.map((tab) => {
        if (tab.id !== activeTabId || tab.path === currentPath) return tab;
        if (navigationType === "REPLACE") {
          const history = [...tab.history];
          history[tab.historyIndex] = currentPath;
          return { ...tab, path: currentPath, history };
        }

        const history = [...tab.history.slice(0, tab.historyIndex + 1), currentPath];
        return { ...tab, path: currentPath, history, historyIndex: history.length - 1 };
      }),
    );
  }, [activeTabId, currentPath, navigationType]);

  const openTab = useCallback(
    (path: string, activate = true) => {
      if (hasActiveTest) return;
      const tab = createTab(path);
      setTabs((currentTabs) => [...currentTabs, tab]);
      if (!activate) return;
      setActiveTabId(tab.id);
      if (path !== currentPath) pendingPathRef.current = path;
      navigate(path);
    },
    [currentPath, hasActiveTest, navigate],
  );

  const activateTab = useCallback(
    (id: string) => {
      if (hasActiveTest || id === activeTabId) return;
      const tab = tabs.find((item) => item.id === id);
      if (!tab) return;
      setActiveTabId(id);
      if (tab.path !== currentPath) pendingPathRef.current = tab.path;
      navigate(tab.path);
    },
    [activeTabId, currentPath, hasActiveTest, navigate, tabs],
  );

  const closeTab = useCallback(
    (id: string) => {
      if (hasActiveTest || tabs.length < 2) return;
      const index = tabs.findIndex((tab) => tab.id === id);
      if (index < 0) return;
      const remainingTabs = tabs.filter((tab) => tab.id !== id);
      setTabs(remainingTabs);
      if (id !== activeTabId) return;
      const nextTab = remainingTabs[Math.min(index, remainingTabs.length - 1)];
      setActiveTabId(nextTab.id);
      if (nextTab.path !== currentPath) pendingPathRef.current = nextTab.path;
      navigate(nextTab.path);
    },
    [activeTabId, currentPath, hasActiveTest, navigate, tabs],
  );

  const navigateInHistory = useCallback(
    (offset: -1 | 1) => {
      if (hasActiveTest) return;
      const activeTab = tabs.find((tab) => tab.id === activeTabId);
      if (!activeTab) return;
      const nextIndex = activeTab.historyIndex + offset;
      const path = activeTab.history[nextIndex];
      if (!path) return;
      setTabs((currentTabs) => currentTabs.map((tab) => (tab.id === activeTabId ? { ...tab, path, historyIndex: nextIndex } : tab)));
      navigate(path, { replace: true });
    },
    [activeTabId, hasActiveTest, navigate, tabs],
  );

  const goBack = useCallback(() => navigateInHistory(-1), [navigateInHistory]);
  const goForward = useCallback(() => navigateInHistory(1), [navigateInHistory]);
  useEffect(() => {
    const handleModifiedClick = (event: MouseEvent) => {
      if (!(event.metaKey || event.ctrlKey || event.button === 1) || !(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target || anchor.hasAttribute("download")) return;
      const path = getInternalPath(anchor);
      if (!path) return;
      event.preventDefault();
      event.stopPropagation();
      if (!hasActiveTest) openTab(path, false);
    };

    document.addEventListener("click", handleModifiedClick, true);
    document.addEventListener("auxclick", handleModifiedClick, true);
    return () => {
      document.removeEventListener("click", handleModifiedClick, true);
      document.removeEventListener("auxclick", handleModifiedClick, true);
    };
  }, [hasActiveTest, openTab]);

  const value = useMemo(
    () => ({
      tabs,
      activeTabId,
      hasActiveTest,
      activateTab,
      openTab,
      closeTab,
      canGoBack: (tabs.find((tab) => tab.id === activeTabId)?.historyIndex ?? 0) > 0,
      canGoForward: (() => {
        const activeTab = tabs.find((tab) => tab.id === activeTabId);
        return Boolean(activeTab && activeTab.historyIndex < activeTab.history.length - 1);
      })(),
      goBack,
      goForward,
    }),
    [activateTab, activeTabId, closeTab, goBack, goForward, hasActiveTest, openTab, tabs],
  );

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("useTabs must be used within TabsProvider");
  return context;
}