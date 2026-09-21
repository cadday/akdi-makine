import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { HashRouter } from "react-router";

import { Box, StyledEngineProvider } from "@mui/material";
import "overlayscrollbars/overlayscrollbars.css";
import BackgroundWrapper from "@/components/layout/containers/background-wrapper";
import SnackbarWrapper from "@/components/layout/containers/snackbar-wrapper";
import LayoutContextProvider from "@/components/layout/layout-context";
import { DbProvider } from "@/context/db-context";
import Loading from "@/pages/loading";
import AppRoutes from "@/routes";
import ThemeProvider from "@/theme/theme-provider";
import { PlcProvider } from "./context/plc-context";
import { LucideProvider } from "lucide-react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

const App = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <HashRouter>
      <StyledEngineProvider enableCssLayer>
        <Box lang={i18n.language} dir={direction} className='font-mulish font-urbanist relative antialiased h-dvh'>
          <OverlayScrollbarsComponent defer className='h-full os-scrollbar-body'>
            <LucideProvider size={20} strokeWidth={1.5} nonScalingStroke>
              <DbProvider>
                <PlcProvider>
                  <ThemeProvider>
                    <LayoutContextProvider>
                      <BackgroundWrapper />
                      <SnackbarWrapper>
                        <Suspense fallback={<Loading />}>
                          <AppRoutes />
                        </Suspense>
                      </SnackbarWrapper>
                    </LayoutContextProvider>
                  </ThemeProvider>
                </PlcProvider>
              </DbProvider>
            </LucideProvider>
          </OverlayScrollbarsComponent>
        </Box>
      </StyledEngineProvider>
    </HashRouter>
  );
};

export default App;
