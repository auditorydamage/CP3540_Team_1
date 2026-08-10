import { useWellness } from "../context/WellnessContext";

function Dashboard() {
  const {
    waterIntake,
    waterGoal,
    latestMood,
    exerciseMinutes,
    exerciseGoal
  } = useWellness();

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
        <div style={cardStyle}>
          <h3>💧 Water</h3>

          <p>
            {waterIntake} / {waterGoal} mL
          </p>
        </div>

        <div style={cardStyle}>
          <h3>😊 Mood</h3>

          <p>
            {latestMood
              ? `${latestMood.emoji} ${latestMood.label}`
              : "No check-in yet."}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>🏃 Exercise</h3>

          <p>
            {exerciseMinutes} / {exerciseGoal} minutes
          </p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "250px",
  boxShadow: "0 2px 5px rgba(0,0,0,.15)"
};

export default Dashboard;