import Modbus from "jsmodbus";

const PLC_WORKING_COIL_ADDRESS = 3048;
const MOVE_UP_COIL_ADDRESS = 2050;
const MOVE_DOWN_COIL_ADDRESS = 2048;
const RESET_LOAD_COIL_ADDRESS = 2120;
const RESET_STROKE_COIL_ADDRESS = 2106;
const PLC_LOAD_REGISTER_ADDRESS = 4096;
const PLC_DISTANCE_REGISTER_ADDRESS = 4098;
const PLC_STATUS_REGISTER_ADDRESS = 4116;
const PLC_OVERVIEW_REGISTER_COUNT = PLC_STATUS_REGISTER_ADDRESS - PLC_LOAD_REGISTER_ADDRESS + 1;
const PLC_STATUS_REGISTER_INDEX = PLC_STATUS_REGISTER_ADDRESS - PLC_LOAD_REGISTER_ADDRESS;
const PLC_MANUAL_VELOCITY_ADDRESS = 4606;
const PLC_MANUAL_VELOCITY_SCALE = 10;
const PLC_TOP_DISTANCE_LIMIT_ADDRESS = 4608;
const PLC_DISTANCE_LIMIT_SCALE = 10000;
const PLC_TOP_LOAD_LIMIT_ADDRESS = 4610;
const PLC_LOAD_LIMIT_SCALE = 10;
const PLC_BOTTOM_DISTANCE_LIMIT_ADDRESS = 4622;
const PLC_BOTTOM_LOAD_LIMIT_ADDRESS = 4624;
const PLC_FIRST_ADJUSTMENT_REGISTER_COUNT = PLC_TOP_LOAD_LIMIT_ADDRESS - PLC_MANUAL_VELOCITY_ADDRESS + 2;
const PLC_LAST_ADJUSTMENT_REGISTER_COUNT = PLC_BOTTOM_LOAD_LIMIT_ADDRESS - PLC_BOTTOM_DISTANCE_LIMIT_ADDRESS + 2;

export type PlcModbusClient = InstanceType<typeof Modbus.client.TCP>;

function validateRegister(value: unknown, address: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 0xffff) {
    throw new Error(`PLC returned an invalid value for holding register ${address}`);
  }

  return value;
}

function decodeDvpDword(
  firstWordValue: unknown,
  secondWordValue: unknown,
  address: number,
): number {
  const lowWord = validateRegister(firstWordValue, address);
  const highWord = validateRegister(secondWordValue, address + 1);
  const unsignedValue = highWord * 0x10000 + lowWord;

  return unsignedValue >= 0x80000000 ? unsignedValue - 0x100000000 : unsignedValue;
}

function validateScaledSignedDword(value: unknown, name: string, scale: number, decimalPlaces: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${name} must be a number`);
  }

  const scaledValue = value * scale;
  const integerValue = Math.round(scaledValue);
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(scaledValue)) * 4;
  if (
    Math.abs(scaledValue - integerValue) > tolerance ||
    integerValue < -0x80000000 ||
    integerValue > 0x7fffffff
  ) {
    throw new Error(`${name} must have at most ${decimalPlaces} decimal places and fit a signed 32-bit integer`);
  }

  return integerValue;
}

function encodeDvpDword(value: number): [number, number] {
  const unsignedValue = value < 0 ? value + 0x100000000 : value;
  return [unsignedValue % 0x10000, Math.floor(unsignedValue / 0x10000)];
}

export async function readPlcWorkingStatus(client: PlcModbusClient): Promise<boolean> {
  const response = await client.readCoils(PLC_WORKING_COIL_ADDRESS, 1);
  const coilValue: unknown = response.response.body.valuesAsArray[0];

  if (coilValue !== true && coilValue !== false && coilValue !== 0 && coilValue !== 1) {
    throw new Error(`PLC returned an invalid value for coil ${PLC_WORKING_COIL_ADDRESS}`);
  }

  return coilValue === true || coilValue === 1;
}

export async function readPlcOverviewValues(client: PlcModbusClient): Promise<PlcOverviewValues> {
  const response = await client.readHoldingRegisters(PLC_LOAD_REGISTER_ADDRESS, PLC_OVERVIEW_REGISTER_COUNT);
  const registers = response.response.body.valuesAsArray;

  if (registers.length !== PLC_OVERVIEW_REGISTER_COUNT) {
    throw new Error(`PLC returned ${registers.length} overview registers; expected ${PLC_OVERVIEW_REGISTER_COUNT}`);
  }

  const load = decodeDvpDword(registers[0], registers[1], PLC_LOAD_REGISTER_ADDRESS);
  const distance = decodeDvpDword(registers[2], registers[3], PLC_DISTANCE_REGISTER_ADDRESS);

  return {
    load,
    distance,
    status: validateRegister(registers[PLC_STATUS_REGISTER_INDEX], PLC_STATUS_REGISTER_ADDRESS),
  };
}

export async function readPlcAdjustments(client: PlcModbusClient): Promise<PlcAdjustmentValues> {
  const firstResponse = await client.readHoldingRegisters(
    PLC_MANUAL_VELOCITY_ADDRESS,
    PLC_FIRST_ADJUSTMENT_REGISTER_COUNT,
  );
  const firstRegisters = firstResponse.response.body.valuesAsArray;
  if (firstRegisters.length !== PLC_FIRST_ADJUSTMENT_REGISTER_COUNT) {
    throw new Error(
      `PLC returned ${firstRegisters.length} initial adjustment registers; expected ${PLC_FIRST_ADJUSTMENT_REGISTER_COUNT}`,
    );
  }

  const lastResponse = await client.readHoldingRegisters(
    PLC_BOTTOM_DISTANCE_LIMIT_ADDRESS,
    PLC_LAST_ADJUSTMENT_REGISTER_COUNT,
  );
  const lastRegisters = lastResponse.response.body.valuesAsArray;
  if (lastRegisters.length !== PLC_LAST_ADJUSTMENT_REGISTER_COUNT) {
    throw new Error(
      `PLC returned ${lastRegisters.length} final adjustment registers; expected ${PLC_LAST_ADJUSTMENT_REGISTER_COUNT}`,
    );
  }

  return {
    manualVelocity:
      decodeDvpDword(firstRegisters[0], firstRegisters[1], PLC_MANUAL_VELOCITY_ADDRESS) /
      PLC_MANUAL_VELOCITY_SCALE,
    topDistanceLimit:
      decodeDvpDword(firstRegisters[2], firstRegisters[3], PLC_TOP_DISTANCE_LIMIT_ADDRESS) /
      PLC_DISTANCE_LIMIT_SCALE,
    bottomDistanceLimit:
      decodeDvpDword(lastRegisters[0], lastRegisters[1], PLC_BOTTOM_DISTANCE_LIMIT_ADDRESS) /
      PLC_DISTANCE_LIMIT_SCALE,
    topLoadLimit:
      decodeDvpDword(firstRegisters[4], firstRegisters[5], PLC_TOP_LOAD_LIMIT_ADDRESS) /
      PLC_LOAD_LIMIT_SCALE,
    bottomLoadLimit:
      decodeDvpDword(lastRegisters[2], lastRegisters[3], PLC_BOTTOM_LOAD_LIMIT_ADDRESS) /
      PLC_LOAD_LIMIT_SCALE,
  };
}

export async function writePlcAdjustments(client: PlcModbusClient, value: unknown): Promise<void> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Invalid PLC adjustments');
  }

  const input = value as Record<string, unknown>;
  const manualVelocity = validateScaledSignedDword(
    input.manualVelocity,
    'Manual Velocity',
    PLC_MANUAL_VELOCITY_SCALE,
    1,
  );
  const topDistanceLimit = validateScaledSignedDword(
    input.topDistanceLimit,
    'Top Distance Limit',
    PLC_DISTANCE_LIMIT_SCALE,
    4,
  );
  const bottomDistanceLimit = validateScaledSignedDword(
    input.bottomDistanceLimit,
    'Bottom Distance Limit',
    PLC_DISTANCE_LIMIT_SCALE,
    4,
  );
  const topLoadLimit = validateScaledSignedDword(input.topLoadLimit, 'Top Load Limit', PLC_LOAD_LIMIT_SCALE, 1);
  const bottomLoadLimit = validateScaledSignedDword(
    input.bottomLoadLimit,
    'Bottom Load Limit',
    PLC_LOAD_LIMIT_SCALE,
    1,
  );

  await client.writeMultipleRegisters(PLC_MANUAL_VELOCITY_ADDRESS, [
    ...encodeDvpDword(manualVelocity),
    ...encodeDvpDword(topDistanceLimit),
    ...encodeDvpDword(topLoadLimit),
  ]);
  await client.writeMultipleRegisters(PLC_BOTTOM_DISTANCE_LIMIT_ADDRESS, [
    ...encodeDvpDword(bottomDistanceLimit),
    ...encodeDvpDword(bottomLoadLimit),
  ]);
}

// M2 is a momentary jog command; the UI clears it when the user releases the control.
export async function setMoveUp(client: PlcModbusClient, enabled: boolean): Promise<void> {
  await client.writeSingleCoil(MOVE_UP_COIL_ADDRESS, enabled);
}

// M0 is a momentary jog command; the UI clears it when the user releases the control.
export async function setMoveDown(client: PlcModbusClient, enabled: boolean): Promise<void> {
  await client.writeSingleCoil(MOVE_DOWN_COIL_ADDRESS, enabled);
}

// The PLC clears Reset Load after handling it; the UI only triggers it.
export async function triggerResetLoad(client: PlcModbusClient): Promise<void> {
  console.log("Triggering Reset Load");
  await client.writeSingleCoil(RESET_LOAD_COIL_ADDRESS, true);
}

// The PLC clears Reset Stroke after handling it; the UI only triggers it.
export async function triggerResetStroke(client: PlcModbusClient): Promise<void> {
  await client.writeSingleCoil(RESET_STROKE_COIL_ADDRESS, true);
}
