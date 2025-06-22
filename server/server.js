import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';

import { protect } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);

// Protected Routes
app.use('/api/portfolio', protect, portfolioRoutes);
app.use('/api/trades', protect, tradeRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "📈 Stock Market API is running." });
});

// Error Fallback (optional)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
