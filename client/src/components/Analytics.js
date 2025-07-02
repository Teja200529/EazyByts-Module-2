import React from "react"

function Analytics({ portfolio, trades }) {
  const totalInvested = trades
    .filter((trade) => trade.type === "buy")
    .reduce((sum, trade) => sum + trade.total, 0)

  const currentValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0)
  const totalGainLoss = portfolio.reduce((sum, item) => sum + item.gainLoss, 0)

  const bestPerformers = portfolio
    .filter((item) => item.gainLossPercent > 0)
    .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
    .slice(0, 3)

  const worstPerformers = portfolio
    .filter((item) => item.gainLossPercent < 0)
    .sort((a, b) => a.gainLossPercent - b.gainLossPercent)
    .slice(0, 3)

  return (
    <div className="fade-in-up">
      <h2 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "2rem", fontWeight: "800" }}>
        Portfolio Analytics
      </h2>

      {/* Performance Summary */}
      <div className="grid grid-4" style={{ marginBottom: "3rem" }}>
        <div className="stats-card">
          <div className="stats-value">${totalInvested.toLocaleString()}</div>
          <div className="stats-label">Total Invested</div>
        </div>
        <div className="stats-card" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
          <div className="stats-value">${currentValue.toLocaleString()}</div>
          <div className="stats-label">Current Value</div>
        </div>
        <div
          className="stats-card"
          style={{
            background:
              totalGainLoss >= 0
                ? "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)"
                : "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
          }}
        >
          <div className="stats-value">${totalGainLoss.toLocaleString()}</div>
          <div className="stats-label">Total Return</div>
        </div>
        <div className="stats-card" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div className="stats-value">{trades.length}</div>
          <div className="stats-label">Total Trades</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Best Performers */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🏆 Best Performers</h3>
            <p className="card-subtitle">Your most profitable investments</p>
          </div>
          {bestPerformers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#718096" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📈</div>
              <p>No profitable positions yet</p>
            </div>
          ) : (
            <div className="stock-list">
              {bestPerformers.map((item) => (
                <div key={item.symbol} className="stock-item">
                  <div className="stock-info">
                    <h3>{item.symbol}</h3>
                    <p>{item.shares} shares</p>
                  </div>
                  <div className="stock-price">
                    <div className="price">${item.totalValue.toLocaleString()}</div>
                    <div className="change positive">+{item.gainLossPercent.toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Worst Performers */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📉 Worst Performers</h3>
            <p className="card-subtitle">Positions that need attention</p>
          </div>
          {worstPerformers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#718096" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
              <p>No losing positions</p>
            </div>
          ) : (
            <div className="stock-list">
              {worstPerformers.map((item) => (
                <div key={item.symbol} className="stock-item">
                  <div className="stock-info">
                    <h3>{item.symbol}</h3>
                    <p>{item.shares} shares</p>
                  </div>
                  <div className="stock-price">
                    <div className="price">${item.totalValue.toLocaleString()}</div>
                    <div className="change negative">{item.gainLossPercent.toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
