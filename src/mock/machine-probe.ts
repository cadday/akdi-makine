export interface MachineProbeResult {
  connected: boolean;
  machineName?: string;
  error?: string;
}

export async function probeMachine(ipAddress: string): Promise<MachineProbeResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const octets = ipAddress.trim().split(".");
  const isValidIp =
    octets.length === 4 &&
    octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) >= 0 && Number(octet) <= 255);

  if (!isValidIp) return { connected: false, error: "Enter a valid IP address." };
  if (octets[0] === "192" && octets[1] === "168" && octets[2] === "1") {
    return { connected: true, machineName: "AKDI 20-34" };
  }

  return { connected: false, error: "No machine responded at this IP address." };
}