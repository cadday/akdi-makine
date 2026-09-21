import { SyntheticEvent, useState } from "react";

import { Avatar, Fade, ListItemIcon, MenuItem, Menu, PopoverVirtualElement, Tooltip, Button, Box } from "@mui/material";

import { cn } from "@/lib/utils";
import { LocaleOption } from "@/constants";
import { setClientLocale } from "@/i18n/locale";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export default function Language() {
  const [anchorElLang, setAnchorElLang] = useState<EventTarget | Element | PopoverVirtualElement | null>(null);
  const openLang = Boolean(anchorElLang);
  const handleClickLang = (event: Event | SyntheticEvent) => {
    setAnchorElLang(event.currentTarget);
  };
  const handleCloseLang = () => {
    setAnchorElLang(null);
  };

  const {
    t,
    i18n: { language: locale },
  } = useTranslation();

  const handleOnChangeLocale = (value: LocaleOption) => {
    setClientLocale(value);
  };

  const [tooltipShow, setTooltipShow] = useState(false);

  return (
    <>
      <Tooltip title={t("language")} placement='bottom' open={!openLang && tooltipShow}>
        <Button
          variant='text'
          size='large'
          color='text-primary'
          className={cn("icon-only [&.active]:text-primary hover:bg-grey-75", openLang && "active bg-grey-75")}
          onClick={handleClickLang}
          onMouseEnter={() => setTooltipShow(true)}
          onMouseLeave={() => setTooltipShow(false)}
          startIcon={
            <Box className='w-6 h-6 flex items-center justify-center '>
              <Languages />
            </Box>
          }
        />
      </Tooltip>
      <Menu
        anchorEl={anchorElLang as Element}
        disableScrollLock
        open={openLang}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handleCloseLang}
        classes={{ paper: "mt-1 w-42" }}
        slots={{
          transition: Fade,
        }}
      >
        <MenuItem
          className={cn(locale === "en" && "active")}
          onClick={() => {
            handleCloseLang();
            handleOnChangeLocale("en");
          }}
        >
          <ListItemIcon>
            <Avatar className='nano circular' alt='English' src='/images/flags/en.jpg' />
          </ListItemIcon>
          {t("en")}
        </MenuItem>
        <MenuItem
          className={cn(locale === "tr" && "active")}
          onClick={() => {
            handleCloseLang();
            handleOnChangeLocale("tr");
          }}
        >
          <ListItemIcon>
            <Avatar className='nano circular' alt='Türkçe' src='/images/flags/tr.jpg' />
          </ListItemIcon>
          {t("tr")}
        </MenuItem>
      </Menu>
    </>
  );
}
