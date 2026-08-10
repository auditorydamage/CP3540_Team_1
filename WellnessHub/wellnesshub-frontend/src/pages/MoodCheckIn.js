import { useState } from "react";
import { useWellness } from "../context/WellnessContext";

const moodOptions = [
  { value: "great", emoji: "😄", label: "Great" },
  { value: "good", emoji: "🙂", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "stressed", emoji: "😟", label: "Stressed" },
  { value: "sad", emoji: "😢", label: "Sad" }
];

function MoodCheckIn() {
  const { setLatestMood } = useWellness();

  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [savedCheckIn, setSavedCheckIn] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!selectedMood) {
      setMessage("Please select a mood before submitting.");
      return;
    }

    const selectedMoodDetails = moodOptions.find(
      (mood) => mood.value === selectedMood
    );

    const checkIn = {
      mood: selectedMoodDetails,
      note: note.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    // Save locally on this page
    setSavedCheckIn(checkIn);

    // Save to shared frontend state so Dashboard updates
    setLatestMood(selectedMoodDetails);

    setMessage("Mood check-in saved successfully.");
    setSelectedMood("");
    setNote("");
  }

  function getSuggestion() {
    if (!savedCheckIn) {
      return "";
    }

    if (
      savedCheckIn.mood.value === "stressed" ||
      savedCheckIn.mood.value === "sad"
    ) {
      return "Take a few slow breaths, step away for a short break, or try a calming activity.";
    }

    if (savedCheckIn.mood.value === "okay") {
      return "A short walk, stretch, or glass of water may help improve the rest of your day.";
    }

    return "Keep up the positive momentum and continue checking in with yourself.";
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>😊 Mood Check-In</h1>

      <p>Take a moment to record how you are feeling today.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "700px",
          marginTop: "30px",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
        }}
      >
        <h2 style={{ marginTop: 0 }}>How are you feeling?</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "12px",
            marginTop: "20px"
          }}
        >
          {moodOptions.map((mood) => {
            const isSelected = selectedMood === mood.value;

            return (
              <button
                key={mood.value}
                type="button"
                onClick={() => {
                  setSelectedMood(mood.value);
                  setMessage("");
                }}
                aria-pressed={isSelected}
                style={{
                  padding: "16px 8px",
                  border: isSelected
                    ? "2px solid #465269"
                    : "1px solid #cfd4dc",
                  borderRadius: "10px",
                  backgroundColor: isSelected ? "#e8edf5" : "#ffffff",
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

                <span style={{ fontWeight: "700" }}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "24px" }}>
          <label htmlFor="moodNote">Optional note</label>

          <textarea
            id="moodNote"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength="300"
            rows="5"
            placeholder="Add a short note about your day..."
            style={{
              display: "block",
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #cfd4dc",
              borderRadius: "7px",
              fontSize: "15px",
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box"
            }}
          />

          <small style={{ color: "#667085" }}>
            {note.length}/300 characters
          </small>
        </div>

        {message && (
          <p
            role="alert"
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "7px",
              backgroundColor: message.includes("successfully")
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
          Save Check-In
        </button>
      </form>

      {savedCheckIn && (
        <section
          style={{
            maxWidth: "700px",
            marginTop: "24px",
            padding: "24px 30px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Latest Check-In</h2>

          <p style={{ fontSize: "20px" }}>
            <strong>
              {savedCheckIn.mood.emoji} {savedCheckIn.mood.label}
            </strong>
          </p>

          <p>Recorded at {savedCheckIn.time}</p>

          {savedCheckIn.note && (
            <p>
              <strong>Note:</strong> {savedCheckIn.note}
            </p>
          )}

          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "7px",
              backgroundColor:
                savedCheckIn.mood.value === "stressed" ||
                savedCheckIn.mood.value === "sad"
                  ? "#fff1cc"
                  : "#e6f4df"
            }}
          >
            <strong>Wellness suggestion:</strong>

            <p style={{ marginBottom: 0 }}>
              {getSuggestion()}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default MoodCheckIn;