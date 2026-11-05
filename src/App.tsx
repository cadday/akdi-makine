import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HashRouter } from "react-router";

import { Box, StyledEngineProvider } from "@mui/material";
import BackgroundWrapper from "@/components/layout/containers/background-wrapper";
import SnackbarWrapper from "@/components/layout/containers/snackbar-wrapper";
import LayoutContextProvider from "@/components/layout/layout-context";
import { DbProvider } from "@/context/db-context";
import { TestRunProvider } from "@/context/test-run-context";
import { TabsProvider } from "@/components/layout/tabs/tab-context";
import Loading from "@/pages/loading";
import AppRoutes from "@/routes";
import ThemeProvider from "@/theme/theme-provider";
import { PlcProvider } from "./context/plc-context";
import { LucideProvider } from "lucide-react";

const App = () => {
  const { i18n, t } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const locale: AppLocale = i18n.language.startsWith("tr") ? "tr" : "en";
    void window.electronAPI.setUpdaterMessages({
      locale,
      title: t("update-ready-title"),
      messageTemplate: t("update-ready-message", { version: "__VERSION__" }),
      restartButton: t("update-restart-now"),
      laterButton: t("update-later"),
    });
  }, [i18n.language, t]);

  return (
    <HashRouter>
      <StyledEngineProvider enableCssLayer>
        <Box lang={i18n.language} dir={direction} className='font-mulish font-nunito relative antialiased min-h-dvh'>
          <LucideProvider size={20} strokeWidth={1.25} nonScalingStroke>
            <DbProvider>
              <PlcProvider>
                <ThemeProvider>
                  <LayoutContextProvider>
                    <BackgroundWrapper />
                    <SnackbarWrapper>
                      <TestRunProvider>
                        <Suspense fallback={<Loading />}>
                          <TabsProvider>
                            <AppRoutes />
                          </TabsProvider>
                        </Suspense>
                      </TestRunProvider>
                    </SnackbarWrapper>
                  </LayoutContextProvider>
                </ThemeProvider>
              </PlcProvider>
            </DbProvider>
          </LucideProvider>
        </Box>
      </StyledEngineProvider>
    </HashRouter>
  );
};

export default App;
