import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    name: { type: String },
    age: { type: Number },
    gender: { type: String },
    heartRate: { type: Number },
    respirationRate: { type: Number },
    systolic: { type: Number },
    diastolic: { type: Number },
    bodyTemperatureC: { type: Number },
    spo2: { type: Number },
    address: { type: String },
    phone: { type: String },
    doctorName: { type: String },

    chain: {
      status: { type: String, enum: ["pending", "onchain", "failed"], default: "pending" },
      txHash: { type: String },
      blockNumber: { type: Number },
    },
  },
  { timestamps: true }
);

const Vital = mongoose.model("vitals", vitalSchema);

export default Vital;
