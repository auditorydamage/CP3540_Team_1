import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh"
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          backgroundColor: "#f5f6fa"
        }}
      >
        <Navbar />

        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;