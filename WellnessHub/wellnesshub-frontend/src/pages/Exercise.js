import { useEffect, useState } from "react";
import { useWellness } from "../context/WellnessContext";
import { apiRequest } from "../services/api";

const activityOptions = [
  "Walking",
  "Running",
  "Cycling",
  "Weight Training",
  "Yoga",
  "Swimming",
  "Sports",
  "Other"
];

function Exercise() {
  const {
    exerciseMinutes,
    setExerciseMinutes,
    exerciseGoal
  } = useWellness();

  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState("Walking");
  const [customActivity, setCustomActivity] = useState("");
  const [minutes, setMinutes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/activities");

      const records = data.activities || [];

      const sortedRecords = [...records].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setActivities(sortedRecords);

      const todaysActivities = sortedRecords.filter((record) =>
        isToday(record.date)
      );

      const totalMinutes = todaysActivities.reduce(
        (total, record) =>
          total + parseActivity(record.activity).minutes,
        0
      );

      setExerciseMinutes(totalMinutes);
    } catch (error) {
      console.error("Unable to load activities:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const enteredMinutes = Number(minutes);

    if (!enteredMinutes || enteredMinutes <= 0) {
      setError("Please enter a valid exercise duration.");
      return;
    }

    let selectedActivity = activityType;

    if (activityType === "Other") {
      selectedActivity = customActivity.trim();

      if (!selectedActivity) {
        setError("Please enter an activity name.");
        return;
      }
    }

    const activityString =
      `${selectedActivity} | ${enteredMinutes} min`;

    try {
      setSaving(true);

      const data = await apiRequest("/activities", {
        method: "POST",
        body: JSON.stringify({
          activity: activityString,
          date: new Date().toISOString()
        })
      });

      const newActivity = data.activity;

      setActivities((currentActivities) => [
        newActivity,
        ...currentActivities
      ]);

      setExerciseMinutes(
        (currentMinutes) => currentMinutes + enteredMinutes
      );

      setMinutes("");
      setCustomActivity("");
      setActivityType("Walking");

      setMessage("Exercise saved successfully.");
    } catch (error) {
      console.error("Unable to save activity:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteActivity(recordId) {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await apiRequest(`/activities/${recordId}`, {
        method: "DELETE"
      });

      await loadActivities();

      setMessage("Exercise record removed.");
    } catch (error) {
      console.error("Unable to delete activity:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  const progressPercentage = Math.min(
    (exerciseMinutes / exerciseGoal) * 100,
    100
  );

  const goalReached = exerciseMinutes >= exerciseGoal;

  return (
    <div style={{ padding: "30px" }}>
      <h1>🏃 Exercise</h1>

      <p>
        Track your daily exercise and physical activity.
      </p>

      <section
        style={{
          maxWidth: "850px",
          marginTop: "30px",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
        }}
      >
        {loading ? (
          <p>Loading exercise history...</p>
        ) : (
          <>
            <h2 style={{ marginTop: 0 }}>
              Today's Progress
            </h2>

            <p
              style={{
                fontSize: "24px",
                fontWeight: "700"
              }}
            >
              {exerciseMinutes} / {exerciseGoal} minutes
            </p>

            <div
              style={{
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
                  backgroundColor: goalReached
                    ? "#4f8a3c"
                    : "#4d83b8",
                  transition: "width 0.3s ease"
                }}
              />
            </div>

            <p style={{ color: "#667085" }}>
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
                Daily exercise goal reached!
              </p>
            )}

            <h2 style={{ marginTop: "35px" }}>
              Log Exercise
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "15px"
                }}
              >
                <div>
                  <label htmlFor="activityType">
                    Activity
                  </label>

                  <select
                    id="activityType"
                    value={activityType}
                    onChange={(event) =>
                      setActivityType(event.target.value)
                    }
                    style={inputStyle}
                  >
                    {activityOptions.map((activity) => (
                      <option
                        key={activity}
                        value={activity}
                      >
                        {activity}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="exerciseMinutes">
                    Duration (minutes)
                  </label>

                  <input
                    id="exerciseMinutes"
                    type="number"
                    min="1"
                    value={minutes}
                    onChange={(event) =>
                      setMinutes(event.target.value)
                    }
                    placeholder="Example: 30"
                    style={inputStyle}
                  />
                </div>
              </div>

              {activityType === "Other" && (
                <div style={{ marginTop: "15px" }}>
                  <label htmlFor="customActivity">
                    Activity name
                  </label>

                  <input
                    id="customActivity"
                    type="text"
                    value={customActivity}
                    onChange={(event) =>
                      setCustomActivity(event.target.value)
                    }
                    placeholder="Enter activity"
                    style={inputStyle}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                style={primaryButtonStyle}
              >
                {saving ? "Saving..." : "Add Exercise"}
              </button>
            </form>

            {error && (
              <p
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor: "#fde8df",
                  color: "#9a3412",
                  borderRadius: "7px"
                }}
              >
                {error}
              </p>
            )}

            {message && (
              <p
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor: "#e6f4df",
                  color: "#2f6b2f",
                  borderRadius: "7px"
                }}
              >
                {message}
              </p>
            )}
          </>
        )}
      </section>

      <section
        style={{
          maxWidth: "850px",
          marginTop: "25px",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Exercise History
        </h2>

        {activities.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No exercise recorded yet.
          </p>
        ) : (
          activities.slice(0, 10).map((record) => {
            const activityDetails =
              parseActivity(record.activity);

            return (
              <div
                key={record._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  padding: "16px 0",
                  borderBottom: "1px solid #e5e7eb"
                }}
              >
                <div>
                  <strong>
                    🏃 {activityDetails.name}
                  </strong>

                  {activityDetails.minutes > 0 && (
                    <div
                      style={{
                        marginTop: "5px",
                        color: "#465269"
                      }}
                    >
                      {activityDetails.minutes} minutes
                    </div>
                  )}

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

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    deleteActivity(record._id)
                  }
                  style={deleteButtonStyle}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

function parseActivity(activity) {
  const text = String(activity || "");

  const parts = text.split("|");

  const name = parts[0]?.trim() || "Activity";

  if (parts.length < 2) {
    return {
      name,
      minutes: 0
    };
  }

  const minuteMatch = parts[1].match(/(\d+(?:\.\d+)?)/);

  return {
    name,
    minutes: minuteMatch
      ? Number(minuteMatch[1])
      : 0
  };
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

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
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

const deleteButtonStyle = {
  padding: "8px 12px",
  border: "1px solid #cfd4dc",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  color: "#9a3412",
  cursor: "pointer"
};

export default Exercise;