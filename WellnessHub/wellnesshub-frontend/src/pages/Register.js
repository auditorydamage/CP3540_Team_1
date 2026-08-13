import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    emailAddress: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !formData.username.trim() ||
      !formData.emailAddress.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/accounts/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password,
            emailAddress: formData.emailAddress.trim(),
            accountType: "user"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to create account."
        );
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to WellnessHub. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = getPasswordStrength(
    formData.password
  );

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-brand">
          <h1>WellnessHub</h1>

          <p>
            Your wellness journey starts here.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <h2>Create Account</h2>

          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            placeholder="Choose a username"
          />

          <label htmlFor="emailAddress">
            Email
          </label>

          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={handleChange}
            autoComplete="email"
            placeholder="Enter your email"
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Create a password"
          />

          {formData.password && (
            <p
              style={{
                marginTop: "8px",
                marginBottom: "4px",
                fontSize: "14px",
                color: passwordStrength.color
              }}
            >
              Password strength:{" "}
              <strong>
                {passwordStrength.label}
              </strong>
            </p>
          )}

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Re-enter your password"
          />

          {error && (
            <p
              className="register-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

          <p className="login-message">
            Already have an account?{" "}
            <Link to="/login">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
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

export default Register;