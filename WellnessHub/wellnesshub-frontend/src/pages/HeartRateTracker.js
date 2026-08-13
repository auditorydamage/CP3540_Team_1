import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function HeartRateTracker() {
  const [heartRateRecords, setHeartRateRecords] = useState([]);
  const [heartRate, setHeartRate] = useState("");
  const [recordDate, setRecordDate] = useState(getTodayDate());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadHeartRateRecords();
  }, []);

  async function loadHeartRateRecords() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/heartrate");
      const records = data.heartRateRecords || [];

      const sortedRecords = [...records].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setHeartRateRecords(sortedRecords);
    } catch (error) {
      console.error("Unable to load heart rate records:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const enteredHeartRate = Number(heartRate);

    if (!enteredHeartRate || enteredHeartRate < 1) {
      setError("Please enter a valid heart rate.");
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest("/heartrate", {
        method: "POST",
        body: JSON.stringify({
          heartRate: enteredHeartRate,
          date: createLocalDate(recordDate).toISOString()
        })
      });

      setHeartRateRecords((currentRecords) => {
        const updated = [
          data.heartRateRecord,
          ...currentRecords
        ];

        return updated.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      });

      setHeartRate("");
      setRecordDate(getTodayDate());
      setMessage("Heart rate record added successfully.");
    } catch (error) {
      console.error("Unable to add heart rate:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteHeartRateRecord(recordId) {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await apiRequest(`/heartrate/${recordId}`, {
        method: "DELETE"
      });

      setHeartRateRecords((currentRecords) =>
        currentRecords.filter(
          (record) => record._id !== recordId
        )
      );

      setMessage("Heart rate record removed.");
    } catch (error) {
      console.error("Unable to delete heart rate record:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>❤️ Heart Rate Tracker</h1>

      <p>
        Record your heart rate and review previous measurements.
      </p>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>
          Log Heart Rate
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            <div>
              <label htmlFor="heartRate">
                Heart rate (BPM)
              </label>

              <input
                id="heartRate"
                type="number"
                min="1"
                value={heartRate}
                onChange={(event) =>
                  setHeartRate(event.target.value)
                }
                placeholder="Example: 72"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="heartRateDate">
                Date
              </label>

              <input
                id="heartRateDate"
                type="date"
                value={recordDate}
                onChange={(event) =>
                  setRecordDate(event.target.value)
                }
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={primaryButtonStyle}
          >
            {saving ? "Saving..." : "Add Heart Rate"}
          </button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}
        {message && <p style={successStyle}>{message}</p>}
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>
          Heart Rate History
        </h2>

        {loading ? (
          <p>Loading heart rate records...</p>
        ) : heartRateRecords.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No heart rate records yet.
          </p>
        ) : (
          heartRateRecords.slice(0, 10).map((record) => (
            <div key={record._id} style={rowStyle}>
              <div>
                <strong>
                  ❤️ {record.heartRate} BPM
                </strong>

                <div style={dateStyle}>
                  {formatDate(record.date)}
                </div>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  deleteHeartRateRecord(record._id)
                }
                style={deleteButtonStyle}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createLocalDate(dateString) {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day, 12, 0, 0);
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

const cardStyle = {
  maxWidth: "850px",
  marginTop: "25px",
  padding: "30px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px"
};

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
  marginTop: "20px",
  padding: "12px 20px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#2f3542",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer"
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "16px 0",
  borderBottom: "1px solid #e5e7eb"
};

const deleteButtonStyle = {
  padding: "8px 12px",
  border: "1px solid #cfd4dc",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  color: "#9a3412",
  cursor: "pointer"
};

const dateStyle = {
  marginTop: "5px",
  color: "#667085",
  fontSize: "14px"
};

const errorStyle = {
  marginTop: "20px",
  padding: "12px",
  backgroundColor: "#fde8df",
  color: "#9a3412",
  borderRadius: "7px"
};

const successStyle = {
  marginTop: "20px",
  padding: "12px",
  backgroundColor: "#e6f4df",
  color: "#2f6b2f",
  borderRadius: "7px"
};

export default HeartRateTracker;