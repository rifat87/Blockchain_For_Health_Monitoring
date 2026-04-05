import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddVitals from "./pages/AddVitals";
import PatientDetails from "./pages/PatientDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddVitals />} />
        <Route path="/patient" element={<PatientDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
