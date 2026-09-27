import { Box, Button, LinearProgress } from "@mui/material";
import { X } from "lucide-react";

export default function TestProgress({ progress, onStop }: { progress: number; onStop: () => void }) {
  return (
    <>
      <Box className='fixed inset-0 bg-background/60 w-full h-full z-5000'></Box>
      <Box className='fixed w-[calc(100%-7.25rem)] h-14 bg-background-paper/50 backdrop-blur-xs top-0 z-5002 inset-s-29 flex items-center ps-4'>
        <Button
          size='large'
          variant='pastel'
          color='grey'
          onClick={onStop}
          startIcon={
            <Box className='w-6 h-6 flex items-center justify-center '>
              <X size={14} />
            </Box>
          }
        >
          Stop
        </Button>
      </Box>

      <LinearProgress
        variant='determinate'
        value={Math.min(Math.max(progress, 0), 1) * 100}
        className='fixed w-[calc(100%-7.25rem)] h-0.5 top-14 z-5003 inset-s-29'
      />
    </>
  );
}
