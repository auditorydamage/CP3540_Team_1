import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    color: "white",
    textDecoration: "none",
    padding: "12px 10px",
    borderRadius: "6px",
    marginBottom: "4px",
    backgroundColor: isActive ? "#465269" : "transparent"
  });

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
        <NavLink to="/dashboard" style={linkStyle}>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/water" style={linkStyle}>
          💧 Water Tracker
        </NavLink>

        <NavLink to="/mood" style={linkStyle}>
          😊 Mood Check-In
        </NavLink>

        <NavLink to="/exercise" style={linkStyle}>
          🏃 Exercise
        </NavLink>

        <NavLink to="/recipes" style={linkStyle}>
          🍎 Recipes
        </NavLink>

        <NavLink to="/profile" style={linkStyle}>
          👤 Profile
        </NavLink>
      </nav>

      <hr />

      <p>Logout</p>
    </aside>
  );
}

export default Sidebar;