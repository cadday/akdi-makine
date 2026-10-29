import { useEffect, useRef, useState, type FormEvent, type SyntheticEvent } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  ClickAwayListener,
  Fade,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Check, CheckCircle, CheckCircle2, ChevronLeft, ChevronRight, ChevronsUpDown, X, XCircle, XSquare } from "lucide-react";
import { Machine } from "@/icons/custom-lucide-icons/machine";
import { useDb, type MachineRecord } from "@/context/db-context";
import useDeleteConfirmation from "@/hooks/use-delete-confirmation";
import useAppNotifications from "@/hooks/use-app-notifications";
import { usePlcData } from "@/context/plc-context";
import { cn } from "@/lib/utils";

type FlowScreen = "initial" | "connect" | "complete" | "error";

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

export default function Machines() {
  const { addMachine, deleteMachine, getMachineByIp, getMachines, setConnectedMachine } = useDb();
  const { showError } = useAppNotifications();
  const { connectionStatus } = usePlcData();
  const { requestDelete, dialog } = useDeleteConfirmation();
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<FlowScreen>("initial");
  const [machines, setMachines] = useState<MachineRecord[]>([]);
  const [submittedIpAddress, setSubmittedIpAddress] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSavingMachine, setIsSavingMachine] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const candidateTokenRef = useRef<string | null>(null);
  const lastConnectionErrorRef = useRef<string | null>(null);
  const connectedMachine = machines.find((machine) => machine.connected) ?? null;
  const selectedMachineIsOnline =
    connectionStatus.state === "online" && connectionStatus.ipAddress === connectedMachine?.ipAddress;
  const selectedMachineIsWorking = selectedMachineIsOnline && connectionStatus.plcWorking === true;

  const cancelCandidateConnection = async () => {
    const token = candidateTokenRef.current;
    if (!token) return;
    candidateTokenRef.current = null;
    await window.plcAPI.cancelConnection(token);
  };

  const formik = useFormik<{ ipAddress: string }>({
    initialValues: { ipAddress: "" },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ ipAddress }) => {
      const normalizedIpAddress = ipAddress.trim();
      setSubmittedIpAddress(normalizedIpAddress);
      try {
        const existingMachine = await getMachineByIp(normalizedIpAddress);
        if (existingMachine) {
          formik.setFieldError("ipAddress", "A machine with this IP address already exists.");
          setScreen("connect");
          return;
        }

        await cancelCandidateConnection();
        const prepared = await window.plcAPI.prepareConnection(normalizedIpAddress);
        candidateTokenRef.current = prepared.token;
        setSubmittedIpAddress(prepared.ipAddress);
        setConnectionError("");
        setScreen("complete");
      } catch (error) {
        setConnectionError(String(error));
        setScreen("error");
      }
    },
  });

  useEffect(() => {
    let cancelled = false;
    getMachines()
      .then((records) => {
        if (!cancelled) setMachines(records.sort((first, second) => Number(second.connected) - Number(first.connected)));
      })
      .catch((error: unknown) => showError(`Failed to load machines: ${String(error)}`));

    return () => {
      cancelled = true;
    };
  }, [connectionStatus.state, getMachines, open, showError]);

  useEffect(() => {
    if (connectionStatus.state !== "offline" || !connectionStatus.error) {
      lastConnectionErrorRef.current = null;
      return;
    }

    const errorKey = `${connectionStatus.ipAddress ?? ""}:${connectionStatus.error}`;
    if (lastConnectionErrorRef.current === errorKey) return;

    lastConnectionErrorRef.current = errorKey;
    const machine = connectionStatus.ipAddress ? ` to ${connectionStatus.ipAddress}` : "";
    showError(`PLC connection${machine} failed: ${connectionStatus.error}`);
  }, [connectionStatus.error, connectionStatus.ipAddress, connectionStatus.state, showError]);

  useEffect(
    () => () => {
      const token = candidateTokenRef.current;
      if (token) {
        void window.plcAPI.cancelConnection(token).catch((error: unknown) => console.error("Failed to cancel prepared PLC connection:", error));
      }
    },
    [],
  );

  const refreshMachines = async () => {
    const records = await getMachines();
    setMachines(records.sort((first, second) => Number(second.connected) - Number(first.connected)));
  };

  const handleToggle = () => {
    if (open) {
      void cancelCandidateConnection().catch((error: unknown) => showError(`Failed to cancel prepared PLC connection: ${String(error)}`));
      if (screen === "complete") setScreen("connect");
    }
    setOpen((previous) => !previous);
  };

  const handleClose = (event: Event | SyntheticEvent) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) return;
    setOpen(false);
    void cancelCandidateConnection().catch((error: unknown) => showError(`Failed to cancel prepared PLC connection: ${String(error)}`));
    if (screen === "complete") setScreen("connect");
  };

  const handleAddMachine = () => {
    formik.resetForm();
    setSubmitted(false);
    setSubmittedIpAddress("");
    setConnectionError("");
    setScreen("connect");
  };

  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setScreen("connect");
    void formik.submitForm();
  };

  const handleBack = () => {
    if (screen === "complete") {
      void cancelCandidateConnection().catch((error: unknown) => showError(`Failed to cancel prepared PLC connection: ${String(error)}`));
    }
    setScreen(screen === "connect" ? "initial" : "connect");
  };

  const handleSelectMachine = async (id: string | null) => {
    const previousMachine = connectedMachine;
    if (id === null) {
      try {
        await setConnectedMachine(null);
        await window.plcAPI.disconnect();
        await refreshMachines();
      } catch (error) {
        showError(`Failed to disconnect machine: ${String(error)}`);
      }
      return;
    }

    const machine = machines.find((record) => record.id === id);
    if (!machine) {
      showError("The selected machine is no longer available.");
      return;
    }

    let token: string | null = null;
    let selectionUpdated = false;
    try {
      const prepared = await window.plcAPI.prepareConnection(machine.ipAddress);
      token = prepared.token;
      await setConnectedMachine(id);
      selectionUpdated = true;
      await window.plcAPI.activateConnection(token);
    } catch (error) {
      const rollbackErrors: string[] = [];
      if (selectionUpdated) {
        try {
          await setConnectedMachine(previousMachine?.id ?? null);
        } catch (rollbackError) {
          rollbackErrors.push(`Could not restore the previous machine selection: ${String(rollbackError)}`);
        }
      }
      if (token) {
        try {
          await window.plcAPI.cancelConnection(token);
        } catch (rollbackError) {
          rollbackErrors.push(`Could not cancel the prepared connection: ${String(rollbackError)}`);
        }
      }
      showError([`Failed to connect to machine at ${machine.ipAddress}: ${String(error)}`, ...rollbackErrors].join(" "));
      return;
    }

    try {
      await refreshMachines();
    } catch (error) {
      showError(`Machine at ${machine.ipAddress} is connected, but the machine list could not be refreshed: ${String(error)}`);
    }
  };

  const handleDeleteMachine = (machine: MachineRecord) => {
    void requestDelete({
      title: "Delete machine",
      message: `Delete machine at ${machine.ipAddress}?`,
      errorMessage: "Failed to delete machine:",
      onConfirm: async () => {
        await deleteMachine(machine.id);
        if (machine.connected) await window.plcAPI.disconnect();
        await refreshMachines();
      },
    });
  };

  const handleComplete = async () => {
    const token = candidateTokenRef.current;
    if (!token) {
      setConnectionError("The prepared connection expired. Please connect again.");
      setScreen("error");
      return;
    }

    const previousMachine = connectedMachine;
    let addedMachineId: string | null = null;
    setIsSavingMachine(true);
    try {
      addedMachineId = await addMachine({ ipAddress: submittedIpAddress, connected: true });
      await window.plcAPI.activateConnection(token);
      candidateTokenRef.current = null;
    } catch (error) {
      const rollbackErrors: string[] = [];
      if (addedMachineId) {
        try {
          await deleteMachine(addedMachineId);
        } catch (rollbackError) {
          rollbackErrors.push(`Could not remove the newly added machine: ${String(rollbackError)}`);
        }
        try {
          await setConnectedMachine(previousMachine?.id ?? null);
        } catch (rollbackError) {
          rollbackErrors.push(`Could not restore the previous machine selection: ${String(rollbackError)}`);
        }
      }
      try {
        await window.plcAPI.cancelConnection(token);
        candidateTokenRef.current = null;
      } catch (rollbackError) {
        rollbackErrors.push(`Could not cancel the prepared connection: ${String(rollbackError)}`);
      }
      const message = [`Failed to save machine at ${submittedIpAddress}: ${String(error)}`, ...rollbackErrors].join(" ");
      setConnectionError(message);
      setScreen("error");
      showError(message);
      return;
    } finally {
      setIsSavingMachine(false);
    }

    try {
      await refreshMachines();
    } catch (error) {
      showError(`Machine at ${submittedIpAddress} was saved and connected, but the machine list could not be refreshed: ${String(error)}`);
    }
    formik.resetForm();
    setSubmitted(false);
    setScreen("initial");
  };

  const renderIpField = () => (
    <>
      <Box className='flex flex-row gap-2'>
        <Machine className={cn("flex-none", submitted && formik.errors.ipAddress && "text-error!")} />
        <FormControl className='outlined' variant='standard' size='small' fullWidth required>
          <FormLabel component='label' className={cn(submitted && formik.errors.ipAddress && "text-error!")}>
            IP Address
          </FormLabel>
          <Input
            name='ipAddress'
            value={formik.values.ipAddress}
            onChange={(event) => {
              formik.handleChange(event);
              if (formik.errors.ipAddress) formik.setFieldError("ipAddress", undefined);
            }}
          />
        </FormControl>
      </Box>
      {submitted && formik.errors.ipAddress && (
        <Alert severity='error' icon={<XSquare />} className='neutral rounded-lg! bg-transparent! mb-2 mt-2 p-4 ms-6.5'>
          <AlertTitle variant='subtitle1' className='pt-0.5'>
            The following inputs have errors!
          </AlertTitle>
          <Box className='flex flex-row gap-0.5'>
            <Typography className='text-error flex-none'>IP Address:</Typography>
            <Typography className='text-text-primary flex-1'>{formik.errors.ipAddress}</Typography>
          </Box>
        </Alert>
      )}
    </>
  );

  const FlowInitial = () => (
    <>
      <Box className='flex flex-1 flex-row items-start justify-between pe-4'>
        <Typography variant='h6' component='h6' className='card-title px-4 pt-4'>
          Machines
        </Typography>
      </Box>
      <Box className='mb-4'>
        <List className='max-h-72 overflow-auto'>
          {machines.map((machine) => (
            <ListItem key={machine.id} className='py-0 px-0 relative items-center'>
              <ListItemButton onClick={() => void handleSelectMachine(machine.id)} classes={{ root: "group items-center py-3! cursor-default" }}>
                <ListItemAvatar className='me-2'>
                  {selectedMachineIsWorking ? (
                    <CheckCircle2 className='text-success' />
                  ) : machine.connected && selectedMachineIsOnline ? (
                    <XCircle className='text-error' />
                  ) : (
                    <XCircle className='text-text-disabled' />
                  )}
                </ListItemAvatar>
                <ListItemText slotProps={{ primary: { className: "flex flex-row gap-0.5" } }}>
                  <Typography variant='subtitle1'>{machine.ipAddress}</Typography>
                </ListItemText>
              </ListItemButton>
              <Box className='flex flex-row gap-1 absolute inset-e-4'>
                {machine.connected && selectedMachineIsOnline ? (
                  <Tooltip title='Disconnect'>
                    <Button
                      onClick={() => void handleSelectMachine(null)}
                      className='hover:text-text-primary hover:bg-grey-100 min-w-22'
                      size='tiny'
                      color='grey'
                      variant='pastel'
                    >
                      Connected
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    onClick={() => void handleSelectMachine(machine.id)}
                    className='hover:text-text-primary hover:bg-grey-100 min-w-22'
                    size='tiny'
                    color='grey'
                    variant='outlined'
                  >
                    Connect
                  </Button>
                )}
                <Tooltip title='Delete'>
                  <Button
                    onClick={() => handleDeleteMachine(machine)}
                    className='icon-only hover:text-error hover:border-error-light/5 hover:bg-error-light/10'
                    size='tiny'
                    color='grey'
                    variant='outlined'
                    startIcon={<X size={16} />}
                  />
                </Tooltip>
              </Box>
            </ListItem>
          ))}
        </List>
        {machines.length === 0 && <Typography className='px-4 py-3 pb-0'>No machines found!</Typography>}
      </Box>
      <CardActions disableSpacing>
        <Button onClick={handleAddMachine} variant='outlined' size='tiny' color='grey' className='w-full'>
          Add Machine
        </Button>
      </CardActions>
    </>
  );

  const FlowConnect = () => (
    <>
      <Box className='flex flex-1 flex-row items-start px-4 pt-4 gap-0.5'>
        <Button
          onClick={handleBack}
          aria-label='Back to machines'
          className='icon-only -ml-1.5 -mt-1'
          size='small'
          color='grey'
          variant='text'
          startIcon={<ChevronLeft size={16} />}
        />
        <Typography variant='h6' component='h6' className='card-title'>
          Add Machine
        </Typography>
      </Box>
      <Box component='form' noValidate onSubmit={handleConnect}>
        <Box className='px-4'>{renderIpField()}</Box>
        <CardActions disableSpacing>
          <Box className='flex flex-row gap-2 w-full'>
            <ChevronRight className='opacity-0' />
            <Button
              type='submit'
              size='tiny'
              color='grey'
              variant='pastel'
              className='w-full flex-1'
              endIcon={<ChevronRight size={14} />}
              loading={formik.isSubmitting}
              loadingPosition='center'
            >
              Connect
            </Button>
          </Box>
        </CardActions>
      </Box>
    </>
  );

  const FlowComplete = () => (
    <>
      <Box className='flex flex-1 flex-row items-start px-4 pt-4 gap-0.5'>
        <Button
          onClick={handleBack}
          aria-label='Back to IP address'
          className='icon-only -ml-1.5 -mt-1'
          size='small'
          color='grey'
          variant='text'
          startIcon={<ChevronLeft size={16} />}
        />
        <Typography variant='h6' component='h6' className='card-title'>
          Connection Ready
        </Typography>
      </Box>
      <Box className='flex flex-row gap-2 px-4 mb-4'>
        <CheckCircle className='flex-none text-success' />
        <Typography variant='body1' className='text-text-primary'>
          A TCP connection to this machine succeeded. Complete to save and select this IP address.
        </Typography>
      </Box>
      <Box className='px-4'>
        <Box className='flex flex-row gap-2'>
          <Machine className='flex-none' />
          <FormControl className='outlined' variant='standard' size='small' fullWidth required>
            <FormLabel component='label'>IP Address</FormLabel>
            <Input name='ipAddress' value={submittedIpAddress} disabled />
          </FormControl>
        </Box>
      </Box>
      <CardActions disableSpacing>
        <Box className='flex flex-row gap-2 w-full'>
          <ChevronRight className='opacity-0' />
          <Button
            onClick={() => void handleComplete()}
            type='button'
            size='tiny'
            color='grey'
            variant='pastel'
            className='w-full flex-1'
            endIcon={<Check size={14} />}
            loading={isSavingMachine}
            loadingPosition='center'
          >
            Complete
          </Button>
        </Box>
      </CardActions>
    </>
  );

  const FlowError = () => (
    <>
      <Box className='flex flex-1 flex-row items-start px-4 pt-4 gap-0.5'>
        <Button
          onClick={handleBack}
          aria-label='Back to IP address'
          className='icon-only -ml-1.5 -mt-1'
          size='small'
          color='grey'
          variant='text'
          startIcon={<ChevronLeft size={16} />}
        />
        <Typography variant='h6' component='h6' className='card-title'>
          Machine not Found!
        </Typography>
      </Box>
      <Box className='flex flex-row gap-2 px-4 mb-4'>
        <XCircle className='flex-none text-error' />
        <Box>
          <Typography variant='body1' className='text-text-primary'>
            Could not connect to {submittedIpAddress}: {connectionError || "the machine did not accept a TCP connection on port 502."} Please check:
          </Typography>
          <ul className='list-disc [&>li]:ms-4'>
            <li>The ethernet cable is connected</li>
            <li>The IP Address is correct</li>
            <li>The machine and computer are on the same subnet</li>
          </ul>
        </Box>
      </Box>
      <Box component='form' noValidate onSubmit={handleConnect}>
        <Box className='px-4'>{renderIpField()}</Box>
        <CardActions disableSpacing>
          <Box className='flex flex-row gap-2 w-full'>
            <ChevronRight className='opacity-0' />
            <Button
              type='submit'
              size='tiny'
              color='grey'
              variant='pastel'
              className='w-full flex-1'
              endIcon={<ChevronRight size={14} />}
              loading={formik.isSubmitting}
              loadingPosition='center'
            >
              Connect
            </Button>
          </Box>
        </CardActions>
      </Box>
    </>
  );

  return (
    <>
      {dialog}
      <Button
        ref={anchorRef}
        onClick={handleToggle}
        size='large'
        variant='pastel'
        color='grey'
        className={cn("px-4 hover:bg-grey-50", open && "active bg-grey-50")}
        startIcon={
          <Box className='w-6 h-6 flex items-center justify-center'>
            {selectedMachineIsWorking ? <CheckCircle2 className='text-success' /> : <XCircle className='text-error' />}
          </Box>
        }
        endIcon={
          <Box className='w-6 h-6 flex items-center justify-center'>
            <ChevronsUpDown size={16} />
          </Box>
        }
      >
        <Box className='flex flex-row gap-0.5'>
          {connectedMachine ? (
            <>
              <Typography variant='subtitle2'>{connectedMachine.ipAddress}</Typography>
            </>
          ) : (
            <Typography variant='subtitle2'>No connection!</Typography>
          )}
        </Box>
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement='bottom-end' className='mt-1!' transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box>
              <ClickAwayListener onClickAway={handleClose}>
                <Card className='shadow-darker-sm! w-md outline outline-grey-50'>
                  {screen === "initial" && FlowInitial()}
                  {screen === "connect" && FlowConnect()}
                  {screen === "complete" && FlowComplete()}
                  {screen === "error" && FlowError()}
                </Card>
              </ClickAwayListener>
            </Box>
          </Fade>
        )}
      </Popper>
    </>
  );
}
