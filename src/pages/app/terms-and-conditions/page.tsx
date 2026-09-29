import { Box, Button, Paper, Typography } from "@mui/material";
import LogoVertical from "@/components/logo/logo-vertical";
import Header from "@/components/layout/containers/header";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";

export default function Page() {
  const navigate = useNavigate();

  return (
    <>
      <OverlayScrollbarsComponent defer className='h-dvh os-scrollbar-body'>
        <Header minimal />
        <Box className='bg-background flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-cover bg-fixed bg-center p-4'>
          <Paper elevation={3} className='bg-background-paper shadow-darker-xs w-2xl max-w-full rounded-4xl py-10'>
            <Box className='flex flex-col gap-4 px-10'>
              <Box className='flex flex-col'>
                <Box className='mb-14 flex justify-center'>
                  <LogoVertical />
                </Box>

                <Box className='flex flex-col gap-10'>
                  <Box className='flex flex-col'>
                    <Typography variant='h3' component='h1' className='mb-2'>
                      Terms and Conditions
                    </Typography>
                    <Typography variant='body1' className='text-text-primary'>
                      These terms and conditions outline the rules and regulations for the use of AKDI MAKINE application. By accessing this page we assume you
                      accept these terms and conditions. Do not continue to use AKDI MAKINE if you do not agree to all of the terms and conditions stated on
                      this page.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant='h6' className='mb-2'>
                      1. Acceptance of Terms
                    </Typography>
                    <Typography variant='body1'>
                      By downloading, installing, or using AKDI MAKINE (“Application”), you agree to be bound by these Terms and Conditions. If you do not
                      agree, you must not use the Application.
                    </Typography>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      2. Intended Use
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>The Application is designed exclusively for use with AKDI MAKINE machines.</li>
                      <li>The Application must not be used independently or with non-compatible equipment.</li>
                      <li>Any misuse outside of its intended purpose is strictly prohibited.</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      3. User Responsibilities
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>
                        Users must follow all operating instructions provided by AKDI MAKINE, or are obligated to request such instructions if they have not
                        been provided.
                      </li>
                      <li>Users are responsible for ensuring that the machine and Application are operated in compliance with applicable safety standards.</li>
                      <li>The Application should only be used by trained personnel authorized to operate the machine.</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      4. Safety Measures
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>Always adhere to the safety guidelines outlined in the machine’s user manual, or request them from AKDI MAKINE if not supplied.</li>
                      <li>Do not bypass or disable safety features.</li>
                      <li>Ensure proper protective equipment is worn during operation.</li>
                      <li>AKDI MAKINE is not liable for injuries or damages resulting from failure to follow or request safety instructions.</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      5. Updates and Modifications
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>AKDI MAKINE may update or modify the Application at any time to improve functionality or security.</li>
                      <li>Continued use of the Application after updates constitutes acceptance of the revised Terms.</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      6. Limitation of Liability
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>The Application is provided “as is” without warranties of any kind.</li>
                      <li>AKDI MAKINE shall not be held liable for damages, losses, or injuries arising from improper use of the Application or machine.</li>
                      <li>Users assume full responsibility for compliance with safety and operational requirements.</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      7. Intellectual Property
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>The Application and its content are the property of AKDI MAKINE.</li>
                      <li>Unauthorized reproduction, distribution, or modification is prohibited.</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      8. Termination
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>AKDI MAKINE reserves the right to suspend or terminate access to the Application if these Terms are violated.</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      9. Governing Law
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>
                        These Terms shall be governed by and construed in accordance with the laws of the Republic of Türkiye. Any disputes arising under or in
                        connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Türkiye.
                      </li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      10. User Acknowledgment
                    </Typography>
                    <Typography variant='body1'>By using AKDI MAKINE, you acknowledge and confirm that:</Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>
                        You have received the necessary operating and safety instructions from AKDI MAKINE, or you have requested them if they were not
                        initially provided.
                      </li>
                      <li>
                        You understand and accept your responsibility to operate the Application and machine in accordance with these instructions and safety
                        measures.
                      </li>
                      <li>You agree that failure to obtain or follow instructions does not exempt you from liability or responsibility under these Terms.</li>
                    </ul>
                  </Box>

                  <Button variant='pastel' color='grey' startIcon={<Check size={16} />} onClick={() => navigate(-1)}>
                    Continue
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </OverlayScrollbarsComponent>
    </>
  );
}
