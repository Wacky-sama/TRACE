import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
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

const AdminAnalytics = () => {
  const isDark = useDarkMode();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to load analytics data. Please refresh.");
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

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
              Admin Analytics
            </h1>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-700"
              } mt-1 text-sm`}
            >
              Overview of alumni engagement and system activity.
            </p>
          </header>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: "Total Alumni", value: stats?.totalAlumni },
              { title: "GTS Completed", value: stats?.gtsCompleted },
              { title: "Active Events", value: stats?.activeEvents },
              { title: "Departments", value: stats?.departments },
            ].map((card, i) => (
              <div
                key={i}
                className={`p-6 rounded-lg shadow transition-colors text-center ${
                  isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <h3
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {card.title}
                </h3>
                <p className="mt-2 text-3xl font-bold">
                  {card.value ?? "Loading..."}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                >
                  Updated in real-time
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
