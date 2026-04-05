import axios from "axios";
import type { VitalInput, VitalsResponse } from "../types.ts";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1/vitals",
});

export const commitVitals = async (data: VitalInput): Promise<VitalsResponse> => {
  const res = await API.post("/commit", data);
  return res.data;
};

export const getVitals = async (patientId: string): Promise<VitalsResponse> => {
  const res = await API.get(`/${patientId}`);
  return res.data;
};
