import Vital from "../models/vitalModel.js";
import { storeVitalsOnChain, readSnapshot } from "../utils/ethersClient.js";

/** Store data in MongoDB + Blockchain */
export async function commitVitals(req, res) {
  try {
    const data = req.body;
    if (!data.patientId) {
      return res.status(400).json({ message: "patientId is required" });
    }

    // Save all form data in Mongo first
    const vitalDoc = await Vital.create({ ...data, chain: { status: "pending" } });

    // Send selected fields to blockchain
    const receipt = await storeVitalsOnChain(data);

    // Update Mongo record after blockchain success
    vitalDoc.chain = {
      status: "onchain",
      txHash: receipt.txHash,
      blockNumber: receipt.blockNumber,
    };
    await vitalDoc.save();

    res.json({
      message: "Vitals stored successfully on-chain and in MongoDB",
      txHash: receipt.txHash,
      record: vitalDoc,
    });
  } catch (err) {
    console.error("❌ commitVitals error:", err);
    res.status(500).json({ message: "Failed to store vitals", error: err.message });
  }
}

/** Get patient’s latest vitals (from both chain + MongoDB) */
export async function getVitals(req, res) {
  try {
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ message: "patientId is required" });

    // Read from blockchain
    const onchain = await readSnapshot(patientId);

    // Read latest Mongo record for this patient
    const offchain = await Vital.findOne({ patientId }).sort({ createdAt: -1 });

    res.json({ onchain, offchain });
  } catch (err) {
    console.error("❌ getVitals error:", err);
    res.status(500).json({ message: "Failed to fetch vitals", error: err.message });
  }
}
