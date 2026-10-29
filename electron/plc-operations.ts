import Modbus from "jsmodbus";

const PLC_WORKING_COIL_ADDRESS = 3048;

export type PlcModbusClient = InstanceType<typeof Modbus.client.TCP>;

export async function readPlcWorkingStatus(client: PlcModbusClient): Promise<boolean> {
  const response = await client.readCoils(PLC_WORKING_COIL_ADDRESS, 1);
  const coilValue: unknown = response.response.body.valuesAsArray[0];

  if (coilValue !== true && coilValue !== false && coilValue !== 0 && coilValue !== 1) {
    throw new Error(`PLC returned an invalid value for coil ${PLC_WORKING_COIL_ADDRESS}`);
  }

  return coilValue === true || coilValue === 1;
}
