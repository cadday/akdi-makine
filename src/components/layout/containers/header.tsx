import Mode from "../mode/mode";
import Search from "../search/search";
import { Link } from "react-router";

import { Box, Button } from "@mui/material";

import { useLayoutContext } from "@/components/layout/layout-context";
import Logo from "@/components/logo/logo";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuShowState } from "@/types/types";
import WindowControls from "./window-controls";
import { LINKS } from "@/constants";
import Expand from "../expand/expand";
import RouterNav from "../router-nav/router-nav";
import Machines from "../machine-selection/machines";

export default function Header({ minimal = false }: { minimal?: boolean }) {
  const { showLeftInMobile, showLeftMobileButton, leftPrimaryCurrent, leftShowBackdrop } = useLayoutContext();

  return (
    <Box
      className='flex-none drag mui-fixed shadow-grey-75 bg-background/75 sticky top-0 z-1 h-14 w-full shadow-[0_1px_0px_0px_rgba(0,0,0,0.1)] backdrop-blur-xs'
      component='header'
    >
      {/* 1px line to cover left side */}
      <Box className='bg-background absolute -left-0.25 h-14 w-0.25 rtl:-right-0.25 rtl:left-[unset]'></Box>
      <Box
        className={cn("flex h-full w-full flex-none flex-row items-center pe-0!", leftShowBackdrop && "pointer-events-none")}
        style={{ padding: `0 var(--main-padding)` }}
      >
        {/* Left menu button */}
        <Button
          variant='text'
          size='large'
          color='text-primary'
          className={cn(
            "icon-only hover-icon-shrink [&.active]:text-primary [&.active]:bg-grey-75 hover:bg-grey-75",
            showLeftMobileButton ? "flex" : "hidden",
            leftPrimaryCurrent !== MenuShowState.Hide && "active",
          )}
          onClick={() => showLeftInMobile()}
          startIcon={<Menu />}
        />

        <Box className='flex h-full flex-1 flex-row items-center gap-4 md:gap-6'>
          {/* Logo */}
          <Link to={LINKS.home} className='ms-2 flex md:hidden'>
            <Logo classNameFull='hidden' classNameMobile='md:hidden' />
          </Link>

          <Box className='flex flex-row sm:gap-1 no-drag'>
            <RouterNav />
            {!minimal && (
              <>
                <Expand />
                <Mode />
                <Search />
              </>
            )}
          </Box>
        </Box>

        {!minimal && (
          <Box className='flex flex-row gap-1  no-drag'>
            {/* <Button
              size='large'
              variant='pastel'
              color='grey'
              component={Link}
              to={"/tests/add"}
              startIcon={
                <Box className='w-6 h-6 flex items-center justify-center '>
                  <Play />
                </Box>
              }
            >
              Add Test
            </Button> */}

            <Machines />
          </Box>
        )}
        <WindowControls />
      </Box>
    </Box>
  );
}
