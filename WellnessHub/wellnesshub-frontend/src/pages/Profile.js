import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Profile() {
  const [account, setAccount] = useState(null);

  const [formData, setFormData] = useState({
    heightUnit: "cm",
    heightCm: "",
    heightFeet: "",
    heightInches: "",
    activityLevel: "",
    wellnessGoal: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setProfileError("");

      const data = await apiRequest("/accounts/me");
      const currentAccount = data.account;
      const userData = currentAccount?.userData || {};

      setAccount(currentAccount);

      setFormData((current) => ({
        ...current,
        heightCm:
          userData.height != null
            ? String(userData.height)
            : "",
        activityLevel: userData.activityLevel || "",
        wellnessGoal: Array.isArray(userData.wellnessGoal)
          ? userData.wellnessGoal[0] || ""
          : ""
      }));
    } catch (error) {
      console.error("Unable to load profile:", error);
      setProfileError(error.message);
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

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordData((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleHeightUnitChange(event) {
    const newUnit = event.target.value;

    setFormData((current) => {
      if (newUnit === "imperial" && current.heightCm) {
        const totalInches = Number(current.heightCm) / 2.54;
        let feet = Math.floor(totalInches / 12);
        let inches = Math.round(totalInches - feet * 12);

        if (inches === 12) {
          feet += 1;
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

  async function handleProfileSubmit(event) {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const heightCm = getHeightInCm();

    if (
      !heightCm ||
      heightCm <= 0 ||
      !formData.activityLevel ||
      !formData.wellnessGoal
    ) {
      setProfileError(
        "Please complete the required health profile fields."
      );
      return;
    }

    if (!account?._id) {
      setProfileError(
        "Unable to identify the logged-in account."
      );
      return;
    }

    try {
      setSavingProfile(true);

      await apiRequest(`/accounts/${account._id}`, {
        method: "PUT",
        body: JSON.stringify({
          "userData.height": Number(heightCm.toFixed(1)),
          "userData.activityLevel": formData.activityLevel,
          "userData.wellnessGoal": [formData.wellnessGoal]
        })
      });

      setProfileMessage(
        "Health profile saved successfully."
      );
    } catch (error) {
      console.error("Unable to save profile:", error);
      setProfileError(error.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError(
        "Please complete all password fields."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    try {
      setSavingPassword(true);

      await apiRequest("/accounts/password", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setPasswordMessage(
        "Password changed successfully."
      );
    } catch (error) {
      console.error("Unable to change password:", error);
      setPasswordError(error.message);
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1>👤 Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1>👤 Profile</h1>

      <p>
        View your account information and manage your
        health profile.
      </p>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>
          Account Information
        </h2>

        <div style={accountGridStyle}>
          <AccountField
            label="Username"
            value={account?.username || "Not available"}
          />

          <AccountField
            label="Email"
            value={account?.emailAddress || "Not available"}
          />

          <AccountField
            label="Account Type"
            value={formatAccountType(account?.accountType)}
          />

          <AccountField
            label="Status"
            value={account?.isActive ? "Active" : "Inactive"}
          />
        </div>
      </section>

      <form
        onSubmit={handleProfileSubmit}
        style={cardStyle}
      >
        <h2 style={{ marginTop: 0 }}>
          Health Profile
        </h2>

        <div style={gridStyle}>
          <Field label="Height unit *">
            <select
              name="heightUnit"
              value={formData.heightUnit}
              onChange={handleHeightUnitChange}
              style={inputStyle}
            >
              <option value="cm">
                Centimetres
              </option>

              <option value="imperial">
                Feet and inches
              </option>
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

          <Field label="Activity level *">
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">
                Select activity level
              </option>

              <option value="sedentary">
                Sedentary
              </option>

              <option value="lightly active">
                Lightly active
              </option>

              <option value="moderately active">
                Moderately active
              </option>

              <option value="very active">
                Very active
              </option>

              <option value="extra active">
                Extra active
              </option>
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
            <option value="">
              Select a goal
            </option>

            <option value="lose weight">
              Lose weight
            </option>

            <option value="maintain weight">
              Maintain weight
            </option>

            <option value="gain muscle">
              Gain muscle
            </option>

            <option value="improve fitness">
              Improve fitness
            </option>

            <option value="reduce stress">
              Reduce stress
            </option>

            <option value="general wellness">
              General wellness
            </option>
          </select>
        </Field>

        {profileError && (
          <p style={errorStyle}>
            {profileError}
          </p>
        )}

        {profileMessage && (
          <p style={successStyle}>
            {profileMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={savingProfile}
          style={primaryButtonStyle}
        >
          {savingProfile
            ? "Saving..."
            : "Save Profile"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        style={cardStyle}
      >
        <h2 style={{ marginTop: 0 }}>
          Security
        </h2>

        <p style={{ color: "#667085" }}>
          Change the password used to sign in to your
          WellnessHub account.
        </p>

        <Field label="Current password">
          <input
            name="oldPassword"
            type="password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            style={inputStyle}
          />
        </Field>

        <Field label="New password" topMargin>
          <input
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            style={inputStyle}
          />

          {passwordData.newPassword && (
            <PasswordStrength
              password={passwordData.newPassword}
            />
          )}
        </Field>

        <Field label="Confirm new password" topMargin>
          <input
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            style={inputStyle}
          />
        </Field>

        {passwordError && (
          <p style={errorStyle}>
            {passwordError}
          </p>
        )}

        {passwordMessage && (
          <p style={successStyle}>
            {passwordMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={savingPassword}
          style={primaryButtonStyle}
        >
          {savingPassword
            ? "Changing Password..."
            : "Change Password"}
        </button>
      </form>
    </div>
  );
}

function AccountField({ label, value }) {
  return (
    <div style={accountFieldStyle}>
      <span style={accountLabelStyle}>
        {label}
      </span>

      <strong>{value}</strong>
    </div>
  );
}

function Field({ label, children, topMargin = false }) {
  return (
    <div
      style={
        topMargin
          ? { marginTop: "20px" }
          : undefined
      }
    >
      <label>{label}</label>
      {children}
    </div>
  );
}

function PasswordStrength({ password }) {
  const strength = getPasswordStrength(password);

  return (
    <p
      style={{
        marginTop: "8px",
        marginBottom: 0,
        fontSize: "14px",
        color: strength.color
      }}
    >
      Password strength:{" "}
      <strong>{strength.label}</strong>
    </p>
  );
}

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 2) {
    return {
      label: "Weak",
      color: "#b42318"
    };
  }

  if (score <= 4) {
    return {
      label: "Medium",
      color: "#b54708"
    };
  }

  return {
    label: "Strong",
    color: "#2f6b2f"
  };
}

function formatAccountType(accountType) {
  if (!accountType) {
    return "Not available";
  }

  return (
    accountType.charAt(0).toUpperCase() +
    accountType.slice(1)
  );
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

const accountGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "15px"
};

const accountFieldStyle = {
  padding: "15px",
  backgroundColor: "#f5f7fa",
  borderRadius: "8px"
};

const accountLabelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#667085",
  fontSize: "13px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
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