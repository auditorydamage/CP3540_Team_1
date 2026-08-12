import { useEffect, useState } from "react";
import { useWellness } from "../context/WellnessContext";
import { apiRequest } from "../services/api";

function WaterTracker() {
  const {
    waterIntake,
    setWaterIntake,
    waterGoal
  } = useWellness();

  const [todayRecords, setTodayRecords] = useState([]);
  const [customAmount, setCustomAmount] = useState("");
  const [customUnit, setCustomUnit] = useState("ml");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWaterRecords();
  }, []);

  async function loadWaterRecords() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/water");

      const records = data.waterRecords || [];

      const todaysRecords = records.filter((record) =>
        isToday(record.date)
      );

      setTodayRecords(todaysRecords);

      const total = todaysRecords.reduce(
        (sum, record) =>
          sum + convertToMillilitres(record.amount, record.unit),
        0
      );

      setWaterIntake(Math.round(total));
    } catch (error) {
      console.error("Unable to load water records:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function addWater(amount, unit = "ml") {
    try {
      setSaving(true);
      setError("");

      const data = await apiRequest("/water", {
        method: "POST",
        body: JSON.stringify({
          amount,
          unit,
          date: new Date().toISOString()
        })
      });

      const newRecord = data.waterRecord;

      setTodayRecords((currentRecords) => [
        ...currentRecords,
        newRecord
      ]);

      const amountInMl = convertToMillilitres(amount, unit);

      setWaterIntake((currentIntake) =>
        Math.round(currentIntake + amountInMl)
      );
    } catch (error) {
      console.error("Unable to add water:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCustomSubmit(event) {
    event.preventDefault();
    setError("");

    const amount = Number(customAmount);

    if (!amount || amount <= 0) {
      setError("Please enter a valid water amount.");
      return;
    }

    await addWater(amount, customUnit);

    setCustomAmount("");
    setCustomUnit("ml");
  }

  async function resetWater() {
    if (todayRecords.length === 0) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      for (const record of todayRecords) {
        await apiRequest(`/water/${record._id}`, {
          method: "DELETE"
        });
      }

      setTodayRecords([]);
      setWaterIntake(0);
    } catch (error) {
      console.error("Unable to reset water:", error);
      setError(error.message);

      await loadWaterRecords();
    } finally {
      setSaving(false);
    }
  }

  const progressPercentage = Math.min(
    (waterIntake / waterGoal) * 100,
    100
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1>💧 Water Tracker</h1>

      <p>Keep track of your daily water intake.</p>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "650px",
          boxShadow: "0 2px 5px rgba(0,0,0,.15)"
        }}
      >
        {loading ? (
          <p>Loading water intake...</p>
        ) : (
          <>
            <h2>
              {waterIntake} / {waterGoal} mL
            </h2>

            <div
              style={{
                width: "100%",
                height: "20px",
                backgroundColor: "#e5e7eb",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progressPercentage}%`,
                  height: "100%",
                  backgroundColor:
                    waterIntake >= waterGoal
                      ? "#4f8a3c"
                      : "#4d83b8",
                  transition: "width 0.3s ease"
                }}
              />
            </div>

            <p style={{ marginTop: "10px", color: "#667085" }}>
              {Math.round(progressPercentage)}% of daily goal
            </p>

            {waterIntake >= waterGoal && (
              <p
                style={{
                  padding: "10px",
                  backgroundColor: "#e6f4df",
                  color: "#2f6b2f",
                  borderRadius: "6px",
                  fontWeight: "600"
                }}
              >
                Daily hydration goal reached!
              </p>
            )}

            <h3 style={{ marginTop: "30px" }}>
              Quick Add
            </h3>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
              }}
            >
              <button
                type="button"
                onClick={() => addWater(250, "ml")}
                disabled={saving}
                style={buttonStyle}
              >
                +250 mL
              </button>

              <button
                type="button"
                onClick={() => addWater(500, "ml")}
                disabled={saving}
                style={buttonStyle}
              >
                +500 mL
              </button>

              <button
                type="button"
                onClick={() => addWater(1000, "ml")}
                disabled={saving}
                style={buttonStyle}
              >
                +1000 mL
              </button>
            </div>

            <h3 style={{ marginTop: "30px" }}>
              Custom Entry
            </h3>

            <form
              onSubmit={handleCustomSubmit}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr auto",
                gap: "12px",
                alignItems: "end"
              }}
            >
              <div>
                <label htmlFor="customAmount">
                  Amount
                </label>

                <input
                  id="customAmount"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={customAmount}
                  onChange={(event) =>
                    setCustomAmount(event.target.value)
                  }
                  placeholder="Enter amount"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="customUnit">
                  Unit
                </label>

                <select
                  id="customUnit"
                  value={customUnit}
                  onChange={(event) =>
                    setCustomUnit(event.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="ml">mL</option>
                  <option value="fl. oz">fl. oz</option>
                  <option value="cup">Cup</option>
                  <option value="glass">Glass</option>
                  <option value="gal.">Gallon</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={primaryButtonStyle}
              >
                Add Water
              </button>
            </form>

            <div style={{ marginTop: "25px" }}>
              <button
                type="button"
                onClick={resetWater}
                disabled={saving || todayRecords.length === 0}
                style={resetButtonStyle}
              >
                Reset Today's Intake
              </button>
            </div>

            {saving && (
              <p style={{ color: "#667085" }}>
                Saving...
              </p>
            )}

            {error && (
              <p
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "#fde8df",
                  color: "#9a3412",
                  borderRadius: "6px"
                }}
              >
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function isToday(dateValue) {
  const recordDate = new Date(dateValue);
  const today = new Date();

  return (
    recordDate.getFullYear() === today.getFullYear() &&
    recordDate.getMonth() === today.getMonth() &&
    recordDate.getDate() === today.getDate()
  );
}

function convertToMillilitres(amount, unit) {
  switch (unit) {
    case "fl. oz":
      return amount * 29.5735;

    case "gal.":
      return amount * 3785.41;

    case "glass":
      return amount * 250;

    case "cup":
      return amount * 236.588;

    case "ml":
    default:
      return amount;
  }
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

const buttonStyle = {
  padding: "10px 16px",
  border: "1px solid #cfd4dc",
  borderRadius: "7px",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  fontSize: "15px"
};

const primaryButtonStyle = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#2f3542",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700"
};

const resetButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #cfd4dc",
  borderRadius: "7px",
  backgroundColor: "#ffffff",
  cursor: "pointer"
};

export default WaterTracker;