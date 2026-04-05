import dotenv from "dotenv";
dotenv.config();


import { ethers } from "ethers";

// ---- ENV VALIDATION ----
const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;
function req(name, val) {
  if (!val || String(val).trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
}
req("RPC_URL", RPC_URL);
req("PRIVATE_KEY", PRIVATE_KEY);
req("CONTRACT_ADDRESS", CONTRACT_ADDRESS);

// ---- PROVIDER & SIGNER ----
export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// ---- MINIMAL ABI ----
// Only what we need: storeVitals(...) and getSnapshot(...)
const VITALS_ABI = [
  // write
  {
    "inputs": [
      { "internalType": "bytes32", "name": "patientId", "type": "bytes32" },
      { "internalType": "uint16", "name": "heartRate", "type": "uint16" },
      { "internalType": "uint16", "name": "respirationRate", "type": "uint16" },
      { "internalType": "uint16", "name": "systolic", "type": "uint16" },
      { "internalType": "uint16", "name": "diastolic", "type": "uint16" },
      { "internalType": "uint16", "name": "bodyTempX10", "type": "uint16" },
      { "internalType": "uint16", "name": "spo2", "type": "uint16" }
    ],
    "name": "storeVitals",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // read
  {
    "inputs": [{ "internalType": "bytes32", "name": "patientId", "type": "bytes32" }],
    "name": "getSnapshot",
    "outputs": [
      { "internalType": "uint16", "name": "heartRate", "type": "uint16" },
      { "internalType": "uint16", "name": "respirationRate", "type": "uint16" },
      { "internalType": "uint16", "name": "systolic", "type": "uint16" },
      { "internalType": "uint16", "name": "diastolic", "type": "uint16" },
      { "internalType": "uint16", "name": "bodyTempX10", "type": "uint16" },
      { "internalType": "uint16", "name": "spo2", "type": "uint16" },
      { "internalType": "address", "name": "submittedBy", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // optional: event (useful if you later want to parse logs)
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "patientId", "type": "bytes32" },
      { "indexed": false, "internalType": "uint16", "name": "heartRate", "type": "uint16" },
      { "indexed": false, "internalType": "uint16", "name": "respirationRate", "type": "uint16" },
      { "indexed": false, "internalType": "uint16", "name": "systolic", "type": "uint16" },
      { "indexed": false, "internalType": "uint16", "name": "diastolic", "type": "uint16" },
      { "indexed": false, "internalType": "uint16", "name": "bodyTempX10", "type": "uint16" },
      { "indexed": false, "internalType": "uint16", "name": "spo2", "type": "uint16" },
      { "indexed": false, "internalType": "address", "name": "submittedBy", "type": "address" }
    ],
    "name": "SnapshotStored",
    "type": "event"
  }
];

export const contract = new ethers.Contract(CONTRACT_ADDRESS, VITALS_ABI, signer);

// ---- HELPERS ----
/** Hash a plain patientId string into bytes32 key used on-chain */
export function toPatientKey(patientId) {
  // ethers.id() => keccak256(utf8Bytes)
  return ethers.id(String(patientId));
}

/** Store selected vitals on-chain. Returns { txHash, blockNumber }. */
export async function storeVitalsOnChain(payload) {
  const {
    patientId,
    heartRate,
    respirationRate,
    systolic,
    diastolic,
    bodyTemperatureC,
    spo2
  } = payload;

  if (!patientId) throw new Error("patientId is required");

  // Convert temperature to x10 (e.g., 36.8 → 368)
  const bodyTempX10 = Math.round(Number(bodyTemperatureC) * 10);

  const patientKey = toPatientKey(patientId);

  // Optional: you can set gas price or let Anvil handle it
  const tx = await contract.storeVitals(
    patientKey,
    Number(heartRate),
    Number(respirationRate),
    Number(systolic),
    Number(diastolic),
    Number(bodyTempX10),
    Number(spo2)
  );

  const rec = await tx.wait();
  return {
    txHash: rec.hash,
    blockNumber: rec.blockNumber
  };
}

/** Read latest snapshot by patientId. Returns a clean JS object. */
export async function readSnapshot(patientId) {
  if (!patientId) throw new Error("patientId is required");

  const patientKey = toPatientKey(patientId);
  // returns tuple in ethers v6 — destructure in order:
  const [
    heartRate,
    respirationRate,
    systolic,
    diastolic,
    bodyTempX10,
    spo2,
    submittedBy
  ] = await contract.getSnapshot(patientKey);

  if (submittedBy === ethers.ZeroAddress) {
    // Your contract reverts on missing; if you later change it to optional,
    // you can guard here.
  }

  return {
    patientId,
    heartRate: Number(heartRate),
    respirationRate: Number(respirationRate),
    systolic: Number(systolic),
    diastolic: Number(diastolic),
    bodyTemperatureC: Number(bodyTempX10) / 10,
    spo2: Number(spo2),
    submittedBy
  };
}

/** Quick health check for readiness (provider + signer + contract) */
export async function isChainReady() {
  const [height, addr, code] = await Promise.all([
    provider.getBlockNumber(),
    signer.getAddress(),
    provider.getCode(CONTRACT_ADDRESS)
  ]);
  return {
    chainId: await signer.getChainId(),
    blockNumber: height,
    signer: addr,
    contractDeployed: code && code !== "0x"
  };
}
