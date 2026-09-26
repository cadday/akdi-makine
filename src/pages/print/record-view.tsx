import { lazy, Suspense } from "react";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import Logo from "@/components/logo/logo";

type PrintRecordType = "test" | "specimen" | "preset" | "data-field";

const TestPage = lazy(() => import("@/pages/app/tests/view/page"));
const SpecimenPage = lazy(() => import("@/pages/app/specimens/view/page"));
const PresetPage = lazy(() => import("@/pages/app/presets/view/page"));
const DataFieldPage = lazy(() => import("@/pages/app/data-fields/view/page"));

function isPrintRecordType(value: string | undefined): value is PrintRecordType {
  return value === "test" || value === "specimen" || value === "preset" || value === "data-field";
}

export default function PrintRecordView() {
  const { type } = useParams<{ type: string }>();
  const Page = type === "test" ? TestPage : type === "specimen" ? SpecimenPage : type === "preset" ? PresetPage : type === "data-field" ? DataFieldPage : null;

  useEffect(() => {
    if (!isPrintRecordType(type)) void window.electronAPI.notifyPdfReady("Unsupported PDF record type").catch(() => undefined);
  }, [type]);

  if (!Page) return <Typography>Unsupported PDF record type</Typography>;

  return (
    <Box className='print-view'>
      <style>{`
        .print-view { min-height: 100vh; width: 100%; overflow: visible; }
        .print-view .MuiBreadcrumbs-root,
        .print-view .title-wrapper .MuiButton-root,
        .print-view .MuiTabs-root { display: none !important; }
        .print-view .MuiTabPanel-root,
        .print-view .MuiTabPanel-root[hidden] { display: block !important; padding-top: 12px; }
        .print-view .MuiDataGrid-toolbar,
        .print-view .MuiDataGrid-footerContainer { display: none !important; }
        .print-view .MuiDataGrid-main,
        .print-view .MuiDataGrid-virtualScroller { overflow: visible !important; }
        .print-view .MuiCard-root { break-inside: avoid; }
        @media print { .print-view { min-height: 0; } }
      `}</style>
      <Suspense fallback={<LoadingFullScreen />}>
        <Box className='flex items-center justify-center'>
          <Logo classNameFull='flex' classNameMobile='hidden' />
        </Box>
        <Page printMode />
      </Suspense>
    </Box>
  );
}
