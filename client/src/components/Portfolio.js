import React from "react";

function Portfolio({ portfolio = [], trades = [], balance = 0 }) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const totalValue = portfolio.reduce((sum, item) => sum + (item.totalValue || 0), 0);
  const totalGainLoss = portfolio.reduce((sum, item) => sum + (item.gainLoss || 0), 0);
  const totalGainLossPercent =
    totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

  return (
    <div className="fade-in-up">
      <h2 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "2rem", fontWeight: "800" }}>
        My Portfolio
      </h2>

      {/* Portfolio Summary */}
      <div className="grid grid-4" style={{ marginBottom: "3rem" }}>
        <div className="stats-card">
          <div className="stats-value">{formatter.format(totalValue)}</div>
          <div className="stats-label">Portfolio Value</div>
        </div>

        <div className="stats-card" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
          <div className="stats-value">{formatter.format(balance)}</div>
          <div className="stats-label">Cash Balance</div>
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
          <div className="stats-value">
            {totalGainLoss >= 0 ? "+" : ""}
            {formatter.format(totalGainLoss)}
          </div>
          <div className="stats-label">Total Gain/Loss</div>
        </div>

        <div
          className="stats-card"
          style={{
            background:
              totalGainLossPercent >= 0
                ? "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)"
                : "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
          }}
        >
          <div className="stats-value">{totalGainLossPercent.toFixed(2)}%</div>
          <div className="stats-label">Return %</div>
        </div>
      </div>

      {/* Holdings & Trades */}
      <div className="grid grid-2">
        {/* Holdings Section */}
        <section className="card">
          <header className="card-header">
            <h3 className="card-title">📊 Current Holdings</h3>
            <p className="card-subtitle">Your active stock positions</p>
          </header>
          {portfolio.length === 0 ? (
            <div className="empty-message">
              <div className="icon">📈</div>
              <p>No holdings yet. Start trading to build your portfolio!</p>
            </div>
          ) : (
            <div className="stock-list">
              {portfolio.map((item) => (
                <div key={item.symbol} className="stock-item">
                  <div className="stock-info">
                    <h3>{item.symbol}</h3>
                    <p>
                      {item.shares} shares @ ${item.avgPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="stock-price">
                    <div className="price">{formatter.format(item.totalValue)}</div>
                    <div className={`change ${item.gainLoss >= 0 ? "positive" : "negative"}`}>
                      {item.gainLoss >= 0 ? "+" : ""}
                      {formatter.format(item.gainLoss)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trades Section */}
        <section className="card">
          <header className="card-header">
            <h3 className="card-title">📋 Recent Trades</h3>
            <p className="card-subtitle">Your latest trading activity</p>
          </header>
          {trades.length === 0 ? (
            <div className="empty-message">
              <div className="icon">💹</div>
              <p>No trades yet. Start trading to see your activity!</p>
            </div>
          ) : (
            <div className="stock-list">
              {trades.slice(0, 10).map((trade) => (
                <div key={trade._id} className="stock-item">
                  <div className="stock-info">
                    <h3>
                      <span className={`badge ${trade.type === "buy" ? "buy" : "sell"}`}>
                        {trade.type?.toUpperCase()}
                      </span>{" "}
                      {trade.symbol}
                    </h3>
                    <p>
                      {trade.shares} shares @ ${trade.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="stock-price">
                    <div className="price">{formatter.format(trade.total)}</div>
                    <div className="timestamp">
                      {new Date(trade.timestamp).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Portfolio;
