import { Box, Button, Typography } from "@mui/material";
import { File, FileSearch2, Play, Plus } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function NoWayToTest() {
  const { t } = useTranslation();
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className='text-center'>{t("requires-test-prerequisites")}</Typography>
      </Box>
      <Box className='flex flex-row gap-1'>
        <Button size='large' variant='text' color='grey' className='px-4' component={Link} to={`/specimens/add`}>
          {t("add-specimen")}
        </Button>
        <Button size='large' variant='text' color='grey' className='px-4' component={Link} to={`/presets/add`}>
          {t("add-preset")}
        </Button>
      </Box>
    </Box>
  );
}

export function NothingToDisplay({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <Box className='flex flex-col flex-1 justify-center items-center gap-4 mb-8'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg '>
          <FileSearch2 className='text-text-secondary' />
        </Box>
        <Typography className='text-center'>{message ?? t("search-hint")}</Typography>
      </Box>
    </Box>
  );
}

export function NoTestsFound() {
  const { t } = useTranslation();
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className='text-center'>{t("no-tests-found")}</Typography>
      </Box>
      <Button size='large' variant='outlined' color='grey' startIcon={<Play />} component={Link} to={`/tests/add`}>
        {t("add")}
      </Button>
    </Box>
  );
}

export function NoSpecimensFound() {
  const { t } = useTranslation();
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className='text-center'>{t("no-specimens-found")}</Typography>
      </Box>
      <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} component={Link} to={`/specimens/add`}>
        {t("add")}
      </Button>
    </Box>
  );
}

export function NoPresetsFound() {
  const { t } = useTranslation();
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className='text-center'>{t("no-presets-found")}</Typography>
      </Box>
      <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} component={Link} to={`/presets/add`}>
        {t("add")}
      </Button>
    </Box>
  );
}

export function NoDataFieldsFound() {
  const { t } = useTranslation();
  return (
    <Box className='flex flex-col items-center gap-4'>
      <Box className='flex flex-col gap-2 items-center'>
        <Box className='w-10 h-10 border border-dashed border-text-secondary flex items-center justify-center rounded-lg'>
          <File className='text-text-secondary' />
        </Box>
        <Typography className='text-center'>{t("no-data-fields-found")}</Typography>
      </Box>
      <Button size='large' variant='outlined' color='grey' startIcon={<Plus />} component={Link} to={`/data-fields/add`}>
        {t("add")}
      </Button>
    </Box>
  );
}
