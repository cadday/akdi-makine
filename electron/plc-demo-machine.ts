export class PlcDemoMachine {
  private distance = 0;
  private load = 0;
  private movement: -1 | 0 | 1 = 0;
  private halted = false;
  private lastUpdatedAt = Date.now();
  private limits: PlcLimitsValues = { testDistanceLimit: 100, testLoadLimit: 1000 };
  private adjustments: PlcAdjustmentValues = {
    manualVelocity: 1,
    topDistanceLimit: 100,
    bottomDistanceLimit: -100,
    topLoadLimit: 1000,
    bottomLoadLimit: -1000,
  };

  readOverviewValues(): PlcOverviewValues {
    const now = Date.now();
    const elapsedSeconds = Math.min((now - this.lastUpdatedAt) / 1000, 0.5);
    this.lastUpdatedAt = now;

    if (this.movement !== 0 && !this.halted) {
      this.distance = Math.max(-100, Math.min(100, this.distance + this.movement * elapsedSeconds * 2.5));
      this.load = 25 + Math.abs(this.distance) * 0.4;
    }

    return {
      load: Math.round(this.load * 10),
      distance: Math.round(this.distance * 10000),
      status: this.movement === 0 ? 0 : 1,
      emergencyHaltActive: false,
      machineHalted: this.halted,
    };
  }

  setMoveUp(enabled: boolean): void {
    this.setMovement(enabled, 1);
  }

  setMoveDown(enabled: boolean): void {
    this.setMovement(enabled, -1);
  }

  halt(): void {
    this.readOverviewValues();
    this.movement = 0;
    this.halted = true;
  }

  resume(): void {
    this.halted = false;
  }

  resetLoad(): void {
    this.load = 0;
  }

  resetStroke(): void {
    this.distance = 0;
    this.lastUpdatedAt = Date.now();
  }

  readLimits(): PlcLimitsValues {
    return { ...this.limits };
  }

  writeLimits(value: unknown): void {
    const values = this.readNumericValues(value, ["testDistanceLimit", "testLoadLimit"]);
    this.limits = { testDistanceLimit: values.testDistanceLimit, testLoadLimit: values.testLoadLimit };
  }

  readAdjustments(): PlcAdjustmentValues {
    return { ...this.adjustments };
  }

  writeAdjustments(value: unknown): void {
    const values = this.readNumericValues(value, [
      "manualVelocity",
      "topDistanceLimit",
      "bottomDistanceLimit",
      "topLoadLimit",
      "bottomLoadLimit",
    ]);
    this.adjustments = {
      manualVelocity: values.manualVelocity,
      topDistanceLimit: values.topDistanceLimit,
      bottomDistanceLimit: values.bottomDistanceLimit,
      topLoadLimit: values.topLoadLimit,
      bottomLoadLimit: values.bottomLoadLimit,
    };
  }

  private setMovement(enabled: boolean, direction: -1 | 1): void {
    if (enabled && this.halted) throw new Error("Resume the demo machine before moving it");
    if (enabled) {
      this.readOverviewValues();
      this.movement = direction;
      if (this.load === 0) this.load = 25;
    } else if (this.movement === direction) {
      this.readOverviewValues();
      this.movement = 0;
    }
  }

  private readNumericValues(value: unknown, fields: string[]): Record<string, number> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error("Invalid demo PLC settings");
    }

    const values = value as Record<string, unknown>;
    const result: Record<string, number> = {};
    for (const field of fields) {
      const fieldValue = values[field];
      if (typeof fieldValue !== "number" || !Number.isFinite(fieldValue)) {
        throw new Error(`Invalid demo PLC value for ${field}`);
      }
      result[field] = fieldValue;
    }
    return result;
  }
}