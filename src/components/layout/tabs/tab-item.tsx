import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Typography, Button, Box, Tooltip } from "@mui/material";
import { X } from "lucide-react";

interface TabItemProps {
  active?: boolean;
  disabled?: boolean;
  closeDisabled?: boolean;
  title: string;
  icon?: React.ReactNode;
  onClick: () => void;
  onClose: () => void;
}

export default function TabItem({ active, disabled = false, closeDisabled = false, title, icon, onClick, onClose }: TabItemProps) {
  const tabRef = useRef<HTMLLIElement>(null);
  const [tabWidth, setTabWidth] = useState(200);

  useEffect(() => {
    const tab = tabRef.current;
    if (!tab) return;

    const updateTabWidth = () => setTabWidth(tab.getBoundingClientRect().width);
    const resizeObserver = new ResizeObserver(updateTabWidth);
    resizeObserver.observe(tab);
    updateTabWidth();
    return () => resizeObserver.disconnect();
  }, []);

  const isCompact = tabWidth < 80;

  return (
    <Tooltip title={title} placement='bottom' enterDelay={1000} enterNextDelay={1000}>
      <Box
        component='li'
        ref={tabRef}
        role='tab'
        aria-selected={active}
        aria-label={title}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={onClick}
        onMouseDown={(event) => {
          if (event.button === 1) event.preventDefault();
        }}
        onAuxClick={(event) => {
          if (event.button !== 1) return;
          event.preventDefault();
          event.stopPropagation();
          if (!disabled && !closeDisabled) onClose();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
        className={cn(
          "group no-drag flex grow shrink basis-50 min-w-10 max-w-50 flex-row items-center gap-2 ps-3 pe-2 bg-grey-25 py-1 h-10 select-none rounded-lg relative transition-all text-text-secondary cursor-default",
          active && "active",
          disabled && "opacity-60",
          "outline-transparent! -outline-offset-2 outline-2 hover:outline-primary-light/50! hover:text-text-primary",
          "[&.active]:outline-primary-light/50! [&.active]:bg-background [&.active]:text-text-primary",
          "before:content-[''] before:block before:absolute before:h-12 before:w-full before:left-0",
        )}
      >
        {icon && <Box className={cn("w-5 h-5 flex items-center justify-center pointer-events-none shrink-0", isCompact && "group-hover:hidden")}>{icon}</Box>}

        <Typography variant='subtitle2' className={cn("pointer-events-none flex-1 min-w-0 truncate", isCompact && "group-hover:hidden")}>
          {title}
        </Typography>
        <Button
          variant='text'
          size='tiny'
          color='grey'
          disabled={disabled || closeDisabled}
          className={cn(
            "icon-only relative z-1 hover:bg-grey-300 cursor-default shrink-0 h-6 ms-auto",
            isCompact && "hidden group-hover:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ms-0",
          )}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          startIcon={<X size={12} />}
        />
      </Box>
    </Tooltip>
  );
}
