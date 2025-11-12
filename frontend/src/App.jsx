/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  getToken,
  getRole,
  isApproved,
  clearAuthData,
  getUser,
  setUser,
} from "./utils/storage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useTheme } from "./hooks/useTheme";
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
import AdminQRScanner from "./pages/Admin/AdminQRScanner";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminReports from "./pages/Admin/AdminReports";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminChangePassword from "./pages/Admin/settings/ChangePassword";
import AdminSystemPreference from "./pages/Admin/settings/SystemPreference";
import AdminLayout from "./pages/Admin/AdminLayout";
// Alumni imports
import AlumniDashboard from "./pages/Alumni/AlumniDashboard";
import AlumniEvents from "./pages/Alumni/AlumniEvents";
import AlumniNotifications from "./pages/Alumni/AlumniNotifications";
import AlumniEventUpdates from "./pages/Alumni/notifications/EventUpdates";
import AlumniSettings from "./pages/Alumni/AlumniSettings";
import AlumniChangePassword from "./pages/Alumni/settings/ChangePassword";
import AlumniSystemPreference from "./pages/Alumni/settings/SystemPreference";
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

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }, 
  };

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen transition-colors bg-background text-foreground"
      >
        <Router>
          <Routes>
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
              <Route
                path="dashboard"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminDashboard />
                  </motion.div>
                }
              />
              <Route
                path="users"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminUsers />
                  </motion.div>
                }
              />
              <Route
                path="create-user"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminCreateUser />
                  </motion.div>
                }
              />
              <Route
                path="create-event"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminCreateEvent />
                  </motion.div>
                }
              />
              <Route
                path="events"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminEvents />
                  </motion.div>
                }
              />
              <Route
                path="qr-scanner"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminQRScanner />
                  </motion.div>
                }
              />
              <Route
                path="analytics"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminAnalytics />
                  </motion.div>
                }
              />
              <Route
                path="reports"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminReports />
                  </motion.div>
                }
              />
              <Route
                path="notifications"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminNotifications />
                  </motion.div>
                }
              />
              <Route
                path="settings"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AdminSettings />
                  </motion.div>
                }
              >
                <Route
                  path="change-password"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                    >
                      <AdminChangePassword />
                    </motion.div>
                  }
                />
                <Route
                  path="system-preference"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                    >
                      <AdminSystemPreference />
                    </motion.div>
                  }
                />
              </Route>
            </Route>

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
              <Route
                path="dashboard"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AlumniDashboard />
                  </motion.div>
                }
              />
              <Route
                path="events"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AlumniEvents />
                  </motion.div>
                }
              />
              <Route
                path="notifications"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AlumniNotifications />
                  </motion.div>
                }
              >
                <Route
                  path="event-updates"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                    >
                      <AlumniEventUpdates />
                    </motion.div>
                  }
                />
              </Route>
              <Route
                path="settings"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                  >
                    <AlumniSettings />
                  </motion.div>
                }
              >
                <Route
                  path="change-password"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                    >
                      <AlumniChangePassword />
                    </motion.div>
                  }
                />
                <Route
                  path="system-preference"
                  element={
                    <motion.div
                      variants={pageVariants}
                      initial="initial"
                      animate="in"
                      exit="out"
                    >
                      <AlumniSystemPreference />
                    </motion.div>
                  }
                />
              </Route>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster position="top-right" reverseOrder={false} />
        </Router>
      </motion.div>
  );
}

export default App;
