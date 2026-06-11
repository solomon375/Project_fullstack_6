import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import Todos from './pages/Todos/Todos';
import Posts from './pages/Posts/Posts';
import Albums from "./pages/Albums/Albums.jsx";
import Settings from "./pages/Settings/Settings.jsx"; // הייבוא החדש להגדרות
import Admin from "./pages/Admin/Admin.jsx";         // הייבוא החדש למנהל
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* 👇 הראוטים החדשים שהוספנו לבונוס 👇 */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      {/* 👆 עד כאן הראוטים החדשים 👆 */}

      <Route
        path="/users/:username/todos"
        element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:username/posts"
        element={
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:username/albums"
        element={
          <ProtectedRoute>
            <Albums />
          </ProtectedRoute>
        }
      />
      
      {/* אם מישהו מקליד כתובת לא קיימת, זרוק אותו ללוגין */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}