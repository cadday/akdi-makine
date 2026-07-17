import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { HashRouter } from "react-router-dom";

import { Box, StyledEngineProvider } from "@mui/material";

import BackgroundWrapper from "@/components/layout/containers/background-wrapper";
import SnackbarWrapper from "@/components/layout/containers/snackbar-wrapper";
import LayoutContextProvider from "@/components/layout/layout-context";
import Loading from "@/pages/loading";
import AppRoutes from "@/routes";
import ThemeProvider from "@/theme/theme-provider";
import { PlcProvider } from "./context/plc-context";
const App = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <HashRouter>
      <StyledEngineProvider enableCssLayer>
        <Box lang={i18n.language} dir={direction} className='font-mulish font-urbanist relative antialiased'>
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
        </Box>
      </StyledEngineProvider>
    </HashRouter>
  );
};

export default App;

// import { Suspense } from "react";
// import { useTranslation } from "react-i18next";
// import { BrowserRouter } from "react-router-dom";

// import { Box, StyledEngineProvider } from "@mui/material";

// import BackgroundWrapper from "@/components/layout/containers/background-wrapper";
// import SnackbarWrapper from "@/components/layout/containers/snackbar-wrapper";
// import LayoutContextProvider from "@/components/layout/layout-context";
// import Loading from "@/pages/loading";
// import AppRoutes from "@/routes";
// import ThemeProvider from "@/theme/theme-provider";
// import { PlcProvider } from "./context/plc-context";
// const App = () => {
//   const { i18n } = useTranslation();
//   const direction = i18n.language === "ar" ? "rtl" : "ltr";

//   return (
//     <BrowserRouter>
//       <StyledEngineProvider enableCssLayer>
//         <Box lang={i18n.language} dir={direction} className='font-mulish font-urbanist relative antialiased'>
//           <PlcProvider>
//             <ThemeProvider>
//               <LayoutContextProvider>
//                 <BackgroundWrapper />
//                 <SnackbarWrapper>
//                   <Suspense fallback={<Loading />}>
//                     {/* Routes */}
//                     <AppRoutes />
//                   </Suspense>
//                 </SnackbarWrapper>
//               </LayoutContextProvider>
//             </ThemeProvider>
//           </PlcProvider>
//         </Box>
//       </StyledEngineProvider>
//     </BrowserRouter>
//   );
// };

// export default App;
