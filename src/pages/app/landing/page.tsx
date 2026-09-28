import { Machine } from "@/icons/custom-lucide-icons/machine";
import { Box, Button, Divider, FormControl, FormLabel, Input, Paper, Typography } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router";
import { LINKS, LOCAL_STORAGE_KEYS } from "@/constants";
import LogoVertical from "@/components/logo/logo-vertical";
import { ChevronRight } from "lucide-react";
import Header from "@/components/layout/containers/header";
import { useLocalStorage } from "react-use";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function Page() {
  const navigate = useNavigate();

  const [startupChoice, setStartupChoice] = useLocalStorage(LOCAL_STORAGE_KEYS.startupChoice, null);

  const handleContinueNoConnection = () => {
    setStartupChoice("continue-without-machine");
    navigate(LINKS.home, { replace: true });
  };
  if (startupChoice !== null) return <Navigate to={LINKS.home} replace />;

  return (
    <>
      <OverlayScrollbarsComponent defer className='h-dvh os-scrollbar-body'>
        <Header minimal />
        <Box className='bg-background flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-cover bg-fixed bg-center p-4'>
          <Paper elevation={3} className='bg-background-paper shadow-darker-xs w-lg max-w-full rounded-4xl py-14'>
            <Box className='flex flex-col gap-4 px-8 sm:px-14'>
              <Box className='flex flex-col'>
                <Box className='mb-14 flex justify-center'>
                  <LogoVertical />
                </Box>

                <Box className='flex flex-col gap-10'>
                  <Box className='flex flex-col'>
                    <Typography variant='h3' component='h1' className='mb-2'>
                      Welcome
                    </Typography>
                    <Typography variant='body1' className='text-text-primary'>
                      Add a machine to get started. Make sure the machine and computer are on the same subnet (e.g., 192.168.1.150).
                    </Typography>
                  </Box>

                  <Box className='flex flex-col gap-5'>
                    <Box component={"form"} className='flex flex-col'>
                      <Box className='flex flex-row gap-2'>
                        <Machine />
                        <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                          <FormLabel component='label'>IP Address</FormLabel>
                          <Input name='name' />
                        </FormControl>
                      </Box>

                      <Box className='flex flex-row gap-2'>
                        <ChevronRight className='opacity-0' />
                        <Button type='submit' variant='contained' className='w-full mb-1 mt-4' endIcon={<ChevronRight size={14} />}>
                          Connect
                        </Button>
                      </Box>

                      <Box className='flex flex-row gap-2'>
                        <ChevronRight className='opacity-0' />
                        <Button variant='text' color='text-secondary' className='w-full mb-4' onClick={handleContinueNoConnection}>
                          Continue without Connection
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Divider className='text-text-secondary my-0 text-sm'></Divider>
                  <Box className='flex flex-col'>
                    <Typography variant='body2' className='text-text-secondary'>
                      By using this application, you agree to the{" "}
                      <Link to='/terms-and-conditions' className='link-primary link-underline-hover'>
                        Terms and Conditions
                      </Link>
                      .
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </OverlayScrollbarsComponent>
    </>
  );
}
