import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api.js";
import { UserContext } from "../../contexts/UserContext.jsx";
import "../auth.css";

export default function Register() {
  const navigate = useNavigate();
  // חילצנו את currentUser כדי לבדוק אם המשתמש כבר מחובר
  const { login, currentUser } = useContext(UserContext);
  
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    verifyPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // הגנה: אם המשתמש כבר מחובר, שלח אותו למסך הבית
  useEffect(() => {
    if (currentUser) {
      navigate('/home', { replace: true });
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (credentials.password !== credentials.verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const response = await registerUser({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password
      });
      
      login(response.user);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Registration failed. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-card__subtitle">
          Fill in your details to get started.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              className="auth-form__input"
              type="text"
              value={credentials.name}
              onChange={(e) =>
                setCredentials({ ...credentials, name: e.target.value })
              }
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </div>
          <div className="auth-form__field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className="auth-form__input"
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="auth-form__field">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="auth-form__input"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Choose a password"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="auth-form__field">
            <label htmlFor="reg-verify">Verify Password</label>
            <input
              id="reg-verify"
              className="auth-form__input"
              type="password"
              value={credentials.verifyPassword}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  verifyPassword: e.target.value,
                })
              }
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}