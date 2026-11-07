import { useEffect, useRef, useState } from "react";
import { liveQuery } from "dexie";
import { Box } from "@mui/material";
import { DraftingCompass, FlaskConical, SlidersVertical, Network, Presentation, Cog } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDb } from "@/context/db-context";
import { useTabs } from "./tab-context";
import TabItem from "./tab-item";

export default function Tabs() {
  const { t } = useTranslation();
  const { tabs, activeTabId, hasActiveTest, activateTab, closeTab, closeBackgroundTab } = useTabs();
  const { db } = useDb();
  const [recordNames, setRecordNames] = useState<Record<string, string>>({});
  const observedRecords = useRef<Record<string, { path: string; exists: boolean }>>({});
  const tabListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const tabList = tabListRef.current;
    if (!tabList) return;

    const handleWheel = (event: WheelEvent) => {
      if (tabList.scrollWidth <= tabList.clientWidth || event.deltaY === 0 || event.shiftKey) return;
      event.preventDefault();
      tabList.scrollLeft += event.deltaY;
    };

    tabList.addEventListener("wheel", handleWheel, { passive: false });
    return () => tabList.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const recordTabs = tabs.flatMap((tab) => {
      const pathname = tab.path.split(/[?#]/, 1)[0];
      const match = pathname.match(/^\/(tests|specimens|presets|data-fields)\/([^/]+)(?:\/|$)/);
      if (!match || match[2] === "add" || match[2] === "compare" || pathname.endsWith("/edit")) return [];
      return [{ tabId: tab.id, path: pathname, type: match[1], recordId: match[2] }];
    });
    const activeRecordTabIds = new Set(recordTabs.map(({ tabId }) => tabId));
    observedRecords.current = Object.fromEntries(Object.entries(observedRecords.current).filter(([tabId]) => activeRecordTabIds.has(tabId)));

    if (recordTabs.length === 0) {
      setRecordNames({});
      return;
    }

    const subscription = liveQuery(() =>
      Promise.all(
        recordTabs.map(async ({ tabId, path, type, recordId }) => {
          const record =
            type === "tests"
              ? await db.tests.get(recordId)
              : type === "specimens"
                ? await db.specimens.get(recordId)
                : type === "presets"
                  ? await db.presets.get(recordId)
                  : await db.dataFields.get(recordId);
          return { tabId, path, record };
        }),
      ),
    ).subscribe({
      next: (results) => {
        const nextRecordNames: Record<string, string> = {};
        results.forEach(({ tabId, path, record }) => {
          const exists = Boolean(record);
          const previous = observedRecords.current[tabId];
          if (previous?.path === path && previous.exists && !exists && tabId !== activeTabId) {
            closeBackgroundTab(tabId);
          }
          observedRecords.current[tabId] = { path, exists };
          if (record) nextRecordNames[tabId] = record.name;
        });
        setRecordNames(nextRecordNames);
      },
    });

    return () => subscription.unsubscribe();
  }, [activeTabId, closeBackgroundTab, db, tabs]);

  const getTabTitle = (tabId: string, path: string) => {
    const pathname = path.split(/[?#]/, 1)[0];
    const basePath = pathname.match(/^\/(tests|specimens|presets|data-fields|settings|overview)/)?.[1];
    const title =
      basePath === "tests"
        ? t("tests")
        : basePath === "specimens"
          ? t("specimens")
          : basePath === "presets"
            ? t("presets")
            : basePath === "data-fields"
              ? t("data-fields")
              : basePath === "settings"
                ? t("menu-settings")
                : t("menu-overview");

    if (pathname === "/tests/compare") return t("compare-title");
    if (pathname === "/tests/add") return t("add-test");
    if (pathname === "/specimens/add") return t("add-specimen");
    if (pathname === "/presets/add") return t("add-preset");
    if (pathname === "/data-fields/add") return t("add-data-field-title");

    const editMatch = pathname.match(/^\/(tests|specimens|presets)\/[^/]+\/edit$/);
    if (editMatch?.[1] === "tests") return t("edit-test-title");
    if (editMatch?.[1] === "specimens") return t("edit-specimen-title");
    if (editMatch?.[1] === "presets") return t("edit-preset-title");

    const recordId = pathname.match(/^\/(?:tests|specimens|presets|data-fields)\/([^/]+)(?:\/|$)/)?.[1];
    if (recordId && (basePath === "tests" || basePath === "specimens" || basePath === "presets" || basePath === "data-fields")) {
      return recordNames[tabId] ?? title;
    }
    return title;
  };

  return (
    <Box className='flex min-w-0 flex-1 items-center h-full vertical-scrollbar-hidden overflow-y-hidden'>
      <Box
        component='ul'
        ref={tabListRef}
        role='tablist'
        aria-label={t("tab-list")}
        className='flex min-w-0 flex-1 flex-row gap-1 px-2 h-full items-center overflow-x-auto overflow-y-hidden '
      >
        {tabs.map((tab) => {
          const pathname = tab.path.split(/[?#]/, 1)[0];
          const icon = pathname.startsWith("/tests") ? (
            <FlaskConical size={18} />
          ) : pathname.startsWith("/specimens") ? (
            <DraftingCompass size={18} />
          ) : pathname.startsWith("/presets") ? (
            <SlidersVertical size={18} />
          ) : pathname.startsWith("/data-fields") ? (
            <Network size={18} />
          ) : pathname.startsWith("/settings") ? (
            <Cog size={18} />
          ) : (
            <Presentation size={18} />
          );
          return (
            <TabItem
              key={tab.id}
              active={tab.id === activeTabId}
              disabled={hasActiveTest}
              closeDisabled={tabs.length < 2}
              title={getTabTitle(tab.id, tab.path)}
              icon={icon}
              onClick={() => activateTab(tab.id)}
              onClose={() => closeTab(tab.id)}
            />
          );
        })}
      </Box>
    </Box>
  );
}
