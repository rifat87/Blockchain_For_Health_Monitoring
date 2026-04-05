// ✅ Correct
import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";
import morgan from "morgan";
// import dotenv from "dotenv";
import vitalsRoutes from "./routes/vitalsRoutes.js";
import connectDB from "./config/db.js";

// dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/vitals", vitalsRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
