import '@/style/global.css';

import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '@/components/layout/containers/header';
import Main from '@/components/layout/containers/main';
import LeftMenu from '@/components/layout/menu/left-menu';
import MenuBackdrop from '@/components/layout/menu/menu-backdrop';
import Loading from '@/pages/loading';
import { Box } from '@mui/material';
import { OverlayScrollbarsComponent, type OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import MachineControls from '@/components/layout/machine-controls/machine-controls';

export default function AppLayout() {
  const { pathname, search } = useLocation();
  const scrollbarsRef = useRef<OverlayScrollbarsComponentRef>(null);

  useEffect(() => {
    scrollbarsRef.current?.osInstance()?.elements().viewport.scrollTo({ top: 0, left: 0 });
  }, [pathname, search]);

  return (
    <>
      <OverlayScrollbarsComponent ref={scrollbarsRef} defer className="h-dvh os-scrollbar-body">
        <LeftMenu />
        <Main>
          <MachineControls />
          <Header />
          <Box className="min-h-[calc(100vh-3.5rem)]">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </Box>
        </Main>
        <MenuBackdrop />
      </OverlayScrollbarsComponent>
    </>
  );
}
