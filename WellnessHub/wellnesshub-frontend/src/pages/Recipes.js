import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Recipes() {
  const [mealPlans, setMealPlans] = useState([]);
  const [meal, setMeal] = useState("");
  const [mealDate, setMealDate] = useState(getTodayDate());

  const [editingId, setEditingId] = useState(null);
  const [editingMeal, setEditingMeal] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMealPlans();
  }, []);

  async function loadMealPlans() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/mealplans");

      const records = data.mealPlans || [];

      const sortedRecords = [...records].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setMealPlans(sortedRecords);
    } catch (error) {
      console.error("Unable to load meal plans:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMeal(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!meal.trim()) {
      setError("Please enter a meal.");
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest("/mealplans", {
        method: "POST",
        body: JSON.stringify({
          meal: meal.trim(),
          date: createLocalDate(mealDate).toISOString()
        })
      });

      const newMealPlan = data.mealPlan;

      setMealPlans((currentMealPlans) => {
        const updatedMealPlans = [
          newMealPlan,
          ...currentMealPlans
        ];

        return updatedMealPlans.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      });

      setMeal("");
      setMealDate(getTodayDate());

      setMessage("Meal added successfully.");
    } catch (error) {
      console.error("Unable to add meal:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function startEditing(record) {
    setEditingId(record._id);
    setEditingMeal(record.meal);
    setError("");
    setMessage("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingMeal("");
  }

  async function saveEdit(record) {
    if (!editingMeal.trim()) {
      setError("Meal cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = await apiRequest(
        `/mealplans/${record._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            meal: editingMeal.trim(),
            date: record.date
          })
        }
      );

      setMealPlans((currentMealPlans) =>
        currentMealPlans.map((mealPlan) =>
          mealPlan._id === record._id
            ? data.mealPlan
            : mealPlan
        )
      );

      setEditingId(null);
      setEditingMeal("");

      setMessage("Meal updated successfully.");
    } catch (error) {
      console.error("Unable to update meal:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMealPlan(recordId) {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await apiRequest(`/mealplans/${recordId}`, {
        method: "DELETE"
      });

      setMealPlans((currentMealPlans) =>
        currentMealPlans.filter(
          (mealPlan) => mealPlan._id !== recordId
        )
      );

      setMessage("Meal removed.");
    } catch (error) {
      console.error("Unable to delete meal:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  const todaysMeals = mealPlans.filter((record) =>
    isToday(record.date)
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1>🍎 Recipes & Meal Planning</h1>

      <p>
        Plan your meals and view personalized recommendations
        as they become available.
      </p>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Add a Meal</h2>

        <form onSubmit={handleAddMeal}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "15px"
            }}
          >
            <div>
              <label htmlFor="meal">Meal</label>

              <input
                id="meal"
                type="text"
                value={meal}
                onChange={(event) =>
                  setMeal(event.target.value)
                }
                placeholder="Example: Chicken, rice and vegetables"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="mealDate">Date</label>

              <input
                id="mealDate"
                type="date"
                value={mealDate}
                onChange={(event) =>
                  setMealDate(event.target.value)
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
            {saving ? "Saving..." : "Add Meal"}
          </button>
        </form>

        {error && (
          <p style={errorStyle}>
            {error}
          </p>
        )}

        {message && (
          <p style={successStyle}>
            {message}
          </p>
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Today's Meals</h2>

        {loading ? (
          <p>Loading meal plans...</p>
        ) : todaysMeals.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No meals planned for today.
          </p>
        ) : (
          todaysMeals.map((record) => (
            <MealPlanRow
              key={record._id}
              record={record}
              editingId={editingId}
              editingMeal={editingMeal}
              setEditingMeal={setEditingMeal}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEdit={saveEdit}
              deleteMealPlan={deleteMealPlan}
              saving={saving}
            />
          ))
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Meal Plan History</h2>

        {loading ? (
          <p>Loading meal plans...</p>
        ) : mealPlans.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No meals have been planned yet.
          </p>
        ) : (
          mealPlans.slice(0, 10).map((record) => (
            <MealPlanRow
              key={record._id}
              record={record}
              editingId={editingId}
              editingMeal={editingMeal}
              setEditingMeal={setEditingMeal}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEdit={saveEdit}
              deleteMealPlan={deleteMealPlan}
              saving={saving}
            />
          ))
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>
          Personalized Recommendations
        </h2>

        <p style={{ color: "#667085" }}>
          Complete your health profile to help personalize
          future recommendations.
        </p>
      </section>
    </div>
  );
}

function MealPlanRow({
  record,
  editingId,
  editingMeal,
  setEditingMeal,
  startEditing,
  cancelEditing,
  saveEdit,
  deleteMealPlan,
  saving
}) {
  const isEditing = editingId === record._id;

  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={editingMeal}
            onChange={(event) =>
              setEditingMeal(event.target.value)
            }
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px"
            }}
          >
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px"
          }}
        >
          <div>
            <strong>🍽️ {record.meal}</strong>

            <div
              style={{
                marginTop: "5px",
                color: "#667085",
                fontSize: "14px"
              }}
            >
              {formatDate(record.date)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px"
            }}
          >
            <button
              type="button"
              disabled={saving}
              onClick={() => startEditing(record)}
              style={smallButtonStyle}
            >
              Edit
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                deleteMealPlan(record._id)
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

const smallButtonStyle = {
  padding: "8px 12px",
  border: "1px solid #cfd4dc",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  cursor: "pointer"
};

const deleteButtonStyle = {
  padding: "8px 12px",
  border: "1px solid #cfd4dc",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  color: "#9a3412",
  cursor: "pointer"
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

export default Recipes;