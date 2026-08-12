import { useEffect, useState } from "react";
import { useWellness } from "../context/WellnessContext";
import { apiRequest } from "../services/api";

const moodOptions = [
  { value: 1, emoji: "😢", label: "Very Low" },
  { value: 2, emoji: "😞", label: "Low" },
  { value: 3, emoji: "😕", label: "Not Great" },
  { value: 4, emoji: "😐", label: "Okay" },
  { value: 5, emoji: "🙂", label: "Good" },
  { value: 6, emoji: "😊", label: "Very Good" },
  { value: 7, emoji: "😄", label: "Great" }
];

function MoodCheckIn() {
  const { setLatestMood } = useWellness();

  const [selectedMood, setSelectedMood] = useState(null);
  const [moodRecords, setMoodRecords] = useState([]);
  const [latestRecord, setLatestRecord] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMoodRecords();
  }, []);

  async function loadMoodRecords() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/mood");

      const records = data.moodRecords || [];

      const sortedRecords = [...records].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setMoodRecords(sortedRecords);

      if (sortedRecords.length > 0) {
        const latest = sortedRecords[0];
        const moodDetails = getMoodDetails(latest.mood);

        setLatestRecord(latest);

        if (moodDetails) {
          setLatestMood(moodDetails);
        }
      } else {
        setLatestRecord(null);
        setLatestMood(null);
      }
    } catch (error) {
      console.error("Unable to load mood records:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (selectedMood === null) {
      setError("Please select a mood before saving.");
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest("/mood", {
        method: "POST",
        body: JSON.stringify({
          mood: selectedMood,
          date: new Date().toISOString()
        })
      });

      const newRecord = data.moodRecord;
      const moodDetails = getMoodDetails(newRecord.mood);

      setMoodRecords((currentRecords) => [
        newRecord,
        ...currentRecords
      ]);

      setLatestRecord(newRecord);

      if (moodDetails) {
        setLatestMood(moodDetails);
      }

      setSelectedMood(null);
      setMessage("Mood check-in saved successfully.");
    } catch (error) {
      console.error("Unable to save mood:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMoodRecord(recordId) {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await apiRequest(`/mood/${recordId}`, {
        method: "DELETE"
      });

      await loadMoodRecords();

      setMessage("Mood record removed.");
    } catch (error) {
      console.error("Unable to delete mood record:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  const latestMoodDetails = latestRecord
    ? getMoodDetails(latestRecord.mood)
    : null;

  return (
    <div style={{ padding: "30px" }}>
      <h1>😊 Mood Check-In</h1>

      <p>Take a moment to record how you are feeling today.</p>

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
          <p>Loading mood history...</p>
        ) : (
          <>
            <h2 style={{ marginTop: 0 }}>
              How are you feeling?
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(100px, 1fr))",
                  gap: "12px",
                  marginTop: "20px"
                }}
              >
                {moodOptions.map((mood) => {
                  const isSelected =
                    selectedMood === mood.value;

                  return (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() =>
                        setSelectedMood(mood.value)
                      }
                      style={{
                        padding: "16px 8px",
                        border: isSelected
                          ? "2px solid #465269"
                          : "1px solid #cfd4dc",
                        borderRadius: "10px",
                        backgroundColor: isSelected
                          ? "#e8edf5"
                          : "#ffffff",
                        cursor: "pointer"
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "30px",
                          marginBottom: "8px"
                        }}
                      >
                        {mood.emoji}
                      </span>

                      <span
                        style={{
                          fontWeight: "700"
                        }}
                      >
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  marginTop: "25px",
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
                {saving ? "Saving..." : "Save Check-In"}
              </button>
            </form>

            {error && (
              <p
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  borderRadius: "7px",
                  backgroundColor: "#fde8df",
                  color: "#9a3412"
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
                  borderRadius: "7px",
                  backgroundColor: "#e6f4df",
                  color: "#2f6b2f"
                }}
              >
                {message}
              </p>
            )}
          </>
        )}
      </section>

      {latestMoodDetails && latestRecord && (
        <section
          style={{
            maxWidth: "850px",
            marginTop: "24px",
            padding: "25px 30px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Latest Check-In
          </h2>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "700"
            }}
          >
            {latestMoodDetails.emoji}{" "}
            {latestMoodDetails.label}
          </p>

          <p style={{ color: "#667085" }}>
            {formatDate(latestRecord.date)}
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#f4f6f9"
            }}
          >
            <strong>Wellness suggestion</strong>

            <p style={{ marginBottom: 0 }}>
              {getSuggestion(latestRecord.mood)}
            </p>
          </div>
        </section>
      )}

      <section
        style={{
          maxWidth: "850px",
          marginTop: "24px",
          padding: "25px 30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Mood History
        </h2>

        {moodRecords.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No mood check-ins recorded yet.
          </p>
        ) : (
          moodRecords.slice(0, 7).map((record) => {
            const mood = getMoodDetails(record.mood);

            return (
              <div
                key={record._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  padding: "15px 0",
                  borderBottom: "1px solid #e5e7eb"
                }}
              >
                <div>
                  <strong>
                    {mood?.emoji} {mood?.label}
                  </strong>

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
                    deleteMoodRecord(record._id)
                  }
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #cfd4dc",
                    borderRadius: "6px",
                    backgroundColor: "#ffffff",
                    color: "#9a3412",
                    cursor: "pointer"
                  }}
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

function getMoodDetails(value) {
  return moodOptions.find(
    (mood) => mood.value === Number(value)
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

function getSuggestion(mood) {
  if (mood <= 2) {
    return "Consider taking some time to rest, talk with someone you trust, or choose a calming activity.";
  }

  if (mood <= 4) {
    return "A short walk, some water, stretching, or a brief break may help improve the rest of your day.";
  }

  return "Keep up the positive momentum and continue checking in with yourself.";
}

export default MoodCheckIn;