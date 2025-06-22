import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Portfolio from '../models/Portfolio.js';

const router = express.Router();

// 🔐 Protect all routes
router.use(protect);

// 📌 GET: Fetch current user's portfolio
router.get('/', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found for this user." });
    }

    res.json({
      portfolio: portfolio.stocks,
      balance: portfolio.balance,
    });
  } catch (err) {
    console.error("Error fetching portfolio:", err);
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

export default router;
