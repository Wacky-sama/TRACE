import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

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
  const [activeTab, setActiveTab] = useState("system");
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

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const filteredNotifications = notifications.filter((n) =>
    activeTab === "system" ? n.type === "system" : n.type === "event"
  );

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
              Notifications
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Stay up to date with system alerts and event updates.
            </p>
          </header>

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-300 dark:border-gray-700">
            <nav className="flex space-x-6">
              {[
                { key: "system", label: "System Alerts" },
                { key: "event", label: "Event Updates" },
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

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.section
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {loading ? (
                <div
                  className={`p-6 rounded-lg shadow ${
                    isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
                  }`}
                >
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div
                  className={`p-6 rounded-lg shadow ${
                    isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
                  }`}
                >
                  No {activeTab === "system" ? "system alerts" : "event updates"}.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-5 rounded-lg shadow cursor-pointer transition-colors ${
                        notif.read
                          ? isDark
                            ? "bg-gray-800 text-gray-300"
                            : "bg-white text-gray-700"
                          : isDark
                          ? "bg-blue-900/40 text-white border border-blue-500"
                          : "bg-blue-50 border border-blue-300"
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <h3
                        className={`text-lg font-semibold mb-1 ${
                          isDark ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <p
                        className={`text-sm mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {notif.message}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                      {!notif.read && (
                        <span className="inline-block mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AlumniNotifications;
