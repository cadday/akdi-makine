import { Box, LinearProgress } from '@mui/material';

export default function TestProgress() {
  return (
    <>
      <Box className="w-full fixed top-0 left-29 h-14 bg-background/60 z-5004 backdrop-blur-xs"></Box>
      <Box className="fixed inset-0 bg-background/60 w-full h-full z-5000"></Box>
      <LinearProgress
        variant="indeterminate"
        sx={{
          '& .MuiLinearProgress-bar1Indeterminate': {
            animationDuration: '10s !important',
          },
          '& .MuiLinearProgress-bar2Indeterminate': {
            animationDuration: '10s !important',
          },
        }}
        className="fixed w-[calc(100%-7.25rem)] h-0.5 top-14 z-5003 inset-s-29"
      />
    </>
  );
}
