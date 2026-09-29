import { useState, type FormEvent } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Machine } from "@/icons/custom-lucide-icons/machine";
import { Alert, AlertTitle, Box, Button, Divider, FormControl, FormLabel, Input, Paper, Tooltip, Typography } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router";
import { LINKS, LOCAL_STORAGE_KEYS } from "@/constants";
import LogoVertical from "@/components/logo/logo-vertical";
import { Bookmark, Check, CheckCircle, ChevronLeft, ChevronRight, XCircle, XSquare } from "lucide-react";
import Header from "@/components/layout/containers/header";
import { useLocalStorage } from "react-use";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { probeMachine } from "@/mock/machine-probe";
import { cn } from "@/lib/utils";
import { useDb } from "@/context/db-context";
import useAppNotifications from "@/hooks/use-app-notifications";

type FlowScreen = "initial" | "success" | "error";

const validationSchema = yup.object({
  ipAddress: yup
    .string()
    .trim()
    .required("IP address is required")
    .test("ipv4", "Enter a valid IPv4 address", (value) => {
      if (!value) return false;
      const octets = value.split(".");
      return octets.length === 4 && octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) >= 0 && Number(octet) <= 255);
    }),
});

export default function Page() {
  const navigate = useNavigate();
  const { addMachine } = useDb();
  const { showError } = useAppNotifications();
  const [screen, setScreen] = useState<FlowScreen>("initial");
  const [machineName, setMachineName] = useState("");
  const [submittedIpAddress, setSubmittedIpAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSavingMachine, setIsSavingMachine] = useState(false);

  const [startupChoice, setStartupChoice] = useLocalStorage(LOCAL_STORAGE_KEYS.startupChoice, null);

  const handleContinueNoConnection = () => {
    setStartupChoice("continue-without-machine");
    navigate(LINKS.home, { replace: true });
  };

  const formik = useFormik<{ ipAddress: string }>({
    initialValues: { ipAddress: "" },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ ipAddress }) => {
      const result = await probeMachine(ipAddress);
      setSubmittedIpAddress(ipAddress);
      if (result.connected && result.machineName) {
        setMachineName(result.machineName);
        setScreen("success");
      } else {
        setScreen("error");
      }
    },
  });

  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    setSubmitted(true);
    formik.handleSubmit(event);
  };

  const handleBack = () => {
    setScreen("initial");
  };

  const handleComplete = async () => {
    setIsSavingMachine(true);
    try {
      await addMachine({ name: machineName, ipAddress: submittedIpAddress, connected: true });
      setStartupChoice("continue-with-machine");
      navigate(LINKS.home, { replace: true });
    } catch (error) {
      showError(`Failed to save machine: ${String(error)}`);
    } finally {
      setIsSavingMachine(false);
    }
  };
  if (startupChoice !== null) return <Navigate to={LINKS.home} replace />;

  const FlowInitial = () => {
    return (
      <Box className={cn("flex flex-col gap-10", formik.isSubmitting && "opacity-60")}>
        <Box className='flex flex-col'>
          <Typography variant='h3' component='h1' className='mb-2'>
            Welcome
          </Typography>
          <Typography variant='body1' className='text-text-primary'>
            Add a machine to get started. Make sure the machine and computer are on the same subnet.
          </Typography>
        </Box>

        <Box className='flex flex-col gap-5'>
          <Box component='form' className='flex flex-col' noValidate onSubmit={handleConnect}>
            <Box className='flex flex-row gap-2'>
              <Machine className={cn(submitted && formik.errors.ipAddress && "text-error!", "flex-none")} />
              <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                <FormLabel component='label' className={cn(submitted && formik.errors.ipAddress && "text-error!")}>
                  IP Address
                </FormLabel>
                <Input name='ipAddress' value={formik.values.ipAddress} onChange={formik.handleChange} />
              </FormControl>
            </Box>

            {submitted && !formik.isValid && (
              <Alert severity='error' icon={<XSquare />} className='neutral rounded-lg! bg-transparent! mb-2 mt-2 p-5 ms-6.5'>
                <AlertTitle variant='subtitle1' className='pt-0.5'>
                  The following inputs have errors!
                </AlertTitle>
                <Box className='flex flex-row gap-0.5'>
                  <Typography className='text-error'>IP Address:</Typography>
                  <Typography className='text-text-primary'>{formik.errors.ipAddress}</Typography>
                </Box>
              </Alert>
            )}

            <Box className='flex flex-row gap-2'>
              <ChevronRight className='opacity-0' />
              <Button type='submit' variant='contained' className='w-full mb-1 mt-4' endIcon={<ChevronRight size={14} />} loading={formik.isSubmitting} loadingPosition='center'>
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
      </Box>
    );
  };

  const FlowSuccess = () => {
    return (
      <Box className={cn("flex flex-col gap-10", formik.isSubmitting && "opacity-60")}>
        <Box className='flex flex-col'>
          <Typography variant='h3' component='h1' className='mb-2'>
            Connection Ready
          </Typography>
          <Box className='flex flex-row gap-2'>
            <CheckCircle className='flex-none text-success' />
            <Typography variant='body1' className='text-text-primary'>
              Machine found at the given IP Address with the following details, and it is ready to be connected.
            </Typography>
          </Box>
        </Box>

        <Box className='flex flex-col gap-5'>
          <Box component='form' className='flex flex-col' onSubmit={(event) => event.preventDefault()}>
            <Box className='flex flex-row gap-2'>
              <Machine className='flex-none' />
              <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                <FormLabel component='label'>IP Address</FormLabel>
                <Input readOnly value={formik.values.ipAddress} disabled />
              </FormControl>
            </Box>
            <Box className='flex flex-row gap-2'>
              <Bookmark className='flex-none' />
              <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                <FormLabel component='label'>Name</FormLabel>
                <Input readOnly value={machineName} disabled />
              </FormControl>
            </Box>

            <Box className='flex flex-row gap-2'>
              <Box className='w-5 flex-none'></Box>
              <Button type='button' variant='contained' className='w-full mb-1 mt-4' endIcon={<Check size={14} />} loading={isSavingMachine} onClick={handleComplete}>
                Complete
              </Button>
            </Box>

            <Box className='flex flex-row gap-2'>
              <Box className='w-5 flex-none'></Box>
              <Button variant='text' color='text-secondary' className='w-full mb-4' onClick={handleContinueNoConnection}>
                Continue without Connection
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const FlowError = () => {
    return (
      <Box className={cn("flex flex-col gap-10", formik.isSubmitting && "opacity-60")}>
        <Box className='flex flex-col'>
          <Typography variant='h3' component='h1' className='mb-2'>
            Machine not Found!
          </Typography>
          <Box className='flex flex-row gap-2'>
            <XCircle className='flex-none text-error' />
            <Box>
              <Typography variant='body1' className='text-text-primary'>
                No machines discovered at {submittedIpAddress}. Please make sure:
              </Typography>
              <ul className='list-disc [&>li]:ms-4'>
                <li>The ethernet cable is connected</li>
                <li>The IP Address is correct</li>
                <li>The machine and computer are on the same subnet</li>
              </ul>
            </Box>
          </Box>
        </Box>

        <Box className='flex flex-col gap-5'>
          <Box component='form' className='flex flex-col' noValidate onSubmit={handleConnect}>
            <Box className='flex flex-row gap-2'>
              <Machine className={cn(submitted && formik.errors.ipAddress && "text-error!", "flex-none")} />
              <FormControl className='outlined' variant='standard' size='small' fullWidth required>
                <FormLabel component='label' className={submitted && formik.errors.ipAddress ? "text-error!" : undefined}>
                  IP Address
                </FormLabel>
                <Input name='ipAddress' value={formik.values.ipAddress} onChange={formik.handleChange} />
              </FormControl>
            </Box>

            {submitted && !formik.isValid && (
              <Alert severity='error' icon={<XSquare />} className='neutral rounded-lg! bg-transparent! mb-2 mt-2 p-5 ms-6.5'>
                <AlertTitle variant='subtitle1' className='pt-0.5'>
                  The following inputs have errors!
                </AlertTitle>
                <Box className='flex flex-row gap-0.5'>
                  <Typography className='text-error'>IP Address:</Typography>
                  <Typography className='text-text-primary'>{formik.errors.ipAddress}</Typography>
                </Box>
              </Alert>
            )}

            <Box className='flex flex-row gap-2'>
              <Box className='w-5 flex-none'></Box>
              <Button type='submit' variant='contained' className='w-full mb-1 mt-4' endIcon={<ChevronRight size={14} />} loading={formik.isSubmitting} loadingPosition='center'>
                Connect
              </Button>
            </Box>

            <Box className='flex flex-row gap-2'>
              <Box className='w-5 flex-none'></Box>
              <Button variant='text' color='text-secondary' className='w-full mb-4' onClick={handleContinueNoConnection}>
                Continue without Connection
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <OverlayScrollbarsComponent defer className='h-dvh os-scrollbar-body'>
        <Header minimal />
        <Box className='bg-background flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-cover bg-fixed bg-center p-4'>
          <Paper elevation={3} className='bg-background-paper shadow-darker-xs w-lg max-w-full rounded-4xl py-10 relative'>
            {screen !== "initial" && (
              <Tooltip title='Back'>
                <Button
                  variant='text'
                  color='grey'
                  onClick={handleBack}
                  startIcon={
                    <Box className='flex h-5 w-5 items-center justify-center'>
                      <ChevronLeft size={14} />
                    </Box>
                  }
                  className='icon-only absolute top-4 left-4 flex-none'
                />
              </Tooltip>
            )}
            <Box className='flex flex-col gap-4 px-10'>
              <Box className='flex flex-col min-h-160'>
                <Box className='mb-14 flex justify-center'>
                  <LogoVertical />
                </Box>

                {screen === "initial" && FlowInitial()}
                {screen === "success" && FlowSuccess()}
                {screen === "error" && FlowError()}

                <Box className='flex flex-col gap-10 mt-auto'>
                  <Divider className='text-text-secondary my-0 text-sm'></Divider>
                  <Box className='flex flex-col'>
                    <Typography variant='body2' className='text-center text-text-secondary'>
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
