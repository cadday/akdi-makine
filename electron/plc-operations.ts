import Modbus from "jsmodbus";

const PLC_WORKING_COIL_ADDRESS = 3048;
const MOVE_UP_COIL_ADDRESS = 2050;
const MOVE_DOWN_COIL_ADDRESS = 2048;
const RESET_LOAD_COIL_ADDRESS = 2120;
const RESET_STROKE_COIL_ADDRESS = 2106;

export type PlcModbusClient = InstanceType<typeof Modbus.client.TCP>;

export async function readPlcWorkingStatus(client: PlcModbusClient): Promise<boolean> {
  const response = await client.readCoils(PLC_WORKING_COIL_ADDRESS, 1);
  const coilValue: unknown = response.response.body.valuesAsArray[0];

  if (coilValue !== true && coilValue !== false && coilValue !== 0 && coilValue !== 1) {
    throw new Error(`PLC returned an invalid value for coil ${PLC_WORKING_COIL_ADDRESS}`);
  }

  return coilValue === true || coilValue === 1;
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
