import "./style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
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
        <h2>Create your Tripzy account</h2>
        <p className="muted">Plan smarter. Travel smoother.</p>

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
            placeholder="Choose a password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" className="auth-btn">Create Account</button>
        </form>

        <p className="muted small">
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Log in
          </span>
        </p>

        <p className="muted small link" onClick={() => navigate("/home")}>
          ← Back to Home
        </p>
      </div>
    </div>
  );
}
