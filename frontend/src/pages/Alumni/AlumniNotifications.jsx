/* eslint-disable no-unused-vars */
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import AlumniSystemAlerts from "./notifications/SystemAlerts";  // Assuming this is your SystemAlerts component
import AlumniEventUpdates from "./notifications/EventUpdates";  // Assuming this is your EventUpdates component

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const AlumniNotifications = () => {
  const isDark = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const activeTab = location.pathname.includes("event-updates") ? "events" : "system";

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const tabs = [
    { key: "system", label: "System Alerts" },
    { key: "events", label: "Event Updates" },
  ];

  const systemNotifications = notifications.filter((n) => n.type === "system");
  const eventNotifications = notifications.filter((n) => n.type === "event");

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <main className="flex-1 p-4 sm:p-6">
        <div className="w-full max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-6 text-center sm:text-left">
            <h1
              className={`text-2xl sm:text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Notifications
            </h1>
            <p
              className={`text-base sm:text-lg ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Stay up to date with system alerts and event updates.
            </p>
          </header>

          {/* Responsive Dropdown for Mobile */}
          <div className="mb-6 sm:hidden">
            <select
              value={activeTab}
              onChange={(e) =>
                navigate(
                  e.target.value === "events"
                    ? "/alumni/notifications/event-updates"
                    : "/alumni/notifications"
                )
              }
              className={`w-full p-2 rounded-md border text-sm font-medium ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              {tabs.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs Navigation for Desktop */}
          <div className="hidden mb-8 border-b border-gray-300 sm:block dark:border-gray-700">
            <nav className="flex flex-wrap gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    navigate(
                      tab.key === "events"
                        ? "/alumni/notifications/event-updates"  // Fix: Correct path for events
                        : "/alumni/notifications"  // For system (default)
                    )
                  }
                  className={`flex items-center gap-2 pb-2 text-sm sm:text-lg font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? isDark
                        ? "border-blue-400 text-blue-400"
                        : "border-blue-600 text-blue-600"
                      : isDark
                      ? "border-transparent text-gray-400 hover:text-gray-200"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content (Conditional Rendering, like AlumniSettings) */}
          <AnimatePresence mode="wait">
            {activeTab === "system" && (
              <motion.div
                key="system"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-xl shadow-md p-4 sm:p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <AlumniSystemAlerts
                  notifications={systemNotifications}
                  loading={loading}
                  markAsRead={markAsRead}
                  isDark={isDark}
                />
              </motion.div>
            )}
            {activeTab === "events" && (
              <motion.div
                key="events"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-xl shadow-md p-4 sm:p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <AlumniEventUpdates
                  notifications={eventNotifications}
                  loading={loading}
                  markAsRead={markAsRead}
                  isDark={isDark}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AlumniNotifications;