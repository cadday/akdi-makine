const DEMO_SAMPLE_INTERVAL_MS = 200;
const DEMO_RUN_DURATION_MS = 5000;

interface ActiveDemoRun {
  request: PlcTestRunRequest;
  startedAt: number;
  timer: NodeJS.Timeout | null;
}

export class PlcDemoTestRunManager {
  private activeRun: ActiveDemoRun | null = null;

  constructor(private readonly publishUpdate: (update: PlcTestRunUpdate) => void) {}

  get hasActiveRun() {
    return this.activeRun !== null;
  }

  async start(request: PlcTestRunRequest): Promise<void> {
    if (this.activeRun) throw new Error("A demo test is already active");
    const run: ActiveDemoRun = { request, startedAt: Date.now(), timer: null };
    this.activeRun = run;
    this.publishUpdate({ testId: request.testId, state: "starting" });
    this.scheduleSample(run);
  }

  async stop(testId: string): Promise<void> {
    const run = this.activeRun;
    if (!run) throw new Error("There is no active demo test");
    if (testId !== run.request.testId) throw new Error("The requested test is not the active demo test");

    this.publishUpdate({ testId, state: "stopping" });
    this.finish(run, "stopped");
  }

  async shutdown(): Promise<void> {
    if (this.activeRun) this.finish(this.activeRun, "stopped");
  }

  private scheduleSample(run: ActiveDemoRun) {
    run.timer = setTimeout(() => this.publishSample(run), DEMO_SAMPLE_INTERVAL_MS);
  }

  private publishSample(run: ActiveDemoRun) {
    if (this.activeRun !== run) return;

    const elapsedMs = Math.min(Date.now() - run.startedAt, DEMO_RUN_DURATION_MS);
    const progress = elapsedMs / DEMO_RUN_DURATION_MS;
    const target = Math.abs(run.request.preset.targets[0] ?? 100);
    const load = run.request.preset.method === "Load" ? target * progress : 100 * progress;
    const displacement = run.request.preset.method === "Distance" ? target * progress : 0.5 * progress;

    this.publishUpdate({
      testId: run.request.testId,
      state: "running",
      sample: { elapsedMs, load, displacement },
    });

    if (elapsedMs >= DEMO_RUN_DURATION_MS) {
      this.finish(run, "completed");
      return;
    }

    this.scheduleSample(run);
  }

  private finish(run: ActiveDemoRun, state: "completed" | "stopped") {
    if (this.activeRun !== run) return;
    if (run.timer) clearTimeout(run.timer);
    run.timer = null;
    this.activeRun = null;
    this.publishUpdate({ testId: run.request.testId, state });
  }
}