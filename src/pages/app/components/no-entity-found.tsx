import { Box, Button, Typography } from "@mui/material";
import { File, Play, Plus } from "lucide-react";
import { Link } from "react-router";

export function NoWayToTest() {
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className="text-center">To run tests make sure you added at least one specimen and preset!</Typography>
      </Box>
      <Box className='flex flex-row gap-1'>
        <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} component={Link} to={`/specimens/add`}>
          Specimen
        </Button>
        <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} component={Link} to={`/presets/add`}>
          Preset
        </Button>
      </Box>
    </Box>
  );
}

export function NoTestsFound() {
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className="text-center">No tests found!</Typography>
      </Box>
      <Button size='large' variant='outlined' color='grey' startIcon={<Play />} component={Link} to={`/tests/add`}>
        Add
      </Button>
    </Box>
  );
}

export function NoSpecimensFound() {
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className="text-center">No specimens found!</Typography>
      </Box>
      <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} component={Link} to={`/specimens/add`}>
        Add
      </Button>
    </Box>
  );
}

export function NoPresetsFound() {
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className="text-center">No presets found!</Typography>
      </Box>
      <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} component={Link} to={`/presets/add`}>
        Add
      </Button>
    </Box>
  );
}

export function NoDataFieldsFound() {
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className="text-center">No data fields found!</Typography>
      </Box>
      <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} component={Link} to={`/data-fields/add`}>
        Add
      </Button>
    </Box>
  );
}
