function Dashboard() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome to WellnessHub!</h1>

      <p>Your personalized wellness dashboard.</p>

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
            width: "250px",
            boxShadow: "0 2px 5px rgba(0,0,0,.15)"
          }}
        >
          <h3>💧 Water</h3>
          <p>0 / 2500 mL</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "250px",
            boxShadow: "0 2px 5px rgba(0,0,0,.15)"
          }}
        >
          <h3>😊 Mood</h3>
          <p>No check-in yet.</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "250px",
            boxShadow: "0 2px 5px rgba(0,0,0,.15)"
          }}
        >
          <h3>🏃 Exercise</h3>
          <p>Today's goal</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;