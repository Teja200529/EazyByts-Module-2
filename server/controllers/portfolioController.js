// controllers/portfolioController.js
import Portfolio from '../models/Portfolio.js';

// GET /api/portfolio - Fetch portfolio for the logged-in user
export const getPortfolio = async (req, res) => {
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
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
};
