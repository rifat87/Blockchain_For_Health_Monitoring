import { useState } from "react";
import { getVitals } from "../api/vitals";
import type { VitalsResponse } from "../types";
import Loader from "./Loader";

export default function PatientLookup() {
  const [patientId, setPatientId] = useState("");
  const [data, setData] = useState<VitalsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!patientId.trim()) return;
    setLoading(true);
    try {
      const res = await getVitals(patientId);
      setData(res);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to fetch vitals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Search Patient Vitals</h2>
      <div className="flex gap-2">
        <input
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter patientId"
          className="border flex-1 p-2 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
        >
          {loading ? <Loader /> : "Search"}
        </button>
      </div>

      {data && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">On-Chain Data</h3>
          <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(data.onchain, null, 2)}
          </pre>
          <h3 className="font-semibold text-gray-700 mt-4 mb-2">
            Off-Chain (MongoDB)
          </h3>
          <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(data.offchain, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
