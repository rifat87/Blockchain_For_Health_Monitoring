import React, { useState } from "react";
import { submitVitals } from "../api/vitals";

export default function VitalForm() {
  const [form, setForm] = useState({
    patientId: "",
    heartRate: "",
    respirationRate: "",
    bodyTemperatureC: "",
    spo2: "",
    systolic: "",
    diastolic: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await submitVitals({
        ...form,
        heartRate: Number(form.heartRate),
        respirationRate: Number(form.respirationRate),
        bodyTemperatureC: Number(form.bodyTemperatureC),
        spo2: Number(form.spo2),
        systolic: Number(form.systolic),
        diastolic: Number(form.diastolic),
      });
      setMessage(`✅ Stored successfully! TxHash: ${response.record.chain.txHash}`);
    } catch (err: any) {
      setMessage("❌ Failed to submit data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Patient Vital Form</h2>

      {Object.keys(form).map((key) => (
        <div key={key} className="mb-3">
          <label className="block text-sm font-medium mb-1" htmlFor={key}>{key}</label>
          <input
            type="text"
            id={key}
            name={key}
            value={(form as any)[key]}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit & Store"}
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}
