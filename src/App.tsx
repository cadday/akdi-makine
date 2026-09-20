import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { HashRouter } from "react-router";

import { Box, StyledEngineProvider } from "@mui/material";

import BackgroundWrapper from "@/components/layout/containers/background-wrapper";
import SnackbarWrapper from "@/components/layout/containers/snackbar-wrapper";
import LayoutContextProvider from "@/components/layout/layout-context";
import Loading from "@/pages/loading";
import AppRoutes from "@/routes";
import ThemeProvider from "@/theme/theme-provider";
import { PlcProvider } from "./context/plc-context";
import { LucideProvider } from "lucide-react";
const App = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <HashRouter>
      <StyledEngineProvider enableCssLayer>
        <Box lang={i18n.language} dir={direction} className='font-mulish font-urbanist relative antialiased'>
          <LucideProvider size={20} strokeWidth={1.5}>
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
          </LucideProvider>
        </Box>
      </StyledEngineProvider>
    </HashRouter>
  );
};

export default App;
