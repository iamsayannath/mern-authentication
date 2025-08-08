import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SingupPage.jsx';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ new

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      api.get("/auth/getUser", { withCredentials: true })
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await api.get('/auth/logout');
    setUser(null);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>; // ✅ prevent flash

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} /> {/* ✅ pass setUser */}
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route
          path="/"
          element={user ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
