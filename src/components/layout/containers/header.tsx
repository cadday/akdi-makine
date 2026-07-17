import Mode from "../mode/mode";
import Notifications from "../notifications/notifications";
import Search from "../search/search";
import Shortcuts from "../shortcuts/shortcuts";
import User from "../user/user";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Box, Button, Fade, Typography, useMediaQuery, useTheme } from "@mui/material";

import { useLayoutContext } from "@/components/layout/layout-context";
import Logo from "@/components/logo/logo";
import { DEFAULTS } from "@/config";
import NiListSquare from "@/icons/nexture/ni-list-square";
import NiMenuSplit from "@/icons/nexture/ni-menu-split";
import { cn } from "@/lib/utils";
import { MenuShowState } from "@/types/types";
import NiCheckSquare from "@/icons/nexture/ni-check-square";

export default function Header() {
  const { showLeftInMobile, showLeftMobileButton, leftPrimaryCurrent, leftShowBackdrop } = useLayoutContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [rightButtonsVisibleMobile, setRightButtonsVisibleMobile] = useState(false);

  const handleRightButtonsMobileToggle = () => {
    setRightButtonsVisibleMobile((prevValue) => !prevValue);
  };

  return (
    <Box className='shadow-grey-100 bg-background/75 sticky top-0 z-1 h-15 w-full shadow-[0_1px_0px_0px_rgba(0,0,0,0.1)] backdrop-blur-xs' component='header'>
      {/* 1px line to cover left side */}
      <Box className='bg-background absolute -left-0.25 h-15 w-0.25 rtl:-right-0.25 rtl:left-[unset]'></Box>
      <Box
        className={cn("flex h-full w-full flex-none flex-row items-center", leftShowBackdrop && "pointer-events-none")}
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
          startIcon={<NiMenuSplit size={24} />}
        />

        <Box className='flex h-full flex-1 flex-row items-center gap-4 md:gap-6'>
          {/* Logo */}
          <Link to={DEFAULTS.appRoot} className='ms-2 flex md:hidden'>
            <Logo classNameFull='hidden' classNameMobile='md:hidden' />
          </Link>

          {/* Subscribe CTA */}
          <Fade in={!rightButtonsVisibleMobile || !isMobile}>
            <Box component={Link} to={"#"} className='bg-grey-75  flex flex-row gap-5 rounded-lg py-1.5 ps-3 pe-2 transition-all! hover:shadow-md'>
              <Box className='flex flex-row items-center gap-2'>
                <NiCheckSquare size='large' className='text-success' />
                <Box className='flex flex-row gap-1'>
                  <Typography variant='subtitle1'>Connection</Typography>
                  <Typography variant='body1'>Succesfull</Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Box>

        {/* Right buttons */}
        <Box className='flex flex-row sm:gap-1'>
          <Fade in={rightButtonsVisibleMobile || !isMobile}>
            <Box className={cn("hidden flex-row sm:flex! sm:gap-1", rightButtonsVisibleMobile ? "flex" : "hidden")}>
              <Search />
              <Shortcuts />
              <Notifications />
              <Mode />
            </Box>
          </Fade>

          {/* The button to turn on and off the mobile version of the right buttons and version select */}
          <Button
            variant='text'
            size='large'
            color='text-primary'
            className={cn(
              "icon-only hover-icon-shrink [&.active]:text-primary hover:bg-grey-75 [&.active]:bg-grey-75 ms-1 sm:hidden",
              rightButtonsVisibleMobile && "active",
            )}
            onClick={handleRightButtonsMobileToggle}
            startIcon={<NiListSquare size={"large"} />}
          />
        </Box>

        {/* User Avatar and Menu */}
        <User />
      </Box>
    </Box>
  );
}
