import { useState } from "react";
import { AccountAdmin } from "../components/AccountAdmin.js";
import { ArticleAdmin } from "../components/ArticleAdmin.js";

function AdminDashboard() {

  const [articleVisible, setArticleVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);

  function toggleArtAdmin () {
    setArticleVisible(!articleVisible);
    console.log(articleVisible);
  }

  function toggleAcctAdmin () {
    setAccountVisible(!accountVisible);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome to WellnessHub!</h1>

      <h2>Administrator Dashboard</h2>

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
          { !accountVisible ? 
            <h3 style={{ cursor: "pointer" }} onClick={toggleAcctAdmin}>▶     Manage accounts</h3> : 
            <>
              <h3 style={{ cursor: "pointer" }} onClick={toggleAcctAdmin}>▼     Manage accounts</h3>
              <AccountAdmin />
           </>
          }
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
          { !articleVisible ? 
            <h3 style={{ cursor: "pointer" }} onClick={toggleArtAdmin}>▶     Manage articles</h3> : 
            <>
              <h3 style={{ cursor: "pointer" }} onClick={toggleArtAdmin}>▼     Manage articles</h3>
              <ArticleAdmin />
           </>
          }
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;