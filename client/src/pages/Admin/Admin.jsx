import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";
import { getAllUsers, toggleBlockUser, updateUser } from "../../api.js";
import '../Albums/albums.css'; // מייבאים את העיצוב הקיים של העמודים כדי שייראה אחיד

export default function Admin() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // מצבי עריכה
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    // הגנה משולשת
    if (!currentUser || currentUser.is_admin !== 1) {
      navigate("/home", { replace: true });
      return;
    }

    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [currentUser, navigate]);

  async function handleToggleBlock(userId, currentStatus) {
    const newStatus = currentStatus ? 0 : 1; 
    try {
      await toggleBlockUser(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_deleted: newStatus } : u))
      );
    } catch (err) {
      alert("Failed to block/unblock user.");
    }
  }

  function handleEditStart(user) {
    setEditingUserId(user.id);
    setEditData({ name: user.name, email: user.email, password: "" });
  }

  async function handleEditSave(userId) {
    try {
      const dataToSend = { name: editData.name, email: editData.email };
      // נשלח סיסמה חדשה רק אם המנהל הקליד משהו
      if (editData.password.trim() !== "") {
        dataToSend.password = editData.password;
      }

      await updateUser(userId, dataToSend); // משתמשים בפונקציה הקיימת ב-API שלנו!
      
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, name: editData.name, email: editData.email } : u))
      );
      setEditingUserId(null);
    } catch (err) {
      alert("Failed to update user details.");
    }
  }

  return (
    <div className="albums-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1>Admin Control Panel</h1>
        <Link to="/home" className="btn btn--ghost">← Back to Home</Link>
      </div>
      
      <p style={{ marginBottom: "2rem", color: "var(--text-color, #4b5563)" }}>
        Manage all users in the system. You can block users or override their details.
      </p>

      {loading && <p style={{ color: '#9ca3af' }}>Loading users...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
            <thead style={{ backgroundColor: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
              <tr>
                <th style={{ padding: "1rem" }}>ID</th>
                <th style={{ padding: "1rem" }}>Name</th>
                <th style={{ padding: "1rem" }}>Email</th>
                <th style={{ padding: "1rem" }}>Role</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "1rem" }}>{user.id}</td>
                  
                  {/* אם אנחנו במצב עריכה על המשתמש הזה - נציג אינפוטים */}
                  {editingUserId === user.id ? (
                    <>
                      <td style={{ padding: "1rem" }}>
                        <input 
                          type="text" 
                          value={editData.name} 
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          style={{ padding: "0.5rem", width: "100%", borderRadius: "4px", border: "1px solid #d1d5db" }}
                        />
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <input 
                          type="email" 
                          value={editData.email} 
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                          style={{ padding: "0.5rem", width: "100%", borderRadius: "4px", border: "1px solid #d1d5db" }}
                        />
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <input 
                          type="password" 
                          placeholder="New password..." 
                          value={editData.password} 
                          onChange={(e) => setEditData({...editData, password: e.target.value})}
                          style={{ padding: "0.5rem", width: "100%", borderRadius: "4px", border: "1px solid #d1d5db" }}
                        />
                      </td>
                      <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                        {/* תיקנתי את השם של הפונקציה כאן 👇 */}
                        <button className="btn btn--primary" style={{ padding: "0.5rem" }} onClick={() => handleEditSave(user.id)}>
                          Save
                        </button>
                        <button className="btn btn--ghost" style={{ padding: "0.5rem" }} onClick={() => setEditingUserId(null)}>
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    /* מצב תצוגה רגיל */
                    <>
                      <td style={{ padding: "1rem" }}>{user.name}</td>
                      <td style={{ padding: "1rem" }}>{user.email}</td>
                      <td style={{ padding: "1rem", fontWeight: user.is_admin ? "bold" : "normal" }}>
                        {user.is_admin ? "Admin 👑" : "User"}
                      </td>
                      <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                        {/* לא ניתן למנהל לחסום או לערוך את עצמו דרך הטבלה הזו */}
                        {user.id !== currentUser.id && (
                          <>
                            <button 
                              className="btn btn--ghost" 
                              style={{ padding: "0.5rem 1rem" }}
                              onClick={() => handleEditStart(user)}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleBlock(user.id, user.is_deleted)}
                              style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: user.is_deleted ? "#10b981" : "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold"
                              }}
                            >
                              {user.is_deleted ? "Unblock" : "Block"}
                            </button>
                          </>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}