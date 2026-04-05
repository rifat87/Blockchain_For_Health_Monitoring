import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Health Monitor Dashboard</h1>
      <div className="flex gap-4">
        <Link
          to="/add"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Add Vitals
        </Link>
        <Link
          to="/patient"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          View Patient
        </Link>
      </div>
    </div>
  );
}
