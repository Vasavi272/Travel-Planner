import "./style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("auth_user", form.email);
    navigate("/home");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login to Tripzy</h2>
        <p className="muted">Welcome back, traveler!</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="example@mail.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" className="auth-btn">Login</button>
        </form>

        <p className="muted small">
          Don’t have an account?{" "}
          <span className="link" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>

        <p className="muted small link" onClick={() => navigate("/home")}>
          ← Back to Home
        </p>
      </div>
    </div>
  );
  
}
