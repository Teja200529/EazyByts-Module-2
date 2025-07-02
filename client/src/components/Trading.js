"use client"

import { useState } from "react"

function Trading({ stocks, onTrade, balance }) {
  const [selectedStock, setSelectedStock] = useState("")
  const [tradeType, setTradeType] = useState("buy")
  const [shares, setShares] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isTrading, setIsTrading] = useState(false)

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedStockData = stocks.find((stock) => stock.symbol === selectedStock)
  const estimatedTotal = selectedStockData && shares ? Number(shares) * selectedStockData.price : 0

  const handleTrade = async () => {
    if (!selectedStock || !shares || !selectedStockData) {
      alert("Please fill in all fields")
      return
    }

    const shareCount = Number(shares)
    if (shareCount <= 0) {
      alert("Please enter a valid number of shares")
      return
    }

    setIsTrading(true)
    const success = await onTrade(selectedStock, tradeType, shareCount, selectedStockData.price)

    if (success) {
      setShares("")
      setSelectedStock("")
      showNotification("Trade executed successfully! 🎉")
    } else {
      alert("Trade failed. Please try again.")
    }
    setIsTrading(false)
  }

  const showNotification = (message) => {
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }

  return (
    <div className="fade-in-up">
      <h2 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "2rem", fontWeight: "800" }}>
        Trading Center
      </h2>

      <div className="grid grid-2">
        {/* Trading Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">💹 Place Order</h3>
            <p className="card-subtitle">Buy or sell stocks in real-time</p>
          </div>

          <div className="form-group">
            <label className="form-label">Select Stock</label>
            <select className="form-select" value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}>
              <option value="">Choose a stock...</option>
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Order Type</label>
            <select className="form-select" value={tradeType} onChange={(e) => setTradeType(e.target.value)}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Shares</label>
            <input
              type="number"
              className="form-input"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="Enter number of shares"
            />
          </div>

          {selectedStockData && (
            <div className="card" style={{ background: "#f7fafc", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Current Price:</span>
                <span style={{ fontWeight: "600" }}>${selectedStockData.price.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Estimated Total:</span>
                <span style={{ fontWeight: "600" }}>${estimatedTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Available Balance:</span>
                <span style={{ fontWeight: "600" }}>${balance.toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            className={`btn ${tradeType === "buy" ? "btn-success" : "btn-danger"}`}
            onClick={handleTrade}
            disabled={!selectedStock || !shares || (tradeType === "buy" && estimatedTotal > balance) || isTrading}
            style={{ width: "100%" }}
          >
            {isTrading
              ? "Processing..."
              : `${tradeType === "buy" ? "🛒 Buy" : "💰 Sell"} ${shares} shares of ${selectedStock}`}
          </button>
        </div>

        {/* Market Data */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📊 Live Market Data</h3>
            <p className="card-subtitle">Real-time stock prices</p>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="stock-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {filteredStocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`stock-item ${selectedStock === stock.symbol ? "selected" : ""}`}
                onClick={() => setSelectedStock(stock.symbol)}
                style={{
                  cursor: "pointer",
                  background: selectedStock === stock.symbol ? "#e6fffa" : "transparent",
                  borderLeft: selectedStock === stock.symbol ? "4px solid #38b2ac" : "4px solid transparent",
                }}
              >
                <div className="stock-info">
                  <h3>{stock.symbol}</h3>
                  <p>{stock.name}</p>
                </div>
                <div className="stock-price">
                  <div className="price">${stock.price.toFixed(2)}</div>
                  <div className={`change ${stock.change >= 0 ? "positive" : "negative"}`}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trading
