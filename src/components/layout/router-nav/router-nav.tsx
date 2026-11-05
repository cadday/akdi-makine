import { Box, Button, Tooltip } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { useTabs } from "@/components/layout/tabs/tab-context";

export default function RouterNav() {
  const { t } = useTranslation();
  const { canGoBack, canGoForward, goBack, goForward, hasActiveTest } = useTabs();

  return (
    <Box className='flex flex-row gap-1'>
      <Tooltip title={t("back")} placement='bottom'>
        <span>
          <Button
            variant='text'
            size='large'
            color='text-primary'
            aria-label={t("back")}
            disabled={!canGoBack || hasActiveTest}
            className={cn("icon-only [&.active]:text-primary hover:bg-grey-75")}
            onClick={goBack}
            startIcon={
              <Box className='w-6 h-6 flex items-center justify-center '>
                <ChevronLeft size={16} />
              </Box>
            }
          />
        </span>
      </Tooltip>
      <Tooltip title={t("forward")} placement='bottom'>
        <span>
          <Button
            variant='text'
            size='large'
            color='text-primary'
            aria-label={t("forward")}
            disabled={!canGoForward || hasActiveTest}
            className={cn("icon-only [&.active]:text-primary hover:bg-grey-75")}
            onClick={goForward}
            startIcon={
              <Box className='w-6 h-6 flex items-center justify-center '>
                <ChevronRight size={16} />
              </Box>
            }
          />
        </span>
      </Tooltip>
    </Box>
  );
}
