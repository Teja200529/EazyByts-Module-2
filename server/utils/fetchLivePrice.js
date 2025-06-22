// utils/fetchLivePrice.js or wherever appropriate
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const fetchLivePrice = async (symbol) => {
  try {
    const isIndian = symbol.endsWith('.BO') || symbol.endsWith('.NS') || symbol === '^BSESN';

    if (isIndian) {
      const yahooSymbol = encodeURIComponent(symbol);
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?region=IN&lang=en-IN&interval=1m&range=1d`;
      const response = await axios.get(url);
      const price = response.data.chart.result[0].meta.regularMarketPrice;
      return price;
    } else {
      const apiKey = process.env.ALPHA_VANTAGE_KEY;
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await axios.get(url);
      const price = parseFloat(response.data['Global Quote']['05. price']);
      return price;
    }
  } catch (error) {
    console.error('❌ Error fetching price:', error.message);
    return null;
  }
};
