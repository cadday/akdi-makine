import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import { Machine } from '@/icons/custom-lucide-icons/machine';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router';
import { LINKS, LOCAL_STORAGE_KEYS } from '@/constants';
import { setClientLocale } from '@/i18n/locale';
import LogoVertical from '@/components/logo/logo-vertical';
import { Check, CheckCircle, ChevronLeft, ChevronRight, XCircle, XSquare } from 'lucide-react';
import Header from '@/components/layout/containers/header';
import { useLocalStorage } from 'react-use';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { cn } from '@/lib/utils';
import { useDb } from '@/context/db-context';
import useAppNotifications from '@/hooks/use-app-notifications';

type FlowScreen = 'initial' | 'success' | 'error';

export default function Page() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addMachine, deleteMachine, getConnectedMachine, getMachineByIp, setConnectedMachine } = useDb();
  const { showError } = useAppNotifications();
  const [screen, setScreen] = useState<FlowScreen>('initial');
  const [submittedIpAddress, setSubmittedIpAddress] = useState('');
  const [connectionError, setConnectionError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSavingMachine, setIsSavingMachine] = useState(false);
  const candidateTokenRef = useRef<string | null>(null);

  const [startupChoice, setStartupChoice] = useLocalStorage(LOCAL_STORAGE_KEYS.startupChoice, null);
  const validationSchema = yup.object({
    ipAddress: yup
      .string()
      .trim()
      .required(t('machine-ip-required'))
      .test('ipv4', t('machine-ip-invalid'), (value) => {
        if (!value) return false;
        const octets = value.split('.');
        return (
          octets.length === 4 &&
          octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) >= 0 && Number(octet) <= 255)
        );
      }),
  });

  const handleContinueNoConnection = () => {
    const token = candidateTokenRef.current;
    candidateTokenRef.current = null;
    if (token) {
      void window.plcAPI
        .cancelConnection(token)
        .catch((error: unknown) => showError(t('machine-cancel-prepared-error', { error: String(error) })));
    }
    setStartupChoice('continue-without-machine');
    navigate(LINKS.home, { replace: true });
  };

  const formik = useFormik<{ ipAddress: string }>({
    initialValues: { ipAddress: '' },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ ipAddress }) => {
      try {
        const existingMachine = await getMachineByIp(ipAddress);
        if (existingMachine) throw new Error(t('machine-duplicate-ip'));

        const prepared = await window.plcAPI.prepareConnection(ipAddress);
        candidateTokenRef.current = prepared.token;
        setSubmittedIpAddress(prepared.ipAddress);
        setConnectionError('');
        setScreen('success');
      } catch (error) {
        setSubmittedIpAddress(ipAddress.trim());
        setConnectionError(String(error));
        setScreen('error');
      }
    },
  });

  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    setSubmitted(true);
    formik.handleSubmit(event);
  };

  const { validateForm } = formik;
  useEffect(() => {
    void validateForm();
  }, [i18n.language, validateForm]);

  const handleBack = () => {
    const token = candidateTokenRef.current;
    candidateTokenRef.current = null;
    if (token) {
      void window.plcAPI
        .cancelConnection(token)
        .catch((error: unknown) => showError(t('machine-cancel-prepared-error', { error: String(error) })));
    }
    setScreen('initial');
  };

  const handleComplete = async () => {
    const token = candidateTokenRef.current;
    if (!token) {
      setConnectionError(t('machine-connection-expired'));
      setScreen('error');
      return;
    }

    let addedMachineId: string | null = null;
    let previousMachineId: string | null = null;
    setIsSavingMachine(true);
    try {
      const previousMachine = await getConnectedMachine();
      previousMachineId = previousMachine?.id ?? null;
      addedMachineId = await addMachine({ ipAddress: submittedIpAddress, connected: true });
      await window.plcAPI.activateConnection(token);
      candidateTokenRef.current = null;
    } catch (error) {
      const rollbackErrors: string[] = [];
      if (addedMachineId) {
        try {
          await deleteMachine(addedMachineId);
        } catch (rollbackError) {
          rollbackErrors.push(t('machine-remove-added-error', { error: String(rollbackError) }));
        }
        try {
          await setConnectedMachine(previousMachineId);
        } catch (rollbackError) {
          rollbackErrors.push(t('machine-restore-previous-error', { error: String(rollbackError) }));
        }
      }
      try {
        await window.plcAPI.cancelConnection(token);
        candidateTokenRef.current = null;
      } catch (rollbackError) {
        rollbackErrors.push(t('machine-cancel-prepared-error', { error: String(rollbackError) }));
      }
      const saveError = t('machine-save-error', { ipAddress: submittedIpAddress, error: String(error) });
      const message = rollbackErrors.length
        ? t('error-with-rollback', { error: saveError, rollbackErrors: rollbackErrors.join(' ') })
        : saveError;
      setConnectionError(message);
      setScreen('error');
      showError(message);
      return;
    } finally {
      setIsSavingMachine(false);
    }

    try {
      setStartupChoice('continue-with-machine');
    } catch (error) {
      showError(t('machine-startup-preference-error', { error: String(error) }));
    }
    navigate(LINKS.home, { replace: true });
  };

  useEffect(
    () => () => {
      const token = candidateTokenRef.current;
      if (token) {
        void window.plcAPI
          .cancelConnection(token)
          .catch((error: unknown) => console.error('Failed to cancel prepared PLC connection:', error));
      }
    },
    [],
  );
  if (startupChoice !== null) return <Navigate to={LINKS.home} replace />;

  const FlowInitial = () => {
    return (
      <Box className={cn('flex flex-col gap-10', formik.isSubmitting && 'opacity-60')}>
        <Box className="flex flex-col">
          <Typography variant="h3" component="h1" className="mb-2">
            {t('machine-welcome')}
          </Typography>
          <Typography variant="body1" className="text-text-primary">
            {t('machine-welcome-description')}
          </Typography>
        </Box>

        <Box className="flex flex-col gap-5">
          <Box component="form" className="flex flex-col" noValidate onSubmit={handleConnect}>
            <Box className="flex flex-row gap-2">
              <Machine className={cn(submitted && formik.errors.ipAddress && 'text-error!', 'flex-none')} />
              <FormControl className="outlined" variant="standard" size="small" fullWidth required>
                <FormLabel component="label" className={cn(submitted && formik.errors.ipAddress && 'text-error!')}>
                  {t('machine-ip-address')}
                </FormLabel>
                <Input name="ipAddress" value={formik.values.ipAddress} onChange={formik.handleChange} />
              </FormControl>
            </Box>

            {submitted && !formik.isValid && (
              <Alert
                severity="error"
                icon={<XSquare />}
                className="neutral rounded-lg! bg-transparent! mb-2 mt-2 p-5 ms-6.5"
              >
                <AlertTitle variant="subtitle1" className="pt-0.5">
                  {t('machine-validation-error-summary')}
                </AlertTitle>
                <Box className="flex flex-row gap-0.5">
                  <Typography className="text-error">{t('machine-ip-address')}:</Typography>
                  <Typography className="text-text-primary">{formik.errors.ipAddress}</Typography>
                </Box>
              </Alert>
            )}

            <Box className="flex flex-row gap-2">
              <ChevronRight className="opacity-0" />
              <Button
                type="submit"
                variant="contained"
                className="w-full mb-1 mt-4"
                endIcon={<ChevronRight size={14} />}
                loading={formik.isSubmitting}
                loadingPosition="center"
              >
                {t('connect')}
              </Button>
            </Box>

            <Box className="flex flex-row gap-2">
              <ChevronRight className="opacity-0" />
              <Button
                variant="text"
                color="text-secondary"
                className="w-full mb-4"
                onClick={handleContinueNoConnection}
              >
                {t('machine-continue-without-connection')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const FlowSuccess = () => {
    return (
      <Box className={cn('flex flex-col gap-10', formik.isSubmitting && 'opacity-60')}>
        <Box className="flex flex-col">
          <Typography variant="h3" component="h1" className="mb-2">
            {t('connection-ready')}
          </Typography>
          <Box className="flex flex-row gap-2">
            <CheckCircle className="flex-none text-success" />
            <Typography variant="body1" className="text-text-primary">
              {t('machine-connection-ready-description')}
            </Typography>
          </Box>
        </Box>

        <Box className="flex flex-col gap-5">
          <Box component="form" className="flex flex-col" onSubmit={(event) => event.preventDefault()}>
            <Box className="flex flex-row gap-2">
              <Machine className="flex-none" />
              <FormControl className="outlined" variant="standard" size="small" fullWidth required>
                <FormLabel component="label">{t('machine-ip-address')}</FormLabel>
                <Input readOnly value={formik.values.ipAddress} disabled />
              </FormControl>
            </Box>
            <Box className="flex flex-row gap-2">
              <Box className="w-5 flex-none"></Box>
              <Button
                type="button"
                variant="contained"
                className="w-full mb-1 mt-4"
                endIcon={<Check size={14} />}
                loading={isSavingMachine}
                onClick={handleComplete}
              >
                {t('complete')}
              </Button>
            </Box>

            <Box className="flex flex-row gap-2">
              <Box className="w-5 flex-none"></Box>
              <Button
                variant="text"
                color="text-secondary"
                className="w-full mb-4"
                onClick={handleContinueNoConnection}
              >
                {t('machine-continue-without-connection')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const FlowError = () => {
    return (
      <Box className={cn('flex flex-col gap-10', formik.isSubmitting && 'opacity-60')}>
        <Box className="flex flex-col">
          <Typography variant="h3" component="h1" className="mb-2">
            {t('machine-not-found')}
          </Typography>
          <Box className="flex flex-row gap-2">
            <XCircle className="flex-none text-error" />
            <Box>
              <Typography variant="body1" className="text-text-primary">
                {t('machine-flow-connect-error', {
                  ipAddress: submittedIpAddress,
                  error: connectionError || t('machine-flow-connect-default-error'),
                })}
              </Typography>
              <ul className="list-disc [&>li]:ms-4">
                <li>{t('machine-check-ethernet')}</li>
                <li>{t('machine-check-ip')}</li>
                <li>{t('machine-check-subnet')}</li>
              </ul>
            </Box>
          </Box>
        </Box>

        <Box className="flex flex-col gap-5">
          <Box component="form" className="flex flex-col" noValidate onSubmit={handleConnect}>
            <Box className="flex flex-row gap-2">
              <Machine className={cn(submitted && formik.errors.ipAddress && 'text-error!', 'flex-none')} />
              <FormControl className="outlined" variant="standard" size="small" fullWidth required>
                <FormLabel
                  component="label"
                  className={submitted && formik.errors.ipAddress ? 'text-error!' : undefined}
                >
                  {t('machine-ip-address')}
                </FormLabel>
                <Input name="ipAddress" value={formik.values.ipAddress} onChange={formik.handleChange} />
              </FormControl>
            </Box>

            {submitted && !formik.isValid && (
              <Alert
                severity="error"
                icon={<XSquare />}
                className="neutral rounded-lg! bg-transparent! mb-2 mt-2 p-5 ms-6.5"
              >
                <AlertTitle variant="subtitle1" className="pt-0.5">
                  {t('machine-validation-error-summary')}
                </AlertTitle>
                <Box className="flex flex-row gap-0.5">
                  <Typography className="text-error">{t('machine-ip-address')}:</Typography>
                  <Typography className="text-text-primary">{formik.errors.ipAddress}</Typography>
                </Box>
              </Alert>
            )}

            <Box className="flex flex-row gap-2">
              <Box className="w-5 flex-none"></Box>
              <Button
                type="submit"
                variant="contained"
                className="w-full mb-1 mt-4"
                endIcon={<ChevronRight size={14} />}
                loading={formik.isSubmitting}
                loadingPosition="center"
              >
                {t('connect')}
              </Button>
            </Box>

            <Box className="flex flex-row gap-2">
              <Box className="w-5 flex-none"></Box>
              <Button
                variant="text"
                color="text-secondary"
                className="w-full mb-4"
                onClick={handleContinueNoConnection}
              >
                {t('machine-continue-without-connection')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <OverlayScrollbarsComponent defer className="h-dvh os-scrollbar-body">
        <Header minimal />
        <Box className="bg-background flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-cover bg-fixed bg-center p-4">
          <Paper
            elevation={3}
            className="bg-background-paper shadow-darker-xs w-lg max-w-full rounded-4xl py-10 relative"
          >
            {screen !== 'initial' && (
              <Tooltip title={t('back')}>
                <Button
                  variant="text"
                  color="grey"
                  onClick={handleBack}
                  startIcon={
                    <Box className="flex h-5 w-5 items-center justify-center">
                      <ChevronLeft size={14} />
                    </Box>
                  }
                  className="icon-only absolute top-4 left-4 flex-none"
                />
              </Tooltip>
            )}
            <Box className="flex flex-col gap-4 px-10">
              <Box className="flex flex-col min-h-160">
                <Box className="mb-14 flex justify-center">
                  <LogoVertical />
                </Box>

                {screen === 'initial' && FlowInitial()}
                {screen === 'success' && FlowSuccess()}
                {screen === 'error' && FlowError()}

                <Box className="flex flex-col gap-6 mt-auto">
                  <Box className="flex flex-row gap-1 items-start justify-center">
                    <Button
                      variant="outlined"
                      size="small"
                      color="grey"
                      className={cn(i18n.language.startsWith('tr') && 'text-primary pointer-events-none')}
                      aria-pressed={i18n.language.startsWith('tr')}
                      onClick={() => setClientLocale('tr')}
                    >
                      TR
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="grey"
                      className={cn(i18n.language.startsWith('en') && 'text-primary pointer-events-none')}
                      aria-pressed={i18n.language.startsWith('en')}
                      onClick={() => setClientLocale('en')}
                    >
                      EN
                    </Button>
                  </Box>
                  <Divider className="text-text-secondary my-0 text-sm"></Divider>
                  <Box className="flex flex-col">
                    <Typography variant="body2" className="text-center text-text-secondary">
                      <Trans
                        i18nKey="machine-terms-notice"
                        components={{
                          terms: <Link to="/terms-and-conditions" className="link-primary link-underline-hover" />,
                        }}
                      />
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
