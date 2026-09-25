import { Box, Button, Tooltip } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";

import { cn } from "@/lib/utils";

const getHistoryIndex = () => {
  const index = window.history.state?.idx;
  return typeof index === "number" ? index : 0;
};

export default function RouterNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentHistoryIndex = getHistoryIndex();
  const [furthestHistoryIndex, setFurthestHistoryIndex] = useState(currentHistoryIndex);

  useEffect(() => {
    if (navigationType === "PUSH") {
      setFurthestHistoryIndex(currentHistoryIndex);
    } else if (navigationType === "POP") {
      setFurthestHistoryIndex((furthestIndex) => Math.max(furthestIndex, currentHistoryIndex));
    }
  }, [currentHistoryIndex, location.key, navigationType]);

  const canGoBack = currentHistoryIndex > 0;
  const canGoForward = navigationType !== "PUSH" && currentHistoryIndex < furthestHistoryIndex;

  return (
    <Box className='flex flex-row gap-1'>
      <Tooltip title={"Backward"} placement='bottom'>
        <Button
          variant='text'
          size='large'
          color='text-primary'
          aria-label='Backward'
          disabled={!canGoBack}
          className={cn("icon-only [&.active]:text-primary hover:bg-grey-75")}
          onClick={() => navigate(-1)}
          startIcon={
            <Box className='w-6 h-6 flex items-center justify-center '>
              <ChevronLeft size={16} />
            </Box>
          }
        />
      </Tooltip>
      <Tooltip title={"Forward"} placement='bottom'>
        <Button
          variant='text'
          size='large'
          color='text-primary'
          aria-label='Forward'
          disabled={!canGoForward}
          className={cn("icon-only [&.active]:text-primary hover:bg-grey-75")}
          onClick={() => navigate(1)}
          startIcon={
            <Box className='w-6 h-6 flex items-center justify-center '>
              <ChevronRight size={16} />
            </Box>
          }
        />
      </Tooltip>
    </Box>
  );
}
