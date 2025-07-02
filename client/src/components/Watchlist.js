"use client"

function Watchlist({ stocks, watchlist, setWatchlist }) {
  const watchedStocks = stocks.filter((stock) => watchlist.includes(stock.symbol))

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol])
    }
  }

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter((s) => s !== symbol))
  }

  return (
    <div className="fade-in-up">
      <h2 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "2rem", fontWeight: "800" }}>
        My Watchlist
      </h2>

      <div className="grid grid-2">
        {/* Watched Stocks */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">👁️ Watching ({watchedStocks.length})</h3>
            <p className="card-subtitle">Stocks you're monitoring</p>
          </div>
          {watchedStocks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#718096" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👁️</div>
              <p>Your watchlist is empty. Add stocks to monitor!</p>
            </div>
          ) : (
            <div className="stock-list">
              {watchedStocks.map((stock) => (
                <div key={stock.symbol} className="stock-item">
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
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                      style={{ marginTop: "0.5rem", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Stocks */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📊 All Stocks</h3>
            <p className="card-subtitle">Add stocks to your watchlist</p>
          </div>
          <div className="stock-list" style={{ maxHeight: "500px", overflowY: "auto" }}>
            {stocks.map((stock) => (
              <div key={stock.symbol} className="stock-item">
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
                  {!watchlist.includes(stock.symbol) && (
                    <button
                      className="btn btn-primary"
                      onClick={() => addToWatchlist(stock.symbol)}
                      style={{ marginTop: "0.5rem", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    >
                      Watch
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Watchlist
