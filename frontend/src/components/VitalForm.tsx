import { useState } from "react";
import { commitVitals } from "../api/vitals";
import type { VitalInput, VitalsResponse } from "../types.ts";
import Loader from "./Loader.tsx";

export default function VitalForm() {
  const [form, setForm] = useState<VitalInput>({
    patientId: "",
    name: "",
    age: 0,
    gender: "",
    heartRate: 0,
    respirationRate: 0,
    systolic: 0,
    diastolic: 0,
    bodyTemperatureC: 0,
    spo2: 0,
    address: "",
    phone: "",
    doctorName: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VitalsResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "age" || name === "heartRate" || name === "respirationRate" ||
              name === "systolic" || name === "diastolic" ||
              name === "bodyTemperatureC" || name === "spo2"
              ? Number(value)
              : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await commitVitals(form);
      setResult(res);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to commit vitals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-2xl">
      <h1 className="text-2xl font-semibold mb-6">Commit Vitals to Blockchain</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {key}
            </label>
            <input
              name={key}
              value={(form as any)[key]}
              onChange={handleChange}
              type={typeof (form as any)[key] === "number" ? "number" : "text"}
              required={key === "patientId" || key === "heartRate"}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? <Loader /> : "Submit to Blockchain"}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-green-50 p-4 rounded-md border border-green-300">
          <h3 className="font-semibold">✅ Transaction Successful</h3>
          <p>Tx Hash: {result.txHash}</p>
          <p>Block Number: {result.record?.chain?.blockNumber}</p>
        </div>
      )}
    </div>
  );
}
