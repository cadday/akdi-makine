import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { DraftingCompass, FlaskConical, SlidersVertical, Network, Presentation, Cog } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDb } from "@/context/db-context";
import { useTabs } from "./tab-context";
import TabItem from "./tab-item";

export default function Tabs() {
  const { t } = useTranslation();
  const { tabs, activeTabId, hasActiveTest, activateTab, closeTab } = useTabs();
  const { getPreset, getSpecimen } = useDb();
  const [recordNames, setRecordNames] = useState<Record<string, string>>({});
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
    let cancelled = false;
    const loadRecordNames = async () => {
      const entries = await Promise.all(
        tabs.map(async (tab): Promise<[string, string] | null> => {
          const pathname = tab.path.split(/[?#]/, 1)[0];
          const match = pathname.match(/^\/(specimens|presets)\/([^/]+)(?:\/|$)/);
          if (!match || match[2] === "add") return null;

          try {
            const record = match[1] === "specimens" ? await getSpecimen(match[2]) : await getPreset(match[2]);
            return record ? [tab.id, record.name] : null;
          } catch {
            return null;
          }
        }),
      );

      if (!cancelled) {
        setRecordNames(Object.fromEntries(entries.filter((entry): entry is [string, string] => entry !== null)));
      }
    };

    void loadRecordNames();
    return () => {
      cancelled = true;
    };
  }, [getPreset, getSpecimen, tabs]);

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
    if (recordId && (basePath === "specimens" || basePath === "presets") && recordId !== "add") {
      return recordNames[tabId] ?? "";
    }
    return recordId && recordId !== "add" && recordId !== "compare" ? `${title} · ${recordId.slice(0, 8)}` : title;
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
