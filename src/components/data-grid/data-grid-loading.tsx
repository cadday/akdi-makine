import { Box, CircularProgress } from "@mui/material";

export default function DataGridLoading() {
  return (
    <Box className="flex min-h-40 items-center justify-center">
      <CircularProgress size={28} />
    </Box>
  );
}