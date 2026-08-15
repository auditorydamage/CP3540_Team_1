import { NavLink, useNavigate } from "react-router-dom";
import { logout, getStoredAccount } from "../services/api";

function Sidebar() {
  const navigate = useNavigate();

  const account = getStoredAccount();

  const linkStyle = ({ isActive }) => ({
    display: "block",
    color: "white",
    textDecoration: "none",
    padding: "12px 10px",
    borderRadius: "6px",
    marginBottom: "4px",
    backgroundColor: isActive ? "#465269" : "transparent"
  });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside
      style={{
        width: "230px",
        minHeight: "100vh",
        backgroundColor: "#2f3542",
        color: "white",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <h2>WellnessHub</h2>

      <hr />

      <nav>
        { account.accountType === "user" &&
        <>
        <NavLink to="/dashboard" style={linkStyle}>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/water" style={linkStyle}>
          💧 Water Tracker
        </NavLink>

        <NavLink to="/mood" style={linkStyle}>
          😊 Mood Check-In
        </NavLink>

        <NavLink to="/sleep" style={linkStyle}>
          😴 Sleep Tracker
        </NavLink>

        <NavLink to="/heartrate" style={linkStyle}>
          ❤️ Heart Rate
        </NavLink>

        <NavLink to="/weight" style={linkStyle}>
          ⚖️ Weight Tracker
        </NavLink>

        <NavLink to="/exercise" style={linkStyle}>
          🏃 Exercise
        </NavLink>

        <NavLink to="/recipes" style={linkStyle}>
          🍎 Recipes
        </NavLink>

        <NavLink to="/articles" style={linkStyle}>
          📚 Articles
        </NavLink>

        <NavLink to="/profile" style={linkStyle}>
          👤 Profile
        </NavLink>
        </> }

        { account.accountType === "provider" &&
         <NavLink to="/provider-dashboard" style={linkStyle}>
          🏠 Content Provider Dashboard
         </NavLink>
        }

        { account.accountType === "admin" &&
         <NavLink to="/admin-dashboard" style={linkStyle}>
          🏠 Administrator Dashboard
         </NavLink>
        }
      </nav>

      <hr />

      <button
        type="button"
        onClick={handleLogout}
        style={{
          display: "block",
          width: "100%",
          background: "transparent",
          border: "none",
          color: "white",
          padding: "12px 10px",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
          textAlign: "left"
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}

export default Sidebar;