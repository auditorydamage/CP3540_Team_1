import { useWellness } from "../context/WellnessContext";

function WaterTracker() {
  const {
    waterIntake,
    setWaterIntake,
    waterGoal
  } = useWellness();

  function addWater(amount) {
    setWaterIntake((current) => current + amount);
  }

  function resetWater() {
    setWaterIntake(0);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>💧 Water Tracker</h1>

      <p>Keep track of your daily water intake.</p>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          maxWidth: "500px",
          boxShadow: "0 2px 5px rgba(0,0,0,.15)"
        }}
      >
        <h2>
          {waterIntake} / {waterGoal} mL
        </h2>

        <progress
          value={waterIntake}
          max={waterGoal}
          style={{
            width: "100%",
            height: "25px"
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "25px",
            flexWrap: "wrap"
          }}
        >
          <button onClick={() => addWater(250)}>
            +250 mL
          </button>

          <button onClick={() => addWater(500)}>
            +500 mL
          </button>

          <button onClick={() => addWater(1000)}>
            +1000 mL
          </button>

          <button onClick={resetWater}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default WaterTracker;