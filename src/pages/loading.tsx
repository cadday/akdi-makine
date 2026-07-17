import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box className="fixed inset-s-0 inset-e-0 top-0 bottom-0 z-9999 flex flex-col items-center justify-center">
      <CircularProgress color="primary" size={32} />
    </Box>
  );
}
