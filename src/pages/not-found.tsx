import { Box, Button, Paper, Typography } from "@mui/material";

import Logo from "@/components/logo/logo";
import { cn } from "@/lib/utils";
import { LINKS } from "@/constants";
import { Home } from "lucide-react";

export default function Page() {
  return (
    <Box className='bg-waves flex min-h-screen w-full items-center justify-center bg-cover bg-fixed bg-center p-4'>
      <Paper
        elevation={3}
        className={cn(
          "bg-background-paper shadow-darker-xs min-h-80 max-w-full min-w-full items-center justify-center rounded-4xl bg-center py-14 md:min-w-200",
        )}
      >
        <Box className='flex flex-col gap-4 px-8 sm:px-14'>
          <Box className='flex flex-col '>
            <Box className='mb-14 flex justify-center'>
              <Logo classNameMobile='hidden' />
            </Box>

            <Box className='flex flex-col items-center gap-4'>
              <Typography variant='h1' component='h1'>
                Not found!
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                The content you are looking for does not exist.
              </Typography>
              <Button variant='outlined' startIcon={<Home />} href={LINKS.home} component='a'>
                Home
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
