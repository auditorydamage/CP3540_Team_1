import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function WeightTracker() {
  const [weightRecords, setWeightRecords] = useState([]);
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [recordDate, setRecordDate] = useState(getTodayDate());

  const [editingId, setEditingId] = useState(null);
  const [editingWeight, setEditingWeight] = useState("");
  const [editingUnit, setEditingUnit] = useState("kg");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadWeightRecords();
  }, []);

  async function loadWeightRecords() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/weight");
      const records = data.weightRecords || [];

      const sortedRecords = [...records].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setWeightRecords(sortedRecords);
    } catch (error) {
      console.error("Unable to load weight records:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const enteredWeight = Number(weight);

    if (!enteredWeight || enteredWeight <= 0) {
      setError("Please enter a valid weight.");
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest("/weight", {
        method: "POST",
        body: JSON.stringify({
          weight: enteredWeight,
          unit,
          date: createLocalDate(recordDate).toISOString()
        })
      });

      setWeightRecords((currentRecords) => {
        const updated = [
          data.weightRecord,
          ...currentRecords
        ];

        return updated.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      });

      setWeight("");
      setUnit("kg");
      setRecordDate(getTodayDate());
      setMessage("Weight record added successfully.");
    } catch (error) {
      console.error("Unable to add weight record:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function startEditing(record) {
    setEditingId(record._id);
    setEditingWeight(String(record.weight));
    setEditingUnit(record.unit);
    setError("");
    setMessage("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingWeight("");
    setEditingUnit("kg");
  }

  async function saveEdit(record) {
    const updatedWeight = Number(editingWeight);

    if (!updatedWeight || updatedWeight <= 0) {
      setError("Please enter a valid weight.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = await apiRequest(
        `/weight/${record._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            weight: updatedWeight,
            unit: editingUnit,
            date: record.date
          })
        }
      );

      setWeightRecords((currentRecords) =>
        currentRecords.map((weightRecord) =>
          weightRecord._id === record._id
            ? data.weightRecord
            : weightRecord
        )
      );

      setEditingId(null);
      setEditingWeight("");
      setEditingUnit("kg");
      setMessage("Weight record updated successfully.");
    } catch (error) {
      console.error("Unable to update weight record:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteWeightRecord(recordId) {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await apiRequest(`/weight/${recordId}`, {
        method: "DELETE"
      });

      setWeightRecords((currentRecords) =>
        currentRecords.filter(
          (record) => record._id !== recordId
        )
      );

      setMessage("Weight record removed.");
    } catch (error) {
      console.error("Unable to delete weight record:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  const latestWeight = weightRecords[0];

  return (
    <div style={{ padding: "30px" }}>
      <h1>⚖️ Weight Tracker</h1>

      <p>
        Record your weight and review your measurement history.
      </p>

      {latestWeight && (
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            Latest Weight
          </h2>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "5px"
            }}
          >
            {latestWeight.weight} {latestWeight.unit}
          </p>

          <p style={{ color: "#667085" }}>
            {formatDate(latestWeight.date)}
          </p>
        </section>
      )}

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>
          Add Weight
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            <div>
              <label htmlFor="weight">
                Weight
              </label>

              <input
                id="weight"
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(event) =>
                  setWeight(event.target.value)
                }
                placeholder={
                  unit === "kg"
                    ? "Example: 75"
                    : "Example: 165"
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="weightUnit">
                Unit
              </label>

              <select
                id="weightUnit"
                value={unit}
                onChange={(event) =>
                  setUnit(event.target.value)
                }
                style={inputStyle}
              >
                <option value="kg">
                  Kilograms
                </option>

                <option value="lb">
                  Pounds
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="weightDate">
                Date
              </label>

              <input
                id="weightDate"
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
            {saving ? "Saving..." : "Add Weight"}
          </button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}
        {message && <p style={successStyle}>{message}</p>}
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>
          Weight History
        </h2>

        {loading ? (
          <p>Loading weight records...</p>
        ) : weightRecords.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No weight records yet.
          </p>
        ) : (
          weightRecords.slice(0, 10).map((record) => {
            const isEditing = editingId === record._id;

            return (
              <div key={record._id} style={historyRowStyle}>
                {isEditing ? (
                  <div style={{ width: "100%" }}>
                    <div style={editGridStyle}>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={editingWeight}
                        onChange={(event) =>
                          setEditingWeight(event.target.value)
                        }
                        style={inputStyle}
                      />

                      <select
                        value={editingUnit}
                        onChange={(event) =>
                          setEditingUnit(event.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                      </select>
                    </div>

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
                  </div>
                ) : (
                  <>
                    <div>
                      <strong>
                        ⚖️ {record.weight} {record.unit}
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
                          deleteWeightRecord(record._id)
                        }
                        style={deleteButtonStyle}
                      >
                        Remove
                      </button>
                    </div>
                  </>
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

  return new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0
  );
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
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "15px"
};

const editGridStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "10px",
  maxWidth: "350px"
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

const historyRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "16px 0",
  borderBottom: "1px solid #e5e7eb"
};

const buttonRowStyle = {
  display: "flex",
  gap: "8px",
  marginTop: "8px"
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

export default WeightTracker;