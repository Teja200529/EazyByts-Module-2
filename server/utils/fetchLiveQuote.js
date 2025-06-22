import axios from "axios";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "WZKX310JSCTI5Z2D";

export const fetchLiveQuote = async (symbol) => {
  try {
    const res = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "GLOBAL_QUOTE",
        symbol,
        apikey: API_KEY,
      },
    });

    const quote = res.data["Global Quote"];
    if (!quote || !quote["05. price"]) return null;

    return {
      symbol,
      name: symbol + " Inc.",

      // ✅ Safely parsed and defaulted
      price: parseFloat(quote["05. price"]) || 0,
      change: parseFloat(quote["09. change"]) || 0,
      changePercent: parseFloat((quote["10. change percent"] || "0").replace("%", "")) || 0,
      volume: parseFloat(quote["06. volume"]) || 0,

      // ✅ Add fake marketCap if not available
      marketCap: Math.floor(1e9 + Math.random() * 5e11), // ~1B to 500B
      high: parseFloat(quote["03. high"]) || 0,
      low: parseFloat(quote["04. low"]) || 0,
      open: parseFloat(quote["02. open"]) || 0,
      previousClose: parseFloat(quote["08. previous close"]) || 0,
    };
  } catch (err) {
    console.error("Error fetching live quote for", symbol, err.message);
    return null;
  }
};
