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
import AdminLayout from "./pages/Admin/AdminLayout";
import AlumniDashboard from "./pages/Alumni/AlumniDashboard";
import AlumniEvents from "./pages/Alumni/AlumniEvents";
import AlumniLayout from "./pages/Alumni/AlumniLayout";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const role = getRole();
  const is_approved = isApproved();

  // No token = not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Invalid role
  if (allowedRoles && !allowedRoles.includes(role)) {
    clearAuthData(); // Clean up invalid auth
    return <Navigate to="/login" replace />;
  }

  // Alumni not approved
  if (role === "alumni" && !is_approved) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = getToken();
  const role = getRole();
  const is_approved = isApproved();

  // If authenticated with valid role, redirect to dashboard
  if (token && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (token && role === "alumni" && is_approved) {
    return <Navigate to="/alumni/dashboard" replace />;
  }

  // If token exists but role is invalid, clean up
  if (token && !["admin", "alumni"].includes(role)) {
    clearAuthData();
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
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />

        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout user={user} />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="events" element={<AdminEvents />} />
        </Route>

        {/* Alumni routes */}
        <Route 
          path="/alumni" 
          element={
            <ProtectedRoute allowedRoles={['alumni']}>
              <AlumniLayout user={user} />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="/alumni/dashboard" replace />} />
          <Route path="dashboard" element={<AlumniDashboard />} />
          <Route path="events" element={<AlumniEvents />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        pauseOnHover 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnFocusLoss
      />
    </Router>
  );
}

export default App;