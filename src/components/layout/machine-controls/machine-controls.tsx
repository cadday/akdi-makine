import { Box, Button, Paper, Tooltip } from "@mui/material";
import { ArrowBigDown, ArrowBigUp, OctagonX, Play, Square } from "lucide-react";

export default function MachineControls() {
  return (
    <Paper className='flex flex-col p-2 fixed right-0 top-1/2 -translate-y-1/2 mt-7 z-5005 rounded-e-2xs gap-4 shadow-darker-xs outline outline-grey-25'>
      <Box className='flex flex-col'>
        <Tooltip title='Quick Test' placement='left'>
          <Button variant='text' size='large' color='grey' className='icon-only' startIcon={<Play />} />
        </Tooltip>
        <Tooltip title='Stop Test' placement='left'>
          <Button variant='text' size='large' color='grey' className='icon-only' startIcon={<Square size={18} />} />
        </Tooltip>
      </Box>

      <Box className='flex flex-col'>
        <Tooltip title='Move Up' placement='left'>
          <Button variant='text' size='large' color='grey' className='icon-only' startIcon={<ArrowBigUp />} />
        </Tooltip>
        <Tooltip title='Move Down' placement='left'>
          <Button variant='text' size='large' color='grey' className='icon-only' startIcon={<ArrowBigDown />} />
        </Tooltip>
        <Tooltip title='Halt' placement='left'>
          <Button variant='text' size='large' color='error' className='icon-only' startIcon={<OctagonX />} />
        </Tooltip>
      </Box>
    </Paper>
  );
}
