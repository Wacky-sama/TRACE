import { getToken, getRole, isApproved, clearAuthData } from './utils/storage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from "./pages/AuthPage"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import AlumniDashboard from "./pages/Alumni/AlumniDashboard";
import AdminUsers from './pages/Admin/AdminUsers';

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
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alumni/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['alumni']}>
              <AlumniDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </Router>
  )
}

export default App;
