import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v1", // matches Express prefix
});

export interface VitalPayload {
  patientId: string;
  heartRate: number;
  respirationRate: number;
  bodyTemperatureC: number;
  spo2: number;
  systolic: number;
  diastolic: number;
  age?: number;
  gender?: string;
  weightKg?: number;
  heightM?: number;
  walletAddress?: string;
}

export async function submitVitals(data: VitalPayload) {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const walletAddress = accounts[0];
  const payload = { ...data, walletAddress };
  const res = await api.post("/vitals/commit", payload);
  return res.data;
}
