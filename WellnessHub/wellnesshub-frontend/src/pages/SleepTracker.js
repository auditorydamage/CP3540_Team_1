import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function SleepTracker() {
  const [sleepRecords, setSleepRecords] = useState([]);
  const [hours, setHours] = useState("");
  const [sleepDate, setSleepDate] = useState(getTodayDate());

  const [editingId, setEditingId] = useState(null);
  const [editingHours, setEditingHours] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSleepRecords();
  }, []);

  async function loadSleepRecords() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/sleep");
      const records = data.sleepRecords || [];

      const sortedRecords = [...records].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setSleepRecords(sortedRecords);
    } catch (error) {
      console.error("Unable to load sleep records:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const enteredHours = Number(hours);

    if (!enteredHours || enteredHours <= 0 || enteredHours > 24) {
      setError("Please enter sleep hours between 0 and 24.");
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest("/sleep", {
        method: "POST",
        body: JSON.stringify({
          hours: enteredHours,
          date: createLocalDate(sleepDate).toISOString()
        })
      });

      setSleepRecords((currentRecords) => {
        const updated = [
          data.sleepRecord,
          ...currentRecords
        ];

        return updated.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      });

      setHours("");
      setSleepDate(getTodayDate());
      setMessage("Sleep record added successfully.");
    } catch (error) {
      console.error("Unable to add sleep record:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function startEditing(record) {
    setEditingId(record._id);
    setEditingHours(String(record.hours));
    setError("");
    setMessage("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingHours("");
  }

  async function saveEdit(record) {
    const updatedHours = Number(editingHours);

    if (
      !updatedHours ||
      updatedHours <= 0 ||
      updatedHours > 24
    ) {
      setError("Please enter sleep hours between 0 and 24.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = await apiRequest(
        `/sleep/${record._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            hours: updatedHours,
            date: record.date
          })
        }
      );

      setSleepRecords((currentRecords) =>
        currentRecords.map((sleepRecord) =>
          sleepRecord._id === record._id
            ? data.sleepRecord
            : sleepRecord
        )
      );

      setEditingId(null);
      setEditingHours("");
      setMessage("Sleep record updated successfully.");
    } catch (error) {
      console.error("Unable to update sleep record:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteSleepRecord(recordId) {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await apiRequest(`/sleep/${recordId}`, {
        method: "DELETE"
      });

      setSleepRecords((currentRecords) =>
        currentRecords.filter(
          (record) => record._id !== recordId
        )
      );

      setMessage("Sleep record removed.");
    } catch (error) {
      console.error("Unable to delete sleep record:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>😴 Sleep Tracker</h1>

      <p>
        Track your sleep duration and review your sleep history.
      </p>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Log Sleep</h2>

        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            <div>
              <label htmlFor="sleepHours">
                Hours slept
              </label>

              <input
                id="sleepHours"
                type="number"
                min="0.1"
                max="24"
                step="0.1"
                value={hours}
                onChange={(event) =>
                  setHours(event.target.value)
                }
                placeholder="Example: 8"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="sleepDate">
                Date
              </label>

              <input
                id="sleepDate"
                type="date"
                value={sleepDate}
                onChange={(event) =>
                  setSleepDate(event.target.value)
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
            {saving ? "Saving..." : "Add Sleep"}
          </button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}
        {message && <p style={successStyle}>{message}</p>}
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Sleep History</h2>

        {loading ? (
          <p>Loading sleep records...</p>
        ) : sleepRecords.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No sleep records yet.
          </p>
        ) : (
          sleepRecords.slice(0, 10).map((record) => {
            const isEditing = editingId === record._id;

            return (
              <div key={record._id} style={rowStyle}>
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      min="0.1"
                      max="24"
                      step="0.1"
                      value={editingHours}
                      onChange={(event) =>
                        setEditingHours(event.target.value)
                      }
                      style={inputStyle}
                    />

                    <div style={buttonRowStyle}>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => saveEdit(record)}
                        style={smallButtonStyle}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={cancelEditing}
                        style={smallButtonStyle}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={rowContentStyle}>
                    <div>
                      <strong>
                        😴 {record.hours} hours
                      </strong>

                      <div style={dateStyle}>
                        {formatDate(record.date)}
                      </div>
                    </div>

                    <div style={buttonRowStyle}>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          startEditing(record)
                        }
                        style={smallButtonStyle}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          deleteSleepRecord(record._id)
                        }
                        style={deleteButtonStyle}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
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
  padding: "16px 0",
  borderBottom: "1px solid #e5e7eb"
};

const rowContentStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px"
};

const buttonRowStyle = {
  display: "flex",
  gap: "8px"
};

const smallButtonStyle = {
  padding: "8px 12px",
  border: "1px solid #cfd4dc",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  cursor: "pointer"
};

const deleteButtonStyle = {
  ...smallButtonStyle,
  color: "#9a3412"
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

export default SleepTracker;