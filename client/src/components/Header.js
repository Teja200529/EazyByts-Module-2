function Header({ balance }) {
  let displayBalance = "0.00";

  if (typeof balance === "number" && !isNaN(balance)) {
    displayBalance = balance.toLocaleString();
  }

  return (
    <header className="header">
      <div>
        <h1>
          <div className="header-icon">📈</div>
          StockTrader 
        </h1>
      </div>
      <div className="balance-display">💰 Balance: ${displayBalance}</div>
    </header>
  );
}

export default Header;
