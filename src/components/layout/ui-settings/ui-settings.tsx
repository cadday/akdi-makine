import { Box, Button, ButtonGroup, Tooltip } from "@mui/material";
import { FoldHorizontal, Moon, Settings, Sun, UnfoldHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuRadioGroup,
  MenuRadioItem,
} from "@/components/base-ui/menubar";
import { Menubar } from "@base-ui/react/menubar";
import { useThemeContext } from "@/theme/theme-provider";
import { setClientLocale } from "@/i18n/locale";
import { LocaleOption } from "@/constants";
import { TRFlag } from "@/icons/flags/tr";
import { ENFlag } from "@/icons/flags/en";

export default function UISettings() {
  const {
    t,
    i18n: { language: locale },
  } = useTranslation();
  const { mode, setMode, content, setContent } = useThemeContext();
  const handleOnChangeLocale = (value: LocaleOption) => {
    setClientLocale(value);
  };

  console.log(locale);

  return (
    <>
      <Menubar render={<ButtonGroup size='medium' variant='pastel' color='grey' />}>
        <MenuRoot>
          <MenuTrigger render={<Box />} nativeButton={false}>
            <Tooltip title={t("ui-settings")} placement='bottom'>
              <Button
                variant='text'
                size='large'
                color='text-primary'
                className={cn("icon-only [&.active]:text-primary hover:bg-grey-75")}
                startIcon={
                  <Box className='w-6 h-6 flex items-center justify-center '>
                    <Settings />
                  </Box>
                }
              />
            </Tooltip>
          </MenuTrigger>
          <MenuPortal>
            <MenuPositioner sideOffset={4} alignOffset={-2}>
              <MenuPopup>
                <MenuSubmenuRoot>
                  <MenuSubmenuTrigger>{t("mode")}</MenuSubmenuTrigger>
                  <MenuPortal>
                    <MenuPositioner sideOffset={4} alignOffset={-2}>
                      <MenuPopup>
                        <MenuRadioGroup value={mode} onValueChange={setMode}>
                          <MenuRadioItem
                            value='light'
                            className='[&_.MuiListItemText-root_span.MuiTypography-root]:flex [&_.MuiListItemText-root_span.MuiTypography-root]:flex-row [&_.MuiListItemText-root_span.MuiTypography-root]:gap-2'
                          >
                            <Box className='w-5 h-5 flex items-center justify-center '>
                              <Sun />
                            </Box>
                            {t("mode-light")}
                          </MenuRadioItem>
                          <MenuRadioItem
                            value='dark'
                            className='[&_.MuiListItemText-root_span.MuiTypography-root]:flex [&_.MuiListItemText-root_span.MuiTypography-root]:flex-row [&_.MuiListItemText-root_span.MuiTypography-root]:gap-2'
                          >
                            <Box className='w-5 h-5 flex items-center justify-center '>
                              <Moon />
                            </Box>
                            {t("mode-dark")}
                          </MenuRadioItem>
                        </MenuRadioGroup>
                      </MenuPopup>
                    </MenuPositioner>
                  </MenuPortal>
                </MenuSubmenuRoot>
                <MenuSubmenuRoot>
                  <MenuSubmenuTrigger>{t("container")}</MenuSubmenuTrigger>
                  <MenuPortal>
                    <MenuPositioner sideOffset={4} alignOffset={-2}>
                      <MenuPopup>
                        <MenuRadioGroup value={content} onValueChange={setContent}>
                          <MenuRadioItem
                            value='fluid'
                            className='[&_.MuiListItemText-root_span.MuiTypography-root]:flex [&_.MuiListItemText-root_span.MuiTypography-root]:flex-row [&_.MuiListItemText-root_span.MuiTypography-root]:gap-2'
                          >
                            <Box className='w-5 h-5 flex items-center justify-center '>
                              <UnfoldHorizontal />
                            </Box>
                            {t("expand-fluid")}
                          </MenuRadioItem>
                          <MenuRadioItem
                            value='boxed'
                            className='[&_.MuiListItemText-root_span.MuiTypography-root]:flex [&_.MuiListItemText-root_span.MuiTypography-root]:flex-row [&_.MuiListItemText-root_span.MuiTypography-root]:gap-2'
                          >
                            <Box className='w-5 h-5 flex items-center justify-center '>
                              <FoldHorizontal />
                            </Box>
                            {t("expand-boxed")}
                          </MenuRadioItem>
                        </MenuRadioGroup>
                      </MenuPopup>
                    </MenuPositioner>
                  </MenuPortal>
                </MenuSubmenuRoot>
                <MenuSubmenuRoot>
                  <MenuSubmenuTrigger>{t("language")}</MenuSubmenuTrigger>
                  <MenuPortal>
                    <MenuPositioner sideOffset={4} alignOffset={-2}>
                      <MenuPopup>
                        <MenuRadioGroup value={locale}>
                          <MenuRadioItem
                            value='tr'
                            onClick={() => {
                              handleOnChangeLocale("tr");
                            }}
                            className='[&_.MuiListItemText-root_span.MuiTypography-root]:flex [&_.MuiListItemText-root_span.MuiTypography-root]:flex-row [&_.MuiListItemText-root_span.MuiTypography-root]:gap-2'
                          >
                            <Box className='w-5 h-5 flex items-center justify-center '>
                              <TRFlag />
                            </Box>
                            {t("tr")}
                          </MenuRadioItem>
                          <MenuRadioItem
                            value='en'
                            onClick={() => {
                              handleOnChangeLocale("en");
                            }}
                            className='[&_.MuiListItemText-root_span.MuiTypography-root]:flex [&_.MuiListItemText-root_span.MuiTypography-root]:flex-row [&_.MuiListItemText-root_span.MuiTypography-root]:gap-2'
                          >
                            <Box className='w-5 h-5 flex items-center justify-center '>
                              <ENFlag />
                            </Box>
                            {t("en")}
                          </MenuRadioItem>
                        </MenuRadioGroup>
                      </MenuPopup>
                    </MenuPositioner>
                  </MenuPortal>
                </MenuSubmenuRoot>
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </MenuRoot>
      </Menubar>
    </>
  );
}
