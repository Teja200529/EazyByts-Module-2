// server/controllers/stockController.js
import { fetchLiveQuote } from '../utils/fetchLiveQuote.js'; // You'll create this helper

export const getStockQuotes = async (req, res) => {
  const { symbols } = req.body;

  if (!Array.isArray(symbols)) {
    return res.status(400).json({ error: "symbols must be an array" });
  }

  const stocks = await Promise.all(
    symbols.map(async (symbol) => {
      const data = await fetchLiveQuote(symbol); // Returns full quote
      return data;
    })
  );

  const validStocks = stocks.filter(Boolean); // Remove nulls
  res.json({ stocks: validStocks });
};
