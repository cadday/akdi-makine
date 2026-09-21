import "@/style/global.css";

import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import Header from "@/components/layout/containers/header";
import Main from "@/components/layout/containers/main";
import LeftMenu from "@/components/layout/menu/left-menu";
import MenuBackdrop from "@/components/layout/menu/menu-backdrop";
import Loading from "@/pages/loading";
import Footer from "@/components/layout/containers/footer";
import { Box } from "@mui/material";

export default function AppLayout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <>
      <LeftMenu />
      <Main>
        <Header />
        <Box className='min-h-[calc(100vh-2.5rem-3.5rem)] *:mb-2'>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Box>

        <Footer />
      </Main>
      <MenuBackdrop />
    </>
  );
}
