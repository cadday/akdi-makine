import { cn } from "@/lib/utils";
import { Box, Button } from "@mui/material";
import { Copy, Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const value = await window.electronAPI.isMaximized();
      setIsMaximized(value);
    };

    init();

    const cleanup = window.electronAPI.onMaximizedStateChange((value) => {
      setIsMaximized(value);
    });

    return cleanup;
  }, []);

  return (
    <Box className='flex flex-row gap-0 no-drag ms-4 h-full items-center'>
      <Button
        variant='text'
        size='large'
        color='text-primary'
        className={cn("icon-only hover:bg-grey-75 cursor-default")}
        onClick={() => {
          window.electronAPI.minimize();
        }}
        startIcon={
          <Box className='w-6 h-6 flex items-center justify-center'>
            <Minus size={14} />
          </Box>
        }
      />
      <Button
        variant='text'
        size='large'
        color='text-primary'
        className={cn("icon-only hover:bg-grey-75 cursor-default")}
        onClick={() => {
          window.electronAPI.maximize();
        }}
        startIcon={<Box className='w-6 h-6 flex items-center justify-center'>{isMaximized ? <Copy size={14} /> : <Square size={12} />}</Box>}
      />
      <Button
        variant='text'
        size='large'
        color='text-primary'
        className={cn(
          "relative! icon-only hover:bg-error-light/10 hover:text-error cursor-default flex-none me-4",
          "before:content-[''] before:absolute before:h-14 before:w-14 before:left-0",
        )}
        onClick={() => {
          window.electronAPI.close();
        }}
        startIcon={
          <Box className='w-6 h-6 flex items-center justify-center '>
            <X size={14} />
          </Box>
        }
      />
    </Box>
  );
}
