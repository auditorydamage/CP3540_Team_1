import { useState } from "react";

function Profile() {
  const [formData, setFormData] = useState({
    heightUnit: "cm",
    heightCm: "",
    heightFeet: "",
    heightInches: "",
    weightUnit: "kg",
    weight: "",
    activityLevel: "",
    wellnessGoal: ""
  });

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

    const heightCompleted =
      formData.heightUnit === "cm"
        ? Boolean(formData.heightCm)
        : Boolean(formData.heightFeet);

    if (
      !heightCompleted ||
      !formData.weight ||
      !formData.activityLevel ||
      !formData.wellnessGoal
    ) {
      setMessage("Please complete the required profile fields.");
      return;
    }

    setMessage("Health profile saved successfully.");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>👤 Health Profile</h1>

      <p>
        Enter your health information so WellnessHub can personalize your
        dashboard and recommendations.
      </p>

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "20px"
          }}
        >
          <div>
            <label htmlFor="heightUnit">Height unit *</label>

            <select
              id="heightUnit"
              name="heightUnit"
              value={formData.heightUnit}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="cm">Centimetres</option>
              <option value="imperial">Feet and inches</option>
            </select>
          </div>

          <div>
            {formData.heightUnit === "cm" ? (
              <>
                <label htmlFor="heightCm">Height in centimetres *</label>

                <input
                  id="heightCm"
                  name="heightCm"
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.heightCm}
                  onChange={handleChange}
                  placeholder="Example: 188"
                  style={inputStyle}
                />
              </>
            ) : (
              <>
                <label>Height in feet and inches *</label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px"
                  }}
                >
                  <input
                    id="heightFeet"
                    name="heightFeet"
                    type="number"
                    min="1"
                    value={formData.heightFeet}
                    onChange={handleChange}
                    placeholder="Feet"
                    aria-label="Height in feet"
                    style={inputStyle}
                  />

                  <input
                    id="heightInches"
                    name="heightInches"
                    type="number"
                    min="0"
                    max="11"
                    value={formData.heightInches}
                    onChange={handleChange}
                    placeholder="Inches"
                    aria-label="Additional height in inches"
                    style={inputStyle}
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label htmlFor="weightUnit">Weight unit *</label>

            <select
              id="weightUnit"
              name="weightUnit"
              value={formData.weightUnit}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="kg">Kilograms</option>
              <option value="lb">Pounds</option>
            </select>
          </div>

          <div>
            <label htmlFor="weight">
              Weight in {formData.weightUnit === "kg" ? "kilograms" : "pounds"} *
            </label>

            <input
              id="weight"
              name="weight"
              type="number"
              min="1"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              placeholder={
                formData.weightUnit === "kg"
                  ? "Example: 105"
                  : "Example: 230"
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="activityLevel">Activity level *</label>

            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly active</option>
              <option value="moderate">Moderately active</option>
              <option value="very-active">Very active</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label htmlFor="wellnessGoal">Primary wellness goal *</label>

          <select
            id="wellnessGoal"
            name="wellnessGoal"
            value={formData.wellnessGoal}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select a goal</option>
            <option value="lose-weight">Lose weight</option>
            <option value="maintain-weight">Maintain weight</option>
            <option value="gain-muscle">Gain muscle</option>
            <option value="improve-fitness">Improve fitness</option>
            <option value="reduce-stress">Reduce stress</option>
            <option value="general-wellness">General wellness</option>
          </select>
        </div>

        {message && (
          <p
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "6px",
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
          Save Profile
        </button>
      </form>
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

export default Profile;