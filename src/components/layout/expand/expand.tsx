import { Box, Button, Tooltip } from "@mui/material";

import { cn } from "@/lib/utils";
import { useThemeContext } from "@/theme/theme-provider";
import { FoldHorizontal, UnfoldHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContentType } from "@/types/types";

export default function Expand() {
  const { content, setContent } = useThemeContext();

  const handleToggle = () => {
    setContent(content === ContentType.Boxed ? ContentType.Fluid : ContentType.Boxed);
  };

  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={content === ContentType.Boxed ? t("expand-fluid") : t("expand-boxed")} placement='bottom'>
        <Button
          variant='text'
          size='large'
          color='text-primary'
          className={cn("icon-only [&.active]:text-primary hover:bg-grey-75")}
          onClick={handleToggle}
          startIcon={
            content === ContentType.Boxed ? (
              <Box className='w-6 h-6 flex items-center justify-center '>
                <UnfoldHorizontal />
              </Box>
            ) : (
              <Box className='w-6 h-6 flex items-center justify-center '>
                <FoldHorizontal />
              </Box>
            )
          }
        />
      </Tooltip>
    </>
  );
}
