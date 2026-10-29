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
import { ArrowBigDown, ArrowBigUp, OctagonX, Play, Ruler, Square, Weight } from 'lucide-react';
import QuickTestForm from '@/pages/app/overview/components/quick-test-form';
import { useTestRun } from '@/context/test-run-context';
import { useDb } from '@/context/db-context';
import useAppNotifications from '@/hooks/use-app-notifications';
import { NoWayToTest } from '@/pages/app/components/no-entity-found';
import { usePlcData } from '@/context/plc-context';

export default function MachineControls() {
  const [quickTestOpen, setQuickTestOpen] = useState(false);
  const [quickTestTooltipOpen, setQuickTestTooltipOpen] = useState(false);
  const [quickTestCounts, setQuickTestCounts] = useState<{ specimens: number; presets: number } | null>(null);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [countsLoadError, setCountsLoadError] = useState(false);
  const [hasConnectedMachine, setHasConnectedMachine] = useState(false);
  const quickTestAnchorRef = useRef<HTMLButtonElement>(null);
  const moveUpPressedRef = useRef(false);
  const moveDownPressedRef = useRef(false);
  const { db, getRecordCounts } = useDb();
  const { showError } = useAppNotifications();
  const { connectionStatus } = usePlcData();
  const { pathname } = useLocation();
  const { hasActiveTest, stopActiveTest } = useTestRun();
  const machineControlsDisabled = !hasConnectedMachine || connectionStatus.state !== 'online';

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
    if (machineControlsDisabled || moveUpPressedRef.current) return;
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
  }, [machineControlsDisabled, showError]);

  const pressMoveDown = useCallback(() => {
    if (machineControlsDisabled || moveDownPressedRef.current) return;
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
  }, [machineControlsDisabled, showError]);

  const triggerResetLoad = useCallback(() => {
    if (machineControlsDisabled) return;
    void window.plcAPI.resetLoad().catch((error: unknown) => showError(`Failed to activate Reset Load: ${String(error)}`));
  }, [machineControlsDisabled, showError]);

  const triggerResetStroke = useCallback(() => {
    if (machineControlsDisabled) return;
    void window.plcAPI.resetStroke().catch((error: unknown) => showError(`Failed to activate Reset Stroke: ${String(error)}`));
  }, [machineControlsDisabled, showError]);

  useEffect(() => {
    if (machineControlsDisabled) {
      releaseMoveUp();
      releaseMoveDown();
    }
  }, [machineControlsDisabled, releaseMoveDown, releaseMoveUp]);

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
    <Paper className="flex flex-col p-2 fixed right-0 top-1/2 -translate-y-1/2 mt-7 z-5005 rounded-e-2xs gap-4 shadow-darker-xs outline outline-grey-25">
      <Box className="flex flex-col">
        <Tooltip title="Quick Test" placement="left" open={quickTestTooltipOpen}>
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
              disabled={machineControlsDisabled || hasActiveTest}
              variant="text"
              size="large"
              color="grey"
              className="icon-only"
              startIcon={<Play />}
            />
          </span>
        </Tooltip>
        <Tooltip title="Stop Test" placement="left">
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

      <Box className="flex flex-col">
        <Tooltip title="Reset Load" placement="left">
          <span className="inline-flex">
            <Button
              type="button"
              aria-label="Reset Load"
              disabled={machineControlsDisabled}
              onClick={triggerResetLoad}
              variant="text"
              size="large"
              color="grey"
              className="icon-only"
              startIcon={<Weight />}
            />
          </span>
        </Tooltip>
        <Tooltip title="Reset Stroke" placement="left">
          <span className="inline-flex">
            <Button
              type="button"
              aria-label="Reset Stroke"
              disabled={machineControlsDisabled}
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

      <Box className="flex flex-col">
        <Tooltip title="Move Up" placement="left">
          <span className="inline-flex">
            <Button
              type="button"
              disabled={machineControlsDisabled}
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
        <Tooltip title="Move Down" placement="left">
          <span className="inline-flex">
            <Button
              type="button"
              disabled={machineControlsDisabled}
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
        <Tooltip title="Halt" placement="left">
          <span className="inline-flex">
            <Button
              onClick={stopActiveTest}
              disabled={machineControlsDisabled}
              variant="text"
              size="large"
              color="error"
              className="icon-only"
              startIcon={<OctagonX />}
            />
          </span>
        </Tooltip>
      </Box>
      <Popper
        open={quickTestOpen}
        anchorEl={quickTestAnchorRef.current}
        placement="left-start"
        transition
        className="me-2! z-5006"
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
