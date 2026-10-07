import { lazy, Suspense } from "react";
import { Box } from "@mui/material";
import LoadingFullScreen from "@/components/loading/loading-full-screen";
import Logo from "@/components/logo/logo";
import PdfRenderErrorBoundary from "@/components/pdf/pdf-render-error-boundary";

const CompareTestsPage = lazy(() => import("@/pages/app/tests/compare/page"));

export default function PrintComparisonView() {
  return (
    <Box className='print-view'>
      <style>{`
        .print-view { min-height: 100vh; width: 100%; overflow: visible; }
        .print-view .MuiBreadcrumbs-root,
        .print-view .title-wrapper .MuiButton-root { display: none !important; }
        .print-view .MuiDataGrid-toolbar,
        .print-view .MuiDataGrid-footerContainer { display: none !important; }
        .print-view .MuiDataGrid-main,
        .print-view .MuiDataGrid-virtualScroller { overflow: visible !important; }
        .print-view .MuiCard-root { break-inside: avoid; }
        @media print { .print-view { min-height: 0; } }
      `}</style>
      <PdfRenderErrorBoundary>
        <Suspense fallback={<LoadingFullScreen />}>
          <Box className='flex items-center justify-center'>
            <Logo classNameFull='flex' classNameMobile='hidden' />
          </Box>
          <CompareTestsPage printMode />
        </Suspense>
      </PdfRenderErrorBoundary>
    </Box>
  );
}