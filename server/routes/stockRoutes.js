import express from 'express';
const router = express.Router();

router.post('/quotes', async (req, res) => {
  const { symbols } = req.body;
  // For now, send back placeholder demo data
  const demoData = symbols.map((symbol) => ({
    symbol,
    name: symbol + ' Inc.',
    price: 100 + Math.random() * 50,
    change: Math.random() * 5,
    changePercent: Math.random() * 2,
    volume: Math.floor(Math.random() * 1000000),
    marketCap: 1000000000 + Math.random() * 1000000000,
    high: 105,
    low: 95,
    open: 98,
    previousClose: 97,
  }));
  res.json({ stocks: demoData });
});

export default router;
