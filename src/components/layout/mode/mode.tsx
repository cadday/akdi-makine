import { Box, Button, Tooltip } from "@mui/material";

import { cn } from "@/lib/utils";
import { useThemeContext } from "@/theme/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Mode() {
  const { isDarkMode } = useThemeContext();
  const { setMode } = useThemeContext();

  const handleToggle = () => {
    setMode(isDarkMode ? "light" : "dark");
  };

  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={isDarkMode ? t("mode-light") : t("mode-dark")} placement='bottom'>
        <Button
          variant='text'
          size='large'
          color='text-primary'
          className={cn("icon-only [&.active]:text-primary hover:bg-grey-75")}
          onClick={handleToggle}
          startIcon={
            isDarkMode ? (
              <Box className='w-6 h-6 flex items-center justify-center '>
                <Sun />
              </Box>
            ) : (
              <Box className='w-6 h-6 flex items-center justify-center '>
                <Moon />
              </Box>
            )
          }
        />
      </Tooltip>
    </>
  );
}
