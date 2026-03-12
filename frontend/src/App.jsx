import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getCurrentUser, logout } from "./api";
import LoginPage from "./pages/Login";
import PatientsPage from "./pages/Patients";
import RecordsPage from "./pages/Records";
import UploadPage from "./pages/Upload";
import AdminDashboard from "./pages/AdminDashboard";

function PrivateRoute({ children }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => getCurrentUser());

  const onLogout = () => {
    logout();
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <BrowserRouter>
      <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Medical Data Platform</h1>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <nav>
                <Link to="/patients" style={{ marginRight: 12 }}>
                  Patients
                </Link>
                <Link to="/upload" style={{ marginRight: 12 }}>
                  Upload
                </Link>
                {isAdmin ? (
                  <Link to="/admin" style={{ marginRight: 12 }}>
                    Admin
                  </Link>
                ) : null}
                <a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer">
                  API docs
                </a>
              </nav>
              <span style={{ marginRight: 12 }}>Signed in as {user.name}</span>
              <button onClick={onLogout}>Logout</button>
            </div>
          ) : null}
        </header>

        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/patients" element={<PrivateRoute><PatientsPage /></PrivateRoute>} />
          <Route path="/patients/:id" element={<PrivateRoute><RecordsPage /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
          {isAdmin ? <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} /> : null}
          <Route path="/" element={<Navigate to="/patients" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
