import { useState } from "react";
import { loginUser } from "../api/auth";
import "../design/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });

      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        window.location.href = "/dashboard";
      } else {
        setError(res.message || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Expense Tracker</h1>
        <h2 className="auth-subtitle">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-link">
          Don’t have an account? <a href="/">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
