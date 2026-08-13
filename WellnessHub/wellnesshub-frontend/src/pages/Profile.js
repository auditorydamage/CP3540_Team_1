import { useEffect, useState } from "react";
import { apiRequest, getStoredAccount } from "../services/api";

function Profile() {
  const [accountId, setAccountId] = useState(null);

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

  const [originalWeight, setOriginalWeight] = useState({
    weight: "",
    unit: "kg"
  });

  const [weightHistory, setWeightHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const storedAccount = getStoredAccount();

      if (!storedAccount?.id) {
        throw new Error("Unable to identify the logged-in account.");
      }

      setAccountId(storedAccount.id);

      const [accountData, weightData] = await Promise.all([
        apiRequest(`/accounts/${storedAccount.id}`),
        apiRequest("/weight")
      ]);

      const userData = accountData.account?.userData || {};
      const sortedWeights = [...(weightData.weightRecords || [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setWeightHistory(sortedWeights);

      const latestWeight = sortedWeights[0];

      setFormData((current) => ({
        ...current,
        heightCm:
          userData.height != null
            ? String(userData.height)
            : "",
        weight: latestWeight
          ? String(latestWeight.weight)
          : "",
        weightUnit: latestWeight?.unit || "kg",
        activityLevel: userData.activityLevel || "",
        wellnessGoal: Array.isArray(userData.wellnessGoal)
          ? userData.wellnessGoal[0] || ""
          : ""
      }));

      if (latestWeight) {
        setOriginalWeight({
          weight: String(latestWeight.weight),
          unit: latestWeight.unit
        });
      }
    } catch (error) {
      console.error("Unable to load profile:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleHeightUnitChange(event) {
    const newUnit = event.target.value;

    setFormData((current) => {
      if (newUnit === "imperial" && current.heightCm) {
        const totalInches = Number(current.heightCm) / 2.54;
        const feet = Math.floor(totalInches / 12);
        let inches = Math.round(totalInches - feet * 12);

        if (inches === 12) {
          inches = 0;
        }

        return {
          ...current,
          heightUnit: "imperial",
          heightFeet: String(feet),
          heightInches: String(inches)
        };
      }

      if (newUnit === "cm" && current.heightFeet) {
        const totalInches =
          Number(current.heightFeet) * 12 +
          Number(current.heightInches || 0);

        return {
          ...current,
          heightUnit: "cm",
          heightCm: (totalInches * 2.54).toFixed(1)
        };
      }

      return {
        ...current,
        heightUnit: newUnit
      };
    });
  }

  function getHeightInCm() {
    if (formData.heightUnit === "cm") {
      return Number(formData.heightCm);
    }

    const totalInches =
      Number(formData.heightFeet) * 12 +
      Number(formData.heightInches || 0);

    return totalInches * 2.54;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    const heightCm = getHeightInCm();
    const weight = Number(formData.weight);

    if (
      !heightCm ||
      heightCm <= 0 ||
      !weight ||
      weight <= 0 ||
      !formData.activityLevel ||
      !formData.wellnessGoal
    ) {
      setError("Please complete the required profile fields.");
      return;
    }

    if (!accountId) {
      setError("Unable to identify the logged-in account.");
      return;
    }

    try {
      setSaving(true);

      await apiRequest(`/accounts/${accountId}`, {
        method: "PUT",
        body: JSON.stringify({
          "userData.height": Number(heightCm.toFixed(1)),
          "userData.activityLevel": formData.activityLevel,
          "userData.wellnessGoal": [formData.wellnessGoal]
        })
      });

      const weightChanged =
        String(formData.weight) !== String(originalWeight.weight) ||
        formData.weightUnit !== originalWeight.unit;

      if (weightChanged) {
        const data = await apiRequest("/weight", {
          method: "POST",
          body: JSON.stringify({
            weight,
            unit: formData.weightUnit,
            date: new Date().toISOString()
          })
        });

        const newWeight = data.weightRecord;

        setWeightHistory((current) => [
          newWeight,
          ...current
        ]);

        setOriginalWeight({
          weight: String(newWeight.weight),
          unit: newWeight.unit
        });
      }

      setMessage("Health profile saved successfully.");
    } catch (error) {
      console.error("Unable to save profile:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1>👤 Health Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1>👤 Health Profile</h1>
      <p>Enter and manage your personal health information.</p>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <div style={gridStyle}>
          <Field label="Height unit *">
            <select
              name="heightUnit"
              value={formData.heightUnit}
              onChange={handleHeightUnitChange}
              style={inputStyle}
            >
              <option value="cm">Centimetres</option>
              <option value="imperial">Feet and inches</option>
            </select>
          </Field>

          <Field
            label={
              formData.heightUnit === "cm"
                ? "Height in centimetres *"
                : "Height in feet and inches *"
            }
          >
            {formData.heightUnit === "cm" ? (
              <input
                name="heightCm"
                type="number"
                min="1"
                step="0.1"
                value={formData.heightCm}
                onChange={handleChange}
                placeholder="Example: 188"
                style={inputStyle}
              />
            ) : (
              <div style={twoColumnStyle}>
                <input
                  name="heightFeet"
                  type="number"
                  min="1"
                  value={formData.heightFeet}
                  onChange={handleChange}
                  placeholder="Feet"
                  style={inputStyle}
                />

                <input
                  name="heightInches"
                  type="number"
                  min="0"
                  max="11"
                  value={formData.heightInches}
                  onChange={handleChange}
                  placeholder="Inches"
                  style={inputStyle}
                />
              </div>
            )}
          </Field>

          <Field label="Weight unit *">
            <select
              name="weightUnit"
              value={formData.weightUnit}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="kg">Kilograms</option>
              <option value="lb">Pounds</option>
            </select>
          </Field>

          <Field
            label={`Weight in ${
              formData.weightUnit === "kg"
                ? "kilograms"
                : "pounds"
            } *`}
          >
            <input
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
          </Field>

          <Field label="Activity level *">
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="lightly active">Lightly active</option>
              <option value="moderately active">Moderately active</option>
              <option value="very active">Very active</option>
              <option value="extra active">Extra active</option>
            </select>
          </Field>
        </div>

        <Field label="Primary wellness goal *" topMargin>
          <select
            name="wellnessGoal"
            value={formData.wellnessGoal}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select a goal</option>
            <option value="lose weight">Lose weight</option>
            <option value="maintain weight">Maintain weight</option>
            <option value="gain muscle">Gain muscle</option>
            <option value="improve fitness">Improve fitness</option>
            <option value="reduce stress">Reduce stress</option>
            <option value="general wellness">General wellness</option>
          </select>
        </Field>

        {error && <p style={errorStyle}>{error}</p>}
        {message && <p style={successStyle}>{message}</p>}

        <button
          type="submit"
          disabled={saving}
          style={primaryButtonStyle}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Weight History</h2>

        {weightHistory.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No weight records yet.
          </p>
        ) : (
          weightHistory.slice(0, 5).map((record) => (
            <div key={record._id} style={historyRowStyle}>
              <strong>
                {record.weight} {record.unit}
              </strong>

              <span style={{ color: "#667085" }}>
                {formatDate(record.date)}
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function Field({ label, children, topMargin = false }) {
  return (
    <div style={topMargin ? { marginTop: "20px" } : undefined}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

const pageStyle = {
  padding: "30px"
};

const cardStyle = {
  maxWidth: "700px",
  marginTop: "30px",
  padding: "30px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "20px"
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px"
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

const historyRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb"
};

const primaryButtonStyle = {
  marginTop: "24px",
  padding: "12px 22px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#2f3542",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer"
};

const errorStyle = {
  marginTop: "20px",
  padding: "12px",
  borderRadius: "6px",
  backgroundColor: "#fde8df",
  color: "#9a3412"
};

const successStyle = {
  marginTop: "20px",
  padding: "12px",
  borderRadius: "6px",
  backgroundColor: "#e6f4df",
  color: "#2f6b2f"
};

export default Profile;