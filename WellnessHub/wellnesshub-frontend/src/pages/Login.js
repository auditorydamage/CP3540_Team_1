import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password) {
      setError("Please enter your username and password.");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <h1>WellnessHub</h1>
          <p>Your wellness journey starts here.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            placeholder="Enter your username"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="Enter your password"
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit">Log In</button>

          <p className="register-message">
            Don't have an account? Registration coming soon.
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;