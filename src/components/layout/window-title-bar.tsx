import { Box, IconButton, Stack } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CropSquareRoundedIcon from "@mui/icons-material/CropSquareRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

const buttonSx = {
  color: "#dfe3ea",
  backgroundColor: "transparent",
  width: 34,
  height: 34,
  borderRadius: 1,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  "&:active": {
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  WebkitAppRegion: "no-drag",
  appRegion: "no-drag",
};

export default function WindowTitleBar() {
  const minimize = () => window.electronAPI?.minimize();
  const maximize = () => window.electronAPI?.maximize();
  const close = () => window.electronAPI?.close();

  return (
    <Box
      sx={{
        height: 34,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        background: "rgba(15, 23, 42, 0.75)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        WebkitAppRegion: "drag",
        appRegion: "drag",
      }}
    >
      <Stack direction='row' spacing={0.5} sx={{ px: 1 }}>
        <IconButton aria-label='Minimize window' size='small' sx={buttonSx} onClick={minimize}>
          <RemoveRoundedIcon fontSize='small' />
        </IconButton>

        <IconButton aria-label='Maximize window' size='small' sx={buttonSx} onClick={maximize}>
          <CropSquareRoundedIcon fontSize='small' />
        </IconButton>

        <IconButton aria-label='Close window' size='small' sx={{ ...buttonSx, color: "#ffb4b4", "&:hover": { backgroundColor: "rgba(255, 82, 82, 0.16)" } }} onClick={close}>
          <CloseRoundedIcon fontSize='small' />
        </IconButton>
      </Stack>
    </Box>
  );
}
