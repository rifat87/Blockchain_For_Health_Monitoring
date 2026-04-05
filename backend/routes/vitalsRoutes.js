import express from "express";
import { commitVitals, getVitals } from "../controllers/vitalsController.js";

const router = express.Router();

// POST /api/v1/vitals/commit → store data in Mongo + Blockchain
router.post("/commit", commitVitals);

// GET /api/v1/vitals/:patientId → fetch both onchain + offchain data
router.get("/:patientId", getVitals);

export default router;
