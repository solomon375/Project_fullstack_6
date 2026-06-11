import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api.js';
import { UserContext } from '../../contexts/UserContext.jsx';
import '../auth.css';

export default function Login() {
  const navigate = useNavigate();
  // חילצנו גם את currentUser כדי לדעת אם מישהו כבר מחובר
  const { login, currentUser } = useContext(UserContext); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // הוספנו את ההגנה כאן: אם המשתמש כבר קיים בזיכרון, תעיף אותו למסך הבית
  useEffect(() => {
    if (currentUser) {
      navigate('/home', { replace: true });
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await loginUser(email, password);
      login(response.user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Login failed. Is the server running?');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to continue to your account.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-form__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
          <div className="auth-form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-form__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="auth-card__footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}