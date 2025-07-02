import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Portfolio from "./components/Portfolio";
import Trading from "./components/Trading";
import Analytics from "./components/Analytics";
import Watchlist from "./components/Watchlist";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [trades, setTrades] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [balance, setBalance] = useState(100000);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState(localStorage.getItem("activeView") || "dashboard");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    localStorage.setItem("activeView", activeView);
  }, [activeView]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  const fetchStockData = useCallback(async () => {
    try {
      const symbols = [
        "AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META", "NFLX",
        "RELIANCE.BO", "TCS.BO", "INFY.BO", "HDFCBANK.BO", "^BSESN"
      ];

      const res = await fetch(`${API_BASE}/stocks/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols }),
      });

      const data = await res.json();
      if (data?.stocks) {
        setStocks(data.stocks);
        setError(null);
      } else {
        setError("Failed to load stock data");
      }
    } catch (err) {
      console.error("Error fetching stocks", err);
      setError("Error fetching stock data");
    }
  }, [token]);

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPortfolio(data.portfolio || []);
      setBalance(data.balance);
      setError(null);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Error fetching portfolio");
    }
  }, [token]);

  const fetchTrades = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/trades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrades(data.trades || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching trades:", err);
      setError("Error fetching trades");
    }
  }, [token]);

  const executeTrade = async (symbol, type, shares, price) => {
    try {
      const res = await fetch(`${API_BASE}/trades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol, type, shares, price }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchPortfolio();
        await fetchTrades();
        setBalance(data.newBalance);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Trade execution error:", err);
      setError("Trade failed");
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      const init = async () => {
        setLoading(true);
        await Promise.all([fetchStockData(), fetchPortfolio(), fetchTrades()]);
        setLoading(false);
      };
      init();
      const interval = setInterval(fetchStockData, 30000);
      return () => clearInterval(interval);
    } else {
      setIsAuthenticated(false);
    }
  }, [token, fetchStockData, fetchPortfolio, fetchTrades]);

  if (loading && isAuthenticated) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>Loading Stock Market Data...</h2>
      </div>
    );
  }

  const enrichedPortfolio = portfolio.map((item) => {
    const stock = stocks.find((s) => s.symbol === item.symbol);
    const currentPrice = stock?.price ?? item.avgPrice;
    const totalValue = item.shares * currentPrice;
    const gainLoss = (currentPrice - item.avgPrice) * item.shares;
    const gainLossPercent = item.avgPrice > 0 ? ((currentPrice - item.avgPrice) / item.avgPrice) * 100 : 0;

    return {
      ...item,
      currentPrice,
      totalValue,
      gainLoss,
      gainLossPercent,
    };
  });

  const sensex = stocks.find((s) => s.symbol === "^BSESN");

  const AuthenticatedLayout = ({ children }) => (
    <div className="app-container">
      <Header balance={balance} onLogout={handleLogout} />
      <div className="main-content">
        <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
        <div className="content-area">
          {error && <div className="error-banner">{error}</div>}
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard stocks={stocks} sensex={sensex} /></AuthenticatedLayout>} />
          <Route path="/portfolio" element={<AuthenticatedLayout><Portfolio portfolio={enrichedPortfolio} trades={trades} balance={balance} /></AuthenticatedLayout>} />
          <Route path="/trading" element={<AuthenticatedLayout><Trading stocks={stocks} onTrade={executeTrade} balance={balance} /></AuthenticatedLayout>} />
          <Route path="/analytics" element={<AuthenticatedLayout><Analytics portfolio={enrichedPortfolio} trades={trades} /></AuthenticatedLayout>} />
          <Route path="/watchlist" element={<AuthenticatedLayout><Watchlist stocks={stocks} watchlist={watchlist} setWatchlist={setWatchlist} /></AuthenticatedLayout>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
