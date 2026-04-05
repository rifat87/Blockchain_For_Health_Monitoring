export interface VitalInput {
  patientId: string;
  name?: string;
  age?: number;
  gender?: string;
  heartRate: number;
  respirationRate: number;
  systolic: number;
  diastolic: number;
  bodyTemperatureC: number;
  spo2: number;
  address?: string;
  phone?: string;
  doctorName?: string;
}

export interface ChainInfo {
  status: "pending" | "onchain" | "failed";
  txHash?: string;
  blockNumber?: number;
}

export interface VitalRecord extends VitalInput {
  chain?: ChainInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface VitalsResponse {
  message?: string;
  txHash?: string;
  record?: VitalRecord;
  onchain?: any;
  offchain?: any;
}
