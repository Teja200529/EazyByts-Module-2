import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createTrade, getTrades } from "../controllers/tradeController.js";

const router = express.Router();

router.post("/", protect, createTrade);
router.get("/", protect, getTrades);

export default router;
