import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from "./pages/AuthPage"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import EventOrganizerDashboard from "./pages/Event Organizer/EventOrganizerDashboard";
import AlumniDashboard from "./pages/Alumni/AlumniDashboard";
import AdminUsers from './pages/Admin/AdminUsers';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const validRoles = ['admin', 'organizer', 'alumni'];

  if (token && validRoles.includes(role)) {
  return <Navigate to={`/${role}/dashboard`} replace />;
}

if (token && !validRoles.includes(role)) {
  localStorage.clear();
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
          path="/organizer/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <EventOrganizerDashboard />
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
    </Router>
  )
}

export default App;
