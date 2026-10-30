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
