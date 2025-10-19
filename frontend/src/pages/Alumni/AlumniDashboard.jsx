import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import AlumniGTSForm from "./AlumniGTSForm";

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
    const fetchApprovedEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch approved events:", error);
      }
    };
    fetchApprovedEvents();

    const interval = setInterval(fetchApprovedEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  // Framer Motion variants for fade/slide
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
  };

  return (
    <div
      className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-6">
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Dashboard
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Welcome, {currentUser?.firstname}!
            </p>
          </header>

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-300 dark:border-gray-700">
            <nav className="flex space-x-6">
              {[
                { key: "overview", label: "Overview" },
                { key: "gts", label: "Graduate Tracer Study" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
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

          {/* Tab Content with animation */}
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
                    className={`text-2xl font-semibold mb-4 ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Upcoming Events
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.length === 0 ? (
                      <div
                        className={`p-6 rounded-lg shadow transition-colors ${
                          isDark
                            ? "bg-gray-800 text-white"
                            : "bg-white text-gray-900"
                        }`}
                      >
                        <p
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          No upcoming events.
                        </p>
                      </div>
                    ) : (
                      events.map((event) => (
                        <div
                          key={event.id}
                          className={`p-6 rounded-lg shadow transition-colors ${
                            isDark
                              ? "bg-gray-800 text-white"
                              : "bg-white text-gray-900"
                          }`}
                        >
                          <h3
                            className={`text-lg font-semibold mb-2 ${
                              isDark ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {event.title}
                          </h3>
                          <p
                            className={`text-sm mb-1 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {event.description || "No description"}
                          </p>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Date: {event.event_date || "To Be Announced"}
                          </p>
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
                  className={`rounded-xl shadow-md p-6 transition-colors ${
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
