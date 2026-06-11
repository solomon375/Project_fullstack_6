import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";
import { updateUser } from "../../api.js";
import "../auth.css"; // נשתמש בעיצוב הקיים של הטפסים שלך

export default function Settings() {
  const { currentUser, login } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    name: currentUser.name || currentUser.username || "",
    email: currentUser.email || "",
    password: "", // נשאיר ריק. אם המשתמש לא יקליד כלום, הסיסמה לא תשתנה
  });
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      // אם שדה הסיסמה ריק, לא נשלח אותו לשרת כדי לא לדרוס את הסיסמה הקיימת עם מחרוזת ריקה
      const dataToSend = { name: formData.name, email: formData.email };
      if (formData.password.trim() !== "") {
        dataToSend.password = formData.password;
      }

      await updateUser(currentUser.id, dataToSend);
      
      // מעדכנים את המשתמש הנוכחי ב-Context כדי שהשינוי ישתקף מיד למעלה בברכה
      login({ ...currentUser, name: formData.name, email: formData.email });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Account Settings</h1>
        <p className="auth-card__subtitle">Update your personal details below.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label>Name</label>
            <input
              type="text"
              className="auth-form__input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="auth-form__field">
            <label>Email</label>
            <input
              type="email"
              className="auth-form__input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="auth-form__field">
            <label>New Password (leave blank to keep current)</label>
            <input
              type="password"
              className="auth-form__input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter new password"
            />
          </div>

          {error && <p className="error">{error}</p>}
          {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

          <button type="submit" className="auth-form__submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
        
        <p className="auth-card__footer">
          <Link to="/home">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}