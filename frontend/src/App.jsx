import { useState, useEffect } from 'react';
import { getToken, getRole, isApproved, clearAuthData } from './utils/storage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from "./utils/storage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from './components/auth/AuthPage';
import AdminDashboard from "./pages/Admin/AdminDashboard"
import AdminUsers from './pages/Admin/AdminUsers';
import AdminEvents from './pages/Admin/AdminEvents';
import AlumniDashboard from "./pages/Alumni/AlumniDashboard";
import AlumniEvents from "./pages/Alumni/AlumniEvents";
import AdminLayout from "./pages/Admin/AdminLayout";
import AlumniLayout from "./pages/Alumni/AlumniLayout";
import React from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const role = getRole();
  const is_approved = isApproved();

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />
  }
  if (role === 'alumni' && !is_approved) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = getToken();
  const role = getRole();

  const validRoles = ['admin', 'alumni'];

  if (token && validRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  if (token && !validRoles.includes(role)) {
    clearAuthData();
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const onStorage = () => setUser(getUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout user={user} />
            </ProtectedRoute>
          } 
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="events" element={AdminEvents} />
        </Route>

        <Route 
          path="/alumni" 
          element={
            <ProtectedRoute allowedRoles={['alumni']}>
              <AlumniLayout user={user} />
            </ProtectedRoute>
          } 
        >
          <Route path="dashboard" element={<AlumniDashboard />} />
          <Route path="events" element={<AlumniEvents />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </Router>
  )
}

export default App;
