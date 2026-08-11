import { useState, useEffect } from "react";
import { ArticleEditor } from "../components/Article.js";
import { AccountAdmin } from "../components/AccountAdmin.js";

function AdminDashboard() {

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome to WellnessHub!</h1>

      <p>Administrator Dashboard</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "80%",
            boxShadow: "0 2px 5px rgba(0,0,0,.15)"
          }}
        >
          <h3>Manage accounts</h3>
          <AccountAdmin />
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "80%",
            boxShadow: "0 2px 5px rgba(0,0,0,.15)"
          }}
        >
          <h3>Manage articles</h3>
          { /* call article management component here */ }
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;