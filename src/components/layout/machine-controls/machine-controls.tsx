import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { useLocation } from 'react-router';
import {
  Box,
  Button,
  Card,
  ClickAwayListener,
  CircularProgress,
  Fade,
  Paper,
  Popper,
  Tooltip,
  Typography,
} from '@mui/material';
import { liveQuery } from 'dexie';
import { ArrowBigDown, ArrowBigUp, OctagonX, Play, Ruler, Square, TriangleAlert, Weight } from 'lucide-react';
import QuickTestForm from '@/pages/app/overview/components/quick-test-form';
import { useTestRun } from '@/context/test-run-context';
import { useDb } from '@/context/db-context';
import useAppNotifications from '@/hooks/use-app-notifications';
import { NoWayToTest } from '@/pages/app/components/no-entity-found';
import { isMachineInterlocked, usePlcData } from '@/context/plc-context';

const PLC_OVERVIEW_POLL_INTERVAL_MS = 100;
const PLC_LOAD_SCALE_DIVISOR = 10;
const PLC_DISTANCE_SCALE_DIVISOR = 10000;

export default function MachineControls() {
  const [quickTestOpen, setQuickTestOpen] = useState(false);
  const [quickTestTooltipOpen, setQuickTestTooltipOpen] = useState(false);
  const [quickTestCounts, setQuickTestCounts] = useState<{ specimens: number; presets: number } | null>(null);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [countsLoadError, setCountsLoadError] = useState(false);
  const [hasConnectedMachine, setHasConnectedMachine] = useState(false);
  const [plcValues, setPlcValues] = useState<{ ipAddress: string; values: PlcOverviewValues } | null>(null);
  const [emergencyHaltActive, setEmergencyHaltActive] = useState(false);
  const quickTestAnchorRef = useRef<HTMLButtonElement>(null);
  const moveUpPressedRef = useRef(false);
  const moveDownPressedRef = useRef(false);
  const readInFlightRef = useRef(false);
  const { db, getRecordCounts } = useDb();
  const { showError } = useAppNotifications();
  const { connectionStatus, interlockStatus, updateInterlockStatus } = usePlcData();
  const { pathname } = useLocation();
  const { hasActiveTest, stopActiveTest } = useTestRun();
  const machineControlsDisabled = !hasConnectedMachine || connectionStatus.state !== 'online';
  const machineInterlocked = isMachineInterlocked(interlockStatus) || emergencyHaltActive;
  const interlockStatusUnavailable = connectionStatus.state === 'online' && !interlockStatus;
  const testCreationDisabled = machineInterlocked || interlockStatusUnavailable;
  const manualControlsDisabled =
    machineControlsDisabled || hasActiveTest || machineInterlocked || interlockStatusUnavailable;

  useEffect(() => {
    const { ipAddress, state } = connectionStatus;
    if (state !== 'online' || !ipAddress) return;

    let cancelled = false;
    let hasReportedReadError = false;
    const readValues = async () => {
      if (cancelled || readInFlightRef.current) return;
      readInFlightRef.current = true;

      try {
        const values = await window.plcAPI.readOverviewValues();
        if (cancelled) return;
        setPlcValues({ ipAddress, values });
        setEmergencyHaltActive(values.emergencyHaltActive);
        updateInterlockStatus(ipAddress, {
          emergencyHaltActive: values.emergencyHaltActive,
          machineHalted: values.machineHalted,
        });
        hasReportedReadError = false;
      } catch (error: unknown) {
        if (!cancelled) updateInterlockStatus(ipAddress, null);
        if (!cancelled && !hasReportedReadError) {
          showError(`Failed to read PLC overview values: ${String(error)}`);
          hasReportedReadError = true;
        }
      } finally {
        readInFlightRef.current = false;
      }
    };

    void readValues();
    const intervalId = window.setInterval(() => {
      void readValues();
    }, PLC_OVERVIEW_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [connectionStatus, showError, updateInterlockStatus]);

  const displayedPlcValues =
    connectionStatus.state === 'online' && plcValues?.ipAddress === connectionStatus.ipAddress
      ? plcValues.values
      : null;

  useEffect(() => {
    const subscription = liveQuery(async () =>
      (await db.machines.toArray()).some((machine) => machine.connected),
    ).subscribe({
      next: setHasConnectedMachine,
      error: (error: unknown) => showError(`Failed to check connected machines: ${String(error)}`),
    });

    return () => subscription.unsubscribe();
  }, [db, showError]);

  useEffect(() => {
    if (!quickTestOpen) return;

    let cancelled = false;
    setQuickTestCounts(null);
    setCountsLoadError(false);
    setIsLoadingCounts(true);
    getRecordCounts()
      .then(({ specimens, presets }) => {
        if (!cancelled) setQuickTestCounts({ specimens, presets });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setCountsLoadError(true);
        showError(`Failed to load Quick Test options: ${String(error)}`);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCounts(false);
      });

    return () => {
      cancelled = true;
    };
  }, [getRecordCounts, quickTestOpen, showError]);

  useEffect(() => {
    setQuickTestOpen(false);
  }, [pathname]);

  const handleQuickTestClose = (event: Event | SyntheticEvent) => {
    if (quickTestAnchorRef.current?.contains(event.target as HTMLElement)) return;
    setQuickTestOpen(false);
  };

  const releaseMoveUp = useCallback(() => {
    if (!moveUpPressedRef.current) return;
    moveUpPressedRef.current = false;
    void window.plcAPI
      .setMoveUp(false)
      .catch((error: unknown) => showError(`Failed to stop upward movement: ${String(error)}`));
  }, [showError]);

  const releaseMoveDown = useCallback(() => {
    if (!moveDownPressedRef.current) return;
    moveDownPressedRef.current = false;
    void window.plcAPI
      .setMoveDown(false)
      .catch((error: unknown) => showError(`Failed to stop downward movement: ${String(error)}`));
  }, [showError]);

  const pressMoveUp = useCallback(() => {
    if (manualControlsDisabled || moveUpPressedRef.current) return;
    moveUpPressedRef.current = true;
    void window.plcAPI.setMoveUp(true).catch((error: unknown) => {
      const releaseAfterFailure = moveUpPressedRef.current;
      moveUpPressedRef.current = false;
      if (releaseAfterFailure) {
        void window.plcAPI
          .setMoveUp(false)
          .catch((releaseError: unknown) => showError(`Failed to clear the Move Up command: ${String(releaseError)}`));
      }
      showError(`Failed to start upward movement: ${String(error)}`);
    });
  }, [manualControlsDisabled, showError]);

  const pressMoveDown = useCallback(() => {
    if (manualControlsDisabled || moveDownPressedRef.current) return;
    moveDownPressedRef.current = true;
    void window.plcAPI.setMoveDown(true).catch((error: unknown) => {
      const releaseAfterFailure = moveDownPressedRef.current;
      moveDownPressedRef.current = false;
      if (releaseAfterFailure) {
        void window.plcAPI
          .setMoveDown(false)
          .catch((releaseError: unknown) =>
            showError(`Failed to clear the Move Down command: ${String(releaseError)}`),
          );
      }
      showError(`Failed to start downward movement: ${String(error)}`);
    });
  }, [manualControlsDisabled, showError]);

  const triggerResetLoad = useCallback(() => {
    if (manualControlsDisabled) return;
    void window.plcAPI
      .resetLoad()
      .catch((error: unknown) => showError(`Failed to activate Reset Load: ${String(error)}`));
  }, [manualControlsDisabled, showError]);

  const triggerResetStroke = useCallback(() => {
    if (manualControlsDisabled) return;
    void window.plcAPI
      .resetStroke()
      .catch((error: unknown) => showError(`Failed to activate Reset Stroke: ${String(error)}`));
  }, [manualControlsDisabled, showError]);

  const handleMachineHalt = useCallback(() => {
    if (machineControlsDisabled || !interlockStatus || isMachineInterlocked(interlockStatus)) return;
    void window.plcAPI.haltMachine().catch((error: unknown) => showError(`Failed to halt machine: ${String(error)}`));
  }, [interlockStatus, machineControlsDisabled, showError]);

  const handleMachineResume = useCallback(() => {
    if (machineControlsDisabled || !interlockStatus?.machineHalted || interlockStatus.emergencyHaltActive) return;
    void window.plcAPI
      .resumeMachine()
      .catch((error: unknown) => showError(`Failed to resume machine: ${String(error)}`));
  }, [interlockStatus, machineControlsDisabled, showError]);

  useEffect(() => {
    if (manualControlsDisabled) {
      releaseMoveUp();
      releaseMoveDown();
    }
  }, [manualControlsDisabled, releaseMoveDown, releaseMoveUp]);

  // Clear a held command if the user leaves the window or the controls unmount.
  useEffect(() => {
    const releaseMomentaryCommands = () => {
      releaseMoveUp();
      releaseMoveDown();
    };
    window.addEventListener('blur', releaseMomentaryCommands);
    return () => {
      window.removeEventListener('blur', releaseMomentaryCommands);
      releaseMomentaryCommands();
    };
  }, [releaseMoveDown, releaseMoveUp]);

  return (
    <Paper className="items-center flex flex-row p-2 fixed bottom-2 left-1/2 rounded-xl -translate-x-1/2 z-5005  gap-4 shadow-darker-md outline outline-grey-100">
      {/* <Paper className="no-drag items-center flex flex-row gap-4 bg-transparent me-4 shadow-none!"> */}
      {emergencyHaltActive ? (
        <Box className="text-error bg-error-light/10 h-10 font-semibold flex flex-row gap-2 items-center px-6 rounded-md">
          <OctagonX></OctagonX>
          <Box>Emergency halt is active, release it on the machine if it is safe!</Box>
        </Box>
      ) : (
        <Box className={'flex flex-row'}>
          <Box className="flex flex-row">
            <Tooltip title="Quick Test" placement="top" open={quickTestTooltipOpen}>
              <span
                className="inline-flex"
                onMouseEnter={() => setQuickTestTooltipOpen(true)}
                onMouseLeave={() => setQuickTestTooltipOpen(false)}
              >
                <Button
                  ref={quickTestAnchorRef}
                  onClick={() => {
                    setQuickTestTooltipOpen(false);
                    setQuickTestOpen((open) => !open);
                  }}
                  disabled={machineControlsDisabled || hasActiveTest || testCreationDisabled}
                  variant="text"
                  size="large"
                  color="grey"
                  className="icon-only"
                  startIcon={<Play />}
                />
              </span>
            </Tooltip>
            <Tooltip title="Stop Test" placement="top">
              <span className="inline-flex">
                <Button
                  onClick={stopActiveTest}
                  disabled={machineControlsDisabled || !hasActiveTest}
                  variant="text"
                  size="large"
                  color="grey"
                  className="icon-only"
                  startIcon={<Square size={18} />}
                />
              </span>
            </Tooltip>
          </Box>
          <Box className="flex flex-row">
            <Tooltip title="Reset Load" placement="top">
              <span className="inline-flex">
                <Button
                  type="button"
                  aria-label="Reset Load"
                  disabled={manualControlsDisabled}
                  onClick={triggerResetLoad}
                  variant="text"
                  size="large"
                  color="grey"
                  className="icon-only"
                  startIcon={<Weight />}
                />
              </span>
            </Tooltip>
            <Tooltip title="Reset Stroke" placement="top">
              <span className="inline-flex">
                <Button
                  type="button"
                  aria-label="Reset Stroke"
                  disabled={manualControlsDisabled}
                  onClick={triggerResetStroke}
                  variant="text"
                  size="large"
                  color="grey"
                  className="icon-only"
                  startIcon={<Ruler />}
                />
              </span>
            </Tooltip>
          </Box>
          <Box className="flex flex-row">
            <Tooltip title="Move Up" placement="top">
              <span className="inline-flex">
                <Button
                  type="button"
                  disabled={manualControlsDisabled}
                  onPointerDown={(event) => {
                    if (event.button === 0) pressMoveUp();
                  }}
                  onPointerUp={releaseMoveUp}
                  onPointerLeave={releaseMoveUp}
                  onPointerCancel={releaseMoveUp}
                  onKeyDown={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') {
                      event.preventDefault();
                      pressMoveUp();
                    }
                  }}
                  onKeyUp={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') releaseMoveUp();
                  }}
                  onBlur={releaseMoveUp}
                  variant="text"
                  size="large"
                  color="grey"
                  className="icon-only"
                  startIcon={<ArrowBigUp />}
                />
              </span>
            </Tooltip>
            <Tooltip title="Move Down" placement="top">
              <span className="inline-flex">
                <Button
                  type="button"
                  disabled={manualControlsDisabled}
                  onPointerDown={(event) => {
                    if (event.button === 0) pressMoveDown();
                  }}
                  onPointerUp={releaseMoveDown}
                  onPointerLeave={releaseMoveDown}
                  onPointerCancel={releaseMoveDown}
                  onKeyDown={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') {
                      event.preventDefault();
                      pressMoveDown();
                    }
                  }}
                  onKeyUp={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') releaseMoveDown();
                  }}
                  onBlur={releaseMoveDown}
                  variant="text"
                  size="large"
                  color="grey"
                  className="icon-only"
                  startIcon={<ArrowBigDown />}
                />
              </span>
            </Tooltip>
            {displayedPlcValues &&
              (displayedPlcValues.machineHalted ? (
                <Tooltip title="Resume" placement="top">
                  <span className="inline-flex">
                    <Button
                      onClick={handleMachineResume}
                      disabled={
                        machineControlsDisabled ||
                        !interlockStatus?.machineHalted ||
                        interlockStatus.emergencyHaltActive ||
                        emergencyHaltActive
                      }
                      variant="text"
                      size="large"
                      color="warning"
                      className="icon-only"
                      startIcon={<TriangleAlert />}
                    />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Halt" placement="top">
                  <span className="inline-flex">
                    <Button
                      onClick={handleMachineHalt}
                      disabled={machineControlsDisabled || !interlockStatus || machineInterlocked}
                      variant="text"
                      size="large"
                      color="error"
                      className="icon-only"
                      startIcon={<OctagonX />}
                    />
                  </span>
                </Tooltip>
              ))}
          </Box>
          {/* <Box className="h-10 w-0.25 bg-grey-100 mx-4"></Box> */}
          <Box className="hidden lg:flex bg-grey-50 flex-row items-center  rounded-lg px-4 ms-2">
            <Box className="w-28 flex flex-row items-center gap-1 px-1">
              {/* <Typography variant="subtitle1">Load</Typography> */}
              <Weight />
              {/* -20000.0 N */}
              {displayedPlcValues ? (displayedPlcValues.load / PLC_LOAD_SCALE_DIVISOR).toFixed(1) : '—'} N
            </Box>
            <Box className="min-w-34 flex flex-row items-center gap-1 px-1">
              {/* <Typography variant="subtitle1">Distance</Typography> */}
              <Ruler />
              {/* -200.0000 mm */}
              {displayedPlcValues ? (displayedPlcValues.distance / PLC_DISTANCE_SCALE_DIVISOR).toFixed(4) : '—'} mm
            </Box>
          </Box>
        </Box>
      )}

      <Popper
        open={quickTestOpen}
        anchorEl={quickTestAnchorRef.current}
        placement="bottom-start"
        transition
        className="mb-2! z-5006"
        modifiers={[{ name: 'offset', options: { offset: [-8, 4] } }]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box>
              <ClickAwayListener onClickAway={handleQuickTestClose}>
                <Card className="shadow-darker-sm! w-sm max-w-[calc(100vw-2rem)] outline outline-grey-50">
                  <Typography variant="h6" component="h2" className="px-4 pt-4">
                    Quick Test
                  </Typography>
                  <Box className="p-4">
                    {isLoadingCounts ? (
                      <Box className="flex justify-center py-6">
                        <CircularProgress size={24} />
                      </Box>
                    ) : countsLoadError ? (
                      <Typography className="text-error">Unable to load Quick Test options.</Typography>
                    ) : quickTestCounts && (quickTestCounts.specimens === 0 || quickTestCounts.presets === 0) ? (
                      <NoWayToTest />
                    ) : (
                      <QuickTestForm onTestCreated={() => setQuickTestOpen(false)} />
                    )}
                  </Box>
                </Card>
              </ClickAwayListener>
            </Box>
          </Fade>
        )}
      </Popper>
    </Paper>
  );
}
