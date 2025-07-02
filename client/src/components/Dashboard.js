import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const API_KEY = "WZKX310JSCTI5Z2D";

function Dashboard({ stocks }) {
  const [selectedSymbol, setSelectedSymbol] = useState(stocks[0]?.symbol || "");
  const [chartData, setChartData] = useState(null);

  const marketStats = {
    totalMarketCap: stocks.reduce((sum, stock) => sum + (Number(stock.marketCap) || 0), 0),
    gainers: stocks.filter((stock) => (Number(stock.change) || 0) > 0).length,
    losers: stocks.filter((stock) => (Number(stock.change) || 0) < 0).length,
    totalVolume: stocks.reduce((sum, stock) => sum + (Number(stock.volume) || 0), 0),
  };

  const topMovers = [...stocks]
    .sort((a, b) => Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0))
    .slice(0, 6);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedSymbol}&interval=5min&apikey=${API_KEY}`
        );

        const timeSeries = res.data["Time Series (5min)"];
        if (!timeSeries) {
          setChartData(null);
          return;
        }

        const labels = Object.keys(timeSeries).reverse().slice(0, 20);
        const prices = labels.map((time) => parseFloat(timeSeries[time]["1. open"]));

        setChartData({
          labels,
          datasets: [
            {
              label: `${selectedSymbol} Price`,
              data: prices,
              borderColor: "#4CAF50",
              tension: 0.3,
              fill: false,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching stock chart data", err);
        setChartData(null);
      }
    };

    if (selectedSymbol) fetchChart();
  }, [selectedSymbol]);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Price" } },
    },
  };

  return (
    <div className="fade-in-up">
      <h2 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "2rem", fontWeight: "800" }}>
        Market Overview
      </h2>

      {/* 📊 Market Stats */}
      <div className="grid grid-4" style={{ marginBottom: "3rem" }}>
        <div className="stats-card">
          <div className="stats-value">
            ${((marketStats.totalMarketCap || 0) / 1e9).toFixed(2)}B
          </div>
          <div className="stats-label">Total Market Cap</div>
        </div>
        <div className="stats-card" style={{ background: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)" }}>
          <div className="stats-value">{marketStats.gainers}</div>
          <div className="stats-label">Gainers Today</div>
        </div>
        <div className="stats-card" style={{ background: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)" }}>
          <div className="stats-value">{marketStats.losers}</div>
          <div className="stats-label">Losers Today</div>
        </div>
        <div className="stats-card" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
          <div className="stats-value">
            {((marketStats.totalVolume || 0) / 1e6).toFixed(2)}M
          </div>
          <div className="stats-label">Total Volume</div>
        </div>
      </div>

      {/* 📈 Live Stock Chart */}
      <div className="card" style={{ marginBottom: "3rem" }}>
        <div className="card-header">
          <h3 className="card-title">📈 Intraday Stock Chart</h3>
          <p className="card-subtitle">Live chart for selected stock (5-min interval)</p>
        </div>
        <div style={{ padding: "1rem" }}>
          <label htmlFor="stock-select">Choose stock: </label>
          <select
            id="stock-select"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            style={{ padding: "0.5rem", marginBottom: "1rem" }}
          >
            {stocks.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol}
              </option>
            ))}
          </select>

          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p>Loading chart or data unavailable.</p>
          )}
        </div>
      </div>

      {/* 🚀 Top Movers */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🚀 Top Market Movers</h3>
          <p className="card-subtitle">Stocks with the highest price movements today</p>
        </div>
        <div className="stock-list">
          {topMovers.map((stock) => (
            <div key={stock.symbol} className="stock-item">
              <div className="stock-info">
                <h3>{stock.symbol}</h3>
                <p>{stock.name || "N/A"}</p>
              </div>
              <div className="stock-price">
                <div className="price">${(stock.price || 0).toFixed(2)}</div>
                <div className={`change ${stock.change >= 0 ? "positive" : "negative"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {(stock.changePercent || 0).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
