import type { LoadDisplacementPoint } from "../src/lib/db";
import {
  decodeDvpDword,
  encodeDvpDword,
  type PlcModbusClient,
  readPlcCoil,
  readPlcEmergencyHaltStatus,
  PLC_VELOCITY_SCALE,
  validateScaledSignedDword,
} from "./plc-operations";

const PLC_TEST_TYPE_COIL_ADDRESS = 2098;
const PLC_TEST_LOAD_BASE_COIL_ADDRESS = 2059;
const PLC_TEST_VELOCITY_ADDRESS = 4596;
const PLC_TEST_DISTANCE_TARGET_ADDRESSES = [4120, 4122, 4124, 4128, 4130] as const;
const PLC_TEST_LOAD_TARGET_ADDRESSES = [4150, 4152, 4154, 4156, 4158] as const;
const PLC_TEST_START_COIL_ADDRESS = 2108;
const PLC_TEST_STATUS_COIL_ADDRESS = 2137;
const PLC_TEST_STOP_COIL_ADDRESS = 2110;
const PLC_TEST_LOAD_ADDRESS = 4096;
const PLC_TEST_DISTANCE_ADDRESS = 4098;
const PLC_TEST_SAMPLE_REGISTER_COUNT = 4;
const PLC_TEST_LOAD_SCALE = 10;
const PLC_TEST_DISTANCE_SCALE = 10000;
const PLC_TEST_START_TIMEOUT_MS = 30_000;
const PLC_TEST_STOP_TIMEOUT_MS = 30_000;

export const PLC_TEST_SAMPLE_INTERVAL_MS = 100;
const PLC_TEST_STOP_ACK_DELAY_MS = PLC_TEST_SAMPLE_INTERVAL_MS * 3;

export interface PlcTestCycle {
  running: boolean;
  emergencyHaltActive: boolean;
  sample: LoadDisplacementPoint | null;
}

interface ActivePlcTestRun {
  testId: string;
  client: PlcModbusClient;
  startedAt: number;
  sawRunning: boolean;
  startCommandSent: boolean;
  startCommandPromise: Promise<void> | null;
  stopRequested: boolean;
  stopSignalWasObserved: boolean;
  stopCommandWrittenAt: number | null;
  stopCommandPromise: Promise<void> | null;
  failureMessage: string | null;
  pollTimer: NodeJS.Timeout | null;
  state: PlcTestRunState;
}

export async function writePlcTestPreset(client: PlcModbusClient, preset: PlcTestRunPreset): Promise<void> {
  if (preset.type !== "Tensile" && preset.type !== "Compression") {
    throw new Error("Invalid PLC test type");
  }
  if (preset.base !== "Distance" && preset.base !== "Load") {
    throw new Error("Invalid PLC test base");
  }
  if (!Array.isArray(preset.targets) || preset.targets.length < 1 || preset.targets.length > 5) {
    throw new Error("PLC tests require between one and five targets");
  }

  const encodedVelocity = encodeDvpDword(
    validateScaledSignedDword(preset.velocity, "Preset Velocity", PLC_VELOCITY_SCALE, 1, { min: 1 }),
  );
  const isDistanceBase = preset.base === "Distance";
  const targetScale = isDistanceBase ? PLC_TEST_DISTANCE_SCALE : PLC_TEST_LOAD_SCALE;
  const targetDecimalPlaces = isDistanceBase ? 4 : 1;
  const encodedTargets = preset.targets.map((target, index) =>
    encodeDvpDword(validateScaledSignedDword(target, `Target ${index + 1}`, targetScale, targetDecimalPlaces)),
  );

  await client.writeSingleCoil(PLC_TEST_TYPE_COIL_ADDRESS, preset.type === "Compression");
  await client.writeSingleCoil(PLC_TEST_LOAD_BASE_COIL_ADDRESS, !isDistanceBase);
  await client.writeMultipleRegisters(PLC_TEST_VELOCITY_ADDRESS, encodedVelocity);

  if (isDistanceBase) {
    await client.writeMultipleRegisters(PLC_TEST_DISTANCE_TARGET_ADDRESSES[0], encodedTargets.slice(0, 3).flat());
    if (encodedTargets.length > 3) {
      await client.writeMultipleRegisters(PLC_TEST_DISTANCE_TARGET_ADDRESSES[3], encodedTargets.slice(3).flat());
    }
  } else {
    const loadTargetRegisters = encodedTargets.flat();
    console.log("Writing PLC load targets", {
      address: PLC_TEST_LOAD_TARGET_ADDRESSES[0],
      targets: preset.targets.map((value, index) => ({
        target: index + 1,
        address: PLC_TEST_LOAD_TARGET_ADDRESSES[index],
        value,
        scaledValue: value * PLC_TEST_LOAD_SCALE,
        registers: encodedTargets[index],
      })),
      registers: loadTargetRegisters,
    });
    await client.writeMultipleRegisters(PLC_TEST_LOAD_TARGET_ADDRESSES[0], loadTargetRegisters);
  }
}

export async function triggerPlcTestStart(client: PlcModbusClient): Promise<void> {
  await client.writeSingleCoil(PLC_TEST_START_COIL_ADDRESS, true);
}

export async function triggerPlcTestStop(client: PlcModbusClient): Promise<void> {
  await client.writeSingleCoil(PLC_TEST_STOP_COIL_ADDRESS, true);
}

export async function readPlcTestStatus(client: PlcModbusClient): Promise<boolean> {
  return readPlcCoil(client, PLC_TEST_STATUS_COIL_ADDRESS);
}

export async function readPlcTestStopStatus(client: PlcModbusClient): Promise<boolean> {
  return readPlcCoil(client, PLC_TEST_STOP_COIL_ADDRESS);
}

export async function readPlcTestSample(client: PlcModbusClient): Promise<LoadDisplacementPoint> {
  const response = await client.readHoldingRegisters(PLC_TEST_LOAD_ADDRESS, PLC_TEST_SAMPLE_REGISTER_COUNT);
  const registers = response.response.body.valuesAsArray;

  if (registers.length !== PLC_TEST_SAMPLE_REGISTER_COUNT) {
    throw new Error(`PLC returned ${registers.length} test sample registers; expected ${PLC_TEST_SAMPLE_REGISTER_COUNT}`);
  }

  return {
    load: Math.abs(decodeDvpDword(registers[0], registers[1], PLC_TEST_LOAD_ADDRESS) / PLC_TEST_LOAD_SCALE),
    displacement: Math.abs(
      decodeDvpDword(registers[2], registers[3], PLC_TEST_DISTANCE_ADDRESS) / PLC_TEST_DISTANCE_SCALE,
    ),
  };
}

export async function readPlcTestCycle(client: PlcModbusClient): Promise<PlcTestCycle> {
  const emergencyHaltActive = await readPlcEmergencyHaltStatus(client);
  if (emergencyHaltActive) {
    return {
      running: false,
      emergencyHaltActive,
      sample: null,
    };
  }

  const running = await readPlcTestStatus(client);
  return {
    running,
    emergencyHaltActive,
    sample: running ? await readPlcTestSample(client) : null,
  };
}

export class PlcTestRunManager {
  private activeRun: ActivePlcTestRun | null = null;

  constructor(private readonly publishUpdate: (update: PlcTestRunUpdate) => void) {}

  get hasActiveRun() {
    return this.activeRun !== null;
  }

  async start(client: PlcModbusClient, request: PlcTestRunRequest): Promise<void> {
    if (this.activeRun) throw new Error("A PLC test is already active");
    if (typeof request.testId !== "string" || request.testId.trim().length === 0) {
      throw new Error("Invalid test ID");
    }

    const run: ActivePlcTestRun = {
      testId: request.testId,
      client,
      startedAt: 0,
      sawRunning: false,
      startCommandSent: false,
      startCommandPromise: null,
      stopRequested: false,
      stopSignalWasObserved: false,
      stopCommandWrittenAt: null,
      stopCommandPromise: null,
      failureMessage: null,
      pollTimer: null,
      state: "starting",
    };
    this.activeRun = run;
    this.publishUpdate({ testId: run.testId, state: run.state });

    try {
      if (await readPlcTestStatus(client)) {
        throw new Error("The PLC is already running a test");
      }

      await writePlcTestPreset(client, request.preset);
      if (this.activeRun !== run) return;
      if (run.stopRequested) {
        this.finishRun(run, "stopped");
        return;
      }

      run.startCommandPromise = triggerPlcTestStart(client);
      await run.startCommandPromise;
      run.startCommandSent = true;
      run.startedAt = Date.now();
      if (this.activeRun !== run) return;
      if (run.stopRequested) await this.writeStopCommand(run);
      this.schedulePoll(run);
    } catch (error) {
      await this.failRun(run, error);
      if (this.activeRun === run) return;
      throw error;
    }
  }

  async stop(testId: string): Promise<void> {
    const run = this.activeRun;
    if (!run) throw new Error("There is no active PLC test");
    if (testId !== run.testId) throw new Error("The requested test is not the active PLC test");

    if (!run.stopRequested) {
      run.stopRequested = true;
      run.state = "stopping";
      this.publishUpdate({ testId: run.testId, state: run.state });
    }

    if (run.startCommandSent) {
      try {
        await this.writeStopCommand(run);
      } catch (error) {
        await this.failRun(run, error);
        throw error;
      }
    }
  }

  connectionLost(error: Error) {
    const run = this.activeRun;
    if (!run) return;
    this.finishRun(run, "failed", error.message);
  }

  async shutdown(): Promise<void> {
    const run = this.activeRun;
    if (!run) return;
    if (run.pollTimer) clearTimeout(run.pollTimer);
    run.pollTimer = null;

    if (run.startCommandPromise) {
      try {
        await run.startCommandPromise;
        run.startCommandSent = true;
      } catch (error) {
        console.error("Could not confirm PLC test start during shutdown", error);
      }
    }

    if (run.startCommandSent && run.client.connectionState === "online") {
      try {
        await this.writeStopCommand(run);
      } catch (error) {
        console.error("Could not request PLC test stop during shutdown", error);
      }
    }

    this.activeRun = null;
  }

  private async writeStopCommand(run: ActivePlcTestRun): Promise<void> {
    if (!run.stopCommandPromise) {
      run.stopCommandPromise = triggerPlcTestStop(run.client).then(() => {
        run.stopCommandWrittenAt = Date.now();
      });
    }
    return run.stopCommandPromise;
  }

  private schedulePoll(run: ActivePlcTestRun) {
    if (this.activeRun !== run) return;
    run.pollTimer = setTimeout(() => {
      run.pollTimer = null;
      void this.poll(run);
    }, PLC_TEST_SAMPLE_INTERVAL_MS);
  }

  private async poll(run: ActivePlcTestRun) {
    if (this.activeRun !== run) return;

    try {
      const cycle = await readPlcTestCycle(run.client);
      if (this.activeRun !== run) return;
      if (cycle.emergencyHaltActive) {
        this.finishRunWhenIdle(run, "stopped");
        return;
      }

      const stopSignal = run.stopRequested ? await readPlcTestStopStatus(run.client) : false;
      if (stopSignal) run.stopSignalWasObserved = true;

      if (
        run.stopRequested &&
        run.stopCommandWrittenAt !== null &&
        Date.now() - run.stopCommandWrittenAt >= PLC_TEST_STOP_TIMEOUT_MS
      ) {
        const message = "The PLC did not acknowledge the test stop request";
        this.finishRun(run, "failed", run.failureMessage ? `${run.failureMessage}; ${message}` : message);
        return;
      }

      if (cycle.running) {
        run.sawRunning = true;
        if (!run.stopRequested && run.state !== "running") {
          run.state = "running";
          this.publishUpdate({ testId: run.testId, state: run.state });
        }

        if (cycle.sample) {
          this.publishUpdate({
            testId: run.testId,
            state: run.state,
            sample: {
              elapsedMs: Date.now() - run.startedAt,
              load: cycle.sample.load,
              displacement: cycle.sample.displacement,
            },
          });
        }
      } else if (run.sawRunning) {
        this.finishRunWhenIdle(run, run.stopRequested ? "stopped" : "completed");
        return;
      } else if (run.stopRequested) {
        const stopAcknowledged =
          run.stopSignalWasObserved && !stopSignal ||
          (run.stopCommandWrittenAt !== null &&
            !stopSignal &&
            Date.now() - run.stopCommandWrittenAt >= PLC_TEST_STOP_ACK_DELAY_MS);
        if (stopAcknowledged) {
          this.finishRunWhenIdle(run, "stopped");
          return;
        }
      } else if (Date.now() - run.startedAt >= PLC_TEST_START_TIMEOUT_MS) {
        throw new Error("The PLC did not start the test");
      }

      this.schedulePoll(run);
    } catch (error) {
      await this.failRun(run, error);
    }
  }

  private async failRun(run: ActivePlcTestRun, error: unknown) {
    if (this.activeRun !== run) return;

    const message = error instanceof Error ? error.message : String(error);
    if (run.failureMessage) {
      this.finishRun(run, "failed", `${run.failureMessage}; ${message}`);
      return;
    }

    if (!run.startCommandPromise) {
      this.finishRun(run, "failed", message);
      return;
    }

    if (!run.startCommandSent) {
      try {
        await run.startCommandPromise;
        run.startCommandSent = true;
      } catch {
        run.startCommandSent = true;
      }
    }

    if (run.client.connectionState !== "online") {
      this.finishRun(run, "failed", message);
      return;
    }

    run.failureMessage = message;
    if (!run.stopRequested) {
      run.stopRequested = true;
      run.state = "stopping";
      this.publishUpdate({ testId: run.testId, state: run.state });
    }

    try {
      await this.writeStopCommand(run);
    } catch (stopError) {
      const stopMessage = stopError instanceof Error ? stopError.message : String(stopError);
      this.finishRun(run, "failed", `${message}; could not request PLC test stop: ${stopMessage}`);
      return;
    }
    this.schedulePoll(run);
  }

  private finishRunWhenIdle(run: ActivePlcTestRun, state: "completed" | "stopped") {
    if (run.failureMessage) {
      this.finishRun(run, "failed", run.failureMessage);
      return;
    }
    this.finishRun(run, state);
  }

  private finishRun(run: ActivePlcTestRun, state: PlcTestRunState, error?: string) {
    if (this.activeRun !== run) return;
    if (run.pollTimer) clearTimeout(run.pollTimer);
    run.pollTimer = null;
    run.state = state;
    this.activeRun = null;
    this.publishUpdate({
      testId: run.testId,
      state,
      ...(error ? { error } : {}),
    });
  }
}
