"use client";

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ activeView, setActiveView = () => {}, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "portfolio", label: "Portfolio", icon: "💼" },
    { id: "trading", label: "Trading", icon: "💹" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "watchlist", label: "Watchlist", icon: "👁️" },
  ];

  const currentView = location.pathname.slice(1);

  return (
    <nav className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.id} className="sidebar-item">
            <button
              type="button"
              onClick={() => {
                navigate(`/${item.id}`);
                setActiveView(item.id);
              }}
              className={`sidebar-link ${currentView === item.id ? "active" : ""}`}
              aria-current={currentView === item.id ? "page" : undefined}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          </li>
        ))}

        <li className="sidebar-item">
          <button
            type="button"
            onClick={onLogout}
            className="sidebar-link logout-button"
          >
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-label">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
