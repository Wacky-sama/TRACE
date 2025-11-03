/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import AlumniGTSForm from "./AlumniGTSForm";

// ✅ Custom Hook for Dark Mode Detection
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

// ✅ Helper functions for date/time formatting
const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

const formatTime = (timeStr) => {
  if (!timeStr) return "TBA";
  try {
    const [h, m, s] = timeStr.split(":");
    const d = new Date();
    d.setHours(h, m, s || 0);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeStr;
  }
};

const AlumniDashboard = () => {
  const isDark = useDarkMode();
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/users/me");
        setCurrentUser(res.data);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch approved events:", error);
      }
    };
    fetchEvents();

    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
  };

  return (
    <div
      className={`flex min-h-screen flex-col ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <header className="mb-6 text-center sm:text-left">
            <h1
              className={`text-2xl sm:text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Dashboard
            </h1>
            <p
              className={`text-base sm:text-lg ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Welcome, {currentUser?.firstname || "User"}!
            </p>
          </header>

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-300 dark:border-gray-700">
            <nav className="flex flex-wrap justify-center sm:justify-start gap-4 sm:space-x-6">
              {[
                { key: "overview", label: "Overview" },
                { key: "gts", label: "Graduate Tracer Study" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-2 text-base sm:text-lg font-medium transition-colors border-b-2 ${
                    activeTab === tab.key
                      ? isDark
                        ? "border-blue-400 text-blue-400"
                        : "border-blue-600 text-blue-600"
                      : isDark
                      ? "border-transparent text-gray-400 hover:text-gray-200"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.section
                key="overview"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div>
                  <h3
                    className={`text-xl sm:text-2xl font-semibold mb-4 ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Upcoming Events
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {events.length === 0 ? (
                      <div
                        className={`p-6 rounded-lg shadow ${
                          isDark
                            ? "bg-gray-800 text-gray-400"
                            : "bg-white text-gray-600"
                        }`}
                      >
                        <p>No upcoming events.</p>
                      </div>
                    ) : (
                      events.map((event) => (
                        <div
                          key={event.id}
                          className={`p-6 rounded-lg shadow transition-all ${
                            isDark
                              ? "bg-gray-800 hover:bg-gray-750 text-gray-200"
                              : "bg-white hover:bg-gray-50 text-gray-900"
                          }`}
                        >
                          <h3 className="mb-2 text-lg font-semibold">
                            {event.title}
                          </h3>
                          <p
                            className={`text-sm mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {event.description || "No description provided."}
                          </p>

                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>Start:</strong>{" "}
                              {formatDate(event.start_date)} —{" "}
                              {formatTime(event.start_time_startday)} —{" "}
                              {formatTime(event.start_time_endday)}
                            </p>
                            <p>
                              <strong>End:</strong> {formatDate(event.end_date)}{" "}
                              — {formatTime(event.end_time_endday)} —{" "}
                              {formatTime(event.end_time_startday)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === "gts" && (
              <motion.section
                key="gts"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div
                  className={`rounded-xl shadow-md p-4 sm:p-6 transition-colors ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <AlumniGTSForm />
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;
