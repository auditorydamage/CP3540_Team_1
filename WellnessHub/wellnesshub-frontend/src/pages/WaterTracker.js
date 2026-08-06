import { useState } from "react";

function WaterTracker() {
  const [waterGoal, setWaterGoal] = useState(2500);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("ml");
  const [message, setMessage] = useState("");

  function handleAddWater(event) {
    event.preventDefault();
    setMessage("");

    const enteredAmount = Number(amount);

    if (!enteredAmount || enteredAmount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    const amountInMillilitres =
      unit === "cups" ? enteredAmount * 250 : enteredAmount;

    setCurrentIntake((current) => current + amountInMillilitres);
    setAmount("");
  }

  function handleReset() {
    setCurrentIntake(0);
    setMessage("");
  }

  const progressPercentage = Math.min(
    (currentIntake / waterGoal) * 100,
    100
  );

  const goalReached = currentIntake >= waterGoal;

  return (
    <div style={{ padding: "30px" }}>
      <h1>💧 Water Tracker</h1>

      <p>Track your daily water intake and hydration goal.</p>

      <div
        style={{
          maxWidth: "700px",
          marginTop: "30px",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >
          <div>
            <h2>Today's Progress</h2>

            <p style={{ fontSize: "24px", fontWeight: "700" }}>
              {Math.round(currentIntake)} / {waterGoal} mL
            </p>
          </div>

          <div>
            <label htmlFor="waterGoal">Daily goal</label>

            <input
              id="waterGoal"
              type="number"
              min="1"
              value={waterGoal}
              onChange={(event) =>
                setWaterGoal(Number(event.target.value))
              }
              style={{
                ...inputStyle,
                width: "160px"
              }}
            />
          </div>
        </div>

        <div
          style={{
            height: "24px",
            marginTop: "20px",
            backgroundColor: "#e5e7eb",
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${progressPercentage}%`,
              height: "100%",
              backgroundColor: goalReached ? "#4f8a3c" : "#4d83b8",
              transition: "width 0.3s ease"
            }}
          />
        </div>

        <p style={{ marginTop: "10px" }}>
          {Math.round(progressPercentage)}% of daily goal
        </p>

        {goalReached && (
          <p
            style={{
              padding: "12px",
              borderRadius: "7px",
              backgroundColor: "#e6f4df",
              color: "#2f6b2f",
              fontWeight: "700"
            }}
          >
            Daily hydration goal reached!
          </p>
        )}

        <form
          onSubmit={handleAddWater}
          style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr auto",
            gap: "12px",
            alignItems: "end"
          }}
        >
          <div>
            <label htmlFor="waterAmount">Amount</label>

            <input
              id="waterAmount"
              type="number"
              min="1"
              step="0.1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder={unit === "ml" ? "Example: 500" : "Example: 2"}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="waterUnit">Unit</label>

            <select
              id="waterUnit"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              style={inputStyle}
            >
              <option value="ml">Millilitres</option>
              <option value="cups">Cups</option>
            </select>
          </div>

          <button type="submit" style={primaryButtonStyle}>
            Add Water
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "16px",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: "#fde8df",
              color: "#9a3412"
            }}
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleReset}
          style={{
            marginTop: "20px",
            padding: "10px 18px",
            border: "1px solid #aeb4bd",
            borderRadius: "7px",
            backgroundColor: "#ffffff",
            cursor: "pointer"
          }}
        >
          Reset Daily Intake
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: "8px",
  padding: "11px 12px",
  border: "1px solid #cfd4dc",
  borderRadius: "7px",
  fontSize: "15px",
  boxSizing: "border-box"
};

const primaryButtonStyle = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#2f3542",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer"
};

export default WaterTracker;