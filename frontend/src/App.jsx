import { useState, useEffect } from "react";
import { getToken, getRole, isApproved, clearAuthData } from "./utils/storage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getUser, setUser } from "./utils/storage";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./context/ThemeProvider";
import api from "./services/api";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./components/auth/AuthPage";
// Admin imports
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminCreateUser from "./pages/Admin/AdminCreateUser";
import AdminCreateEvent from "./pages/Admin/AdminCreateEvent";
import AdminEvents from "./pages/Admin/AdminEvents";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminReports from "./pages/Admin/AdminReports";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminLayout from "./pages/Admin/AdminLayout";
// Alumni imports
import AlumniDashboard from "./pages/Alumni/AlumniDashboard";
import AlumniEvents from "./pages/Alumni/AlumniEvents";
import AlumniNotifications from "./pages/Alumni/AlumniNotifications";
import AlumniSettings from "./pages/Alumni/AlumniSettings";
import AlumniLayout from "./pages/Alumni/AlumniLayout";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const role = getRole();
  const is_approved = isApproved();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    clearAuthData();
    return <Navigate to="/login" replace />;
  }

  if (role === "alumni" && !is_approved) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = getToken();
  const role = getRole();
  const is_approved = isApproved();

  if (token && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (token && role === "alumni" && is_approved) {
    return <Navigate to="/alumni/dashboard" replace />;
  }

  if (token && !["admin", "alumni"].includes(role)) {
    clearAuthData();
  }

  return children;
};

function App() {
  const [user, setUserState] = useState(getUser());
  const { theme } = useTheme();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        setUserState(res.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        clearAuthData();
        setUserState(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const onStorage = () => setUserState(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen transition-colors bg-background text-foreground"
      >
        <Router>
          <Routes>
            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout user={user} />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="create-user" element={<AdminCreateUser />} />
              <Route path="create-event" element={<AdminCreateEvent />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Alumni routes */}
            <Route
              path="/alumni"
              element={
                <ProtectedRoute allowedRoles={["alumni"]}>
                  <AlumniLayout user={user} />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/alumni/dashboard" replace />}
              />
              <Route path="dashboard" element={<AlumniDashboard />} />
              <Route path="events" element={<AlumniEvents />} />
              <Route path="notifications" element={<AlumniNotifications />} />
              <Route path="settings" element={<AlumniSettings />} />
            </Route>

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
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
        </Router>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
