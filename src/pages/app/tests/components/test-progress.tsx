import { Box, LinearProgress } from "@mui/material";

export default function TestProgress({ progress }: { progress: number }) {
  return (
    <>
      <Box className='fixed inset-0 bg-background/60 w-full h-full z-5000'></Box>
      <Box className='fixed w-[calc(100%-7.25rem)] h-14 bg-background-paper/50 backdrop-blur-xs top-0 z-5002 inset-s-29'></Box>

      <LinearProgress
        variant='determinate'
        value={Math.min(Math.max(progress, 0), 1) * 100}
        className='fixed w-[calc(100%-7.25rem)] h-0.5 top-14 z-5003 inset-s-29'
      />
    </>
  );
}
 