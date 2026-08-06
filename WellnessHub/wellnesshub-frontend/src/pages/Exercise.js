import { useState } from "react";

const exerciseOptions = [
  "Walking",
  "Running",
  "Cycling",
  "Strength Training",
  "Yoga",
  "Swimming",
  "Indoor Exercise",
  "Other"
];

const intensityOptions = ["Low", "Moderate", "High"];

function Exercise() {
  const [dailyGoal, setDailyGoal] = useState(45);

  const [formData, setFormData] = useState({
    exerciseType: "Walking",
    duration: "",
    intensity: "Moderate"
  });

  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const duration = Number(formData.duration);

    if (!duration || duration <= 0) {
      setMessage("Please enter a valid exercise duration.");
      return;
    }

    const newActivity = {
      id: Date.now(),
      exerciseType: formData.exerciseType,
      duration,
      intensity: formData.intensity,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setActivities((currentActivities) => [
      newActivity,
      ...currentActivities
    ]);

    setFormData((currentData) => ({
      ...currentData,
      duration: ""
    }));

    setMessage("Exercise activity saved successfully.");
  }

  function handleDelete(activityId) {
    setActivities((currentActivities) =>
      currentActivities.filter(
        (activity) => activity.id !== activityId
      )
    );

    setMessage("");
  }

  function handleClearActivities() {
    setActivities([]);
    setMessage("");
  }

  const totalMinutes = activities.reduce(
    (total, activity) => total + activity.duration,
    0
  );

  const progressPercentage =
    dailyGoal > 0
      ? Math.min((totalMinutes / dailyGoal) * 100, 100)
      : 0;

  const goalReached =
    dailyGoal > 0 && totalMinutes >= dailyGoal;

  return (
    <div style={{ padding: "30px" }}>
      <h1>🏃 Exercise Tracker</h1>

      <p>
        Record your exercise and track your progress toward
        today's activity goal.
      </p>

      <section
        style={{
          maxWidth: "800px",
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
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >
          <div>
            <h2 style={{ marginTop: 0 }}>
              Today's Progress
            </h2>

            <p
              style={{
                marginBottom: "5px",
                fontSize: "26px",
                fontWeight: "700"
              }}
            >
              {totalMinutes} / {dailyGoal} minutes
            </p>

            <p style={{ color: "#667085" }}>
              {activities.length}{" "}
              {activities.length === 1
                ? "activity"
                : "activities"}{" "}
              recorded
            </p>
          </div>

          <div>
            <label htmlFor="dailyGoal">
              Daily goal in minutes
            </label>

            <input
              id="dailyGoal"
              type="number"
              min="1"
              value={dailyGoal}
              onChange={(event) =>
                setDailyGoal(Number(event.target.value))
              }
              style={{
                ...inputStyle,
                width: "180px"
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
              backgroundColor: goalReached
                ? "#4f8a3c"
                : "#4d83b8",
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
            Daily exercise goal reached!
          </p>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "800px",
          marginTop: "24px",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Log Exercise
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "20px"
          }}
        >
          <div>
            <label htmlFor="exerciseType">
              Exercise type
            </label>

            <select
              id="exerciseType"
              name="exerciseType"
              value={formData.exerciseType}
              onChange={handleChange}
              style={inputStyle}
            >
              {exerciseOptions.map((exerciseType) => (
                <option
                  key={exerciseType}
                  value={exerciseType}
                >
                  {exerciseType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="duration">
              Duration in minutes
            </label>

            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Example: 30"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="intensity">
              Intensity
            </label>

            <select
              id="intensity"
              name="intensity"
              value={formData.intensity}
              onChange={handleChange}
              style={inputStyle}
            >
              {intensityOptions.map((intensity) => (
                <option
                  key={intensity}
                  value={intensity}
                >
                  {intensity}
                </option>
              ))}
            </select>
          </div>
        </div>

        {message && (
          <p
            role="alert"
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "7px",
              backgroundColor: message.includes(
                "successfully"
              )
                ? "#e6f4df"
                : "#fde8df",
              color: message.includes("successfully")
                ? "#2f6b2f"
                : "#9a3412"
            }}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          style={{
            marginTop: "24px",
            padding: "12px 22px",
            border: "none",
            borderRadius: "7px",
            backgroundColor: "#2f3542",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Save Exercise
        </button>
      </form>

      <section
        style={{
          maxWidth: "800px",
          marginTop: "24px",
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
            alignItems: "center",
            gap: "20px"
          }}
        >
          <h2 style={{ margin: 0 }}>
            Today's Activities
          </h2>

          {activities.length > 0 && (
            <button
              type="button"
              onClick={handleClearActivities}
              style={secondaryButtonStyle}
            >
              Clear All
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <p
            style={{
              marginTop: "24px",
              color: "#667085"
            }}
          >
            No exercise has been recorded yet.
          </p>
        ) : (
          <div style={{ marginTop: "24px" }}>
            {activities.map((activity) => (
              <article
                key={activity.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "14px",
                  padding: "18px",
                  border: "1px solid #e1e5ea",
                  borderRadius: "9px",
                  backgroundColor: "#f8fafc"
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px"
                    }}
                  >
                    {getExerciseEmoji(
                      activity.exerciseType
                    )}{" "}
                    {activity.exerciseType}
                  </h3>

                  <p
                    style={{
                      margin: "0 0 5px"
                    }}
                  >
                    {activity.duration} minutes ·{" "}
                    {activity.intensity} intensity
                  </p>

                  <small style={{ color: "#667085" }}>
                    Recorded at {activity.time}
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(activity.id)
                  }
                  style={{
                    padding: "9px 14px",
                    border: "1px solid #cfd4dc",
                    borderRadius: "7px",
                    backgroundColor: "#ffffff",
                    color: "#9a3412",
                    cursor: "pointer"
                  }}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getExerciseEmoji(exerciseType) {
  switch (exerciseType) {
    case "Walking":
      return "🚶";
    case "Running":
      return "🏃";
    case "Cycling":
      return "🚴";
    case "Strength Training":
      return "🏋️";
    case "Yoga":
      return "🧘";
    case "Swimming":
      return "🏊";
    case "Indoor Exercise":
      return "🤸";
    default:
      return "🏅";
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

const secondaryButtonStyle = {
  padding: "9px 14px",
  border: "1px solid #aeb4bd",
  borderRadius: "7px",
  backgroundColor: "#ffffff",
  cursor: "pointer"
};

export default Exercise;