import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
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
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setStats(res.data);
        setChartData(res.data.chartData || []);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6">
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Admin Analytics
            </h1>
            <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Overview of alumni engagement and system performance.
            </p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Alumni", value: stats.totalAlumni },
                { label: "GTS Completed", value: stats.gtsCompleted },
                { label: "Active Events", value: stats.activeEvents },
                { label: "Departments", value: stats.departments },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-xl shadow text-center transition-colors ${
                    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <h3 className="text-2xl font-bold">{item.value || 0}</h3>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  Event Participation Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" stroke={isDark ? "#d1d5db" : "#374151"} />
                    <YAxis stroke={isDark ? "#d1d5db" : "#374151"} />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={`p-6 rounded-xl shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  GTS Completion by Department
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={stats.gtsByDept || []} dataKey="value" nameKey="dept" outerRadius={100}>
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
