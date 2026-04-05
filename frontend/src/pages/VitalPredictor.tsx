import { useState } from "react";
import { commitVitals } from "../api/vitals";
import type { VitalInput } from "../types.ts";

interface PredictionResponse {
  model: string;
  category: string;
  message: string;
}

export default function VitalPredictor() {
  const [form, setForm] = useState<VitalInput>({
    patientId: "",
    heartRate: 80,
    respirationRate: 18,
    systolic: 120,
    diastolic: 80,
    bodyTemperatureC: 36.8,
    spo2: 98,
    age: 30,
    gender: "Male",
    address: "",
    phone: "",
    doctorName: "",
  });

  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(1.7);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["age", "heartRate", "respirationRate", "systolic", "diastolic", "bodyTemperatureC", "spo2"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      // call your ML API endpoint (replace this with axios call)
      await new Promise((r) => setTimeout(r, 1000)); // simulate delay
      setPrediction({
        model: "Random Forest",
        category: "Low Risk",
        message: "You seem to be in a normal range!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStore = async () => {
    try {
      const data = await commitVitals({
        ...form,
        weight,
        height,
      });
      alert(`✅ Stored successfully on-chain! Tx: ${data.txHash}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to store vitals");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h1 className="text-3xl font-semibold text-center mb-6">
        🧠 Human Vital Signs Risk Prediction
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Enter your vital signs below and click Predict to see your health risk category.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Input label="Heart Rate" name="heartRate" value={form.heartRate} onChange={handleChange} />
        <Input label="Diastolic BP" name="diastolic" value={form.diastolic} onChange={handleChange} />
        <Input label="Respiration Rate" name="respirationRate" value={form.respirationRate} onChange={handleChange} />
        <Input label="Age" name="age" value={form.age} onChange={handleChange} />
        <Select label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
        <Input label="Body Temperature (°C)" name="bodyTemperatureC" value={form.bodyTemperatureC} onChange={handleChange} />
        <Input label="Oxygen Saturation (%)" name="spo2" value={form.spo2} onChange={handleChange} />
        <Input label="Weight (kg)" name="weight" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
        <Input label="Systolic BP" name="systolic" value={form.systolic} onChange={handleChange} />
        <Input label="Height (m)" name="height" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
      </div>

      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={handlePredict}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Predicting..." : "🔍 Predict Risk Category"}
        </button>

        <button
          onClick={handleStore}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          ⛓️ Store Data
        </button>
      </div>

      {prediction && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            📊 Prediction Result
          </h2>
          <div className="bg-green-100 border border-green-300 p-4 rounded-md mb-3">
            <strong>{prediction.model} Prediction:</strong> {prediction.category}
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            💚 {prediction.message}
          </div>
        </div>
      )}

      <footer className="text-center text-sm text-gray-500 mt-10">
        Developed by Atiqur Rahman | Powered by Random Forest 🌸
      </footer>
    </div>
  );
}

interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
function Input({ label, name, value, onChange }: InputProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type="number"
        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
}
function Select({ label, name, value, onChange, options }: SelectProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
