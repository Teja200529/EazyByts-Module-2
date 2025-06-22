import Trade from "../models/Trade.js";
import Portfolio from "../models/Portfolio.js";

export const createTrade = async (req, res) => {
  try {
    let { symbol, type, shares, price } = req.body;

    // Normalize and validate input
    symbol = symbol?.toUpperCase();
    shares = Number(shares);
    price = Number(price);

    if (!symbol || !type || !shares || !price || shares <= 0 || price <= 0) {
      return res.status(400).json({ message: "Invalid trade input" });
    }

    const totalCost = shares * price;

    // Find or create portfolio
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user._id,
        balance: 100000,
        stocks: [],
      });
    }

    let stock = portfolio.stocks.find((s) => s.symbol === symbol);

    if (type === "buy") {
      if (portfolio.balance < totalCost) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      if (stock) {
        // Recalculate average price and update
        const newTotalShares = stock.shares + shares;
        const newTotalValue = stock.totalValue + totalCost;
        const newAvgPrice = newTotalValue / newTotalShares;

        stock.shares = newTotalShares;
        stock.totalValue = newTotalValue;
        stock.avgPrice = newAvgPrice;
      } else {
        portfolio.stocks.push({
          symbol,
          shares,
          avgPrice: price, // Initial average = buy price
          totalValue: totalCost,
        });
      }

      portfolio.balance -= totalCost;
    }

    if (type === "sell") {
      if (!stock || stock.shares < shares) {
        return res.status(400).json({ message: "Insufficient shares" });
      }

      const avgPrice = stock.avgPrice;
      const valueToRemove = avgPrice * shares;

      stock.shares -= shares;
      stock.totalValue -= valueToRemove;
      portfolio.balance += shares * price;

      if (stock.shares === 0) {
        portfolio.stocks = portfolio.stocks.filter((s) => s.symbol !== symbol);
      }
    }

    await portfolio.save();

    const trade = new Trade({
      user: req.user._id,
      symbol,
      type,
      shares,
      price,
      total: totalCost,
      timestamp: new Date(),
    });

    await trade.save();

    res.json({
      success: true,
      message: "Trade successful",
      trade,
      newBalance: portfolio.balance,
      updatedPortfolio: portfolio.stocks,
    });
  } catch (err) {
    console.error("Trade error:", err);
    res.status(500).json({ message: "Server error during trade" });
  }
};

export const getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ timestamp: -1 });
    res.json({ trades });
  } catch (err) {
    console.error("Error fetching trades:", err);
    res.status(500).json({ message: "Failed to fetch trades" });
  }
};
