
# 💹 Stock Market Dashboard

A full-stack MERN (MongoDB, Express.js, React, Node.js) project for simulated stock trading. This app lets users buy/sell stocks, view real-time market data, manage a virtual portfolio, and track performance using interactive charts and analytics.

---

## 🚀 Features

- 🔐 User Authentication using JWT
- 📈 Real-time stock data using Alpha Vantage API
- 💰 Simulated buy/sell trading with ₹100,000 virtual balance
- 📊 Portfolio management with gain/loss tracking
- 📉 Live 5-minute interval chart
- 📋 Recent trades history
- 📌 Watchlist for favorite stocks
- 📊 Analytics section to track performance

---

## 🛠️ Tech Stack

- **Frontend**: React, Chart.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT-based
- **Live Data**: Alpha Vantage API

---

## 📦 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Teja200529/stock-market-dashboard.git
cd stock-market-dashboard
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

#### ➕ Create `.env` file inside `/server`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

Then start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

App runs at: `http://localhost:3000`

---

## 📚 API Routes

### 🔐 Auth
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user and return token

### 📊 Portfolio & Trades
- `GET /api/portfolio` – Fetch current user's portfolio
- `POST /api/trades` – Execute a buy or sell trade
- `GET /api/trades` – Get user's trade history
https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedSymbol}&interval=5min&apikey=${API_KEY}`

### 📈 Stocks
- `POST /api/stocks/quotes` – Get current stock quotes



## 📌 Notes

- The app uses virtual balance only.
- Stock price refreshes every 30 seconds.
- Chart data uses Alpha Vantage’s intraday 5-minute interval API.
- Requires free API key from https://www.alphavantage.co/

---

## 🤝 Contributing

Pull requests, bug fixes, and improvements are welcome!

---

## 👨‍💻 Author

**Your Name**  
GitHub: [@Teja200529](https://github.com/Teja200529)

---
