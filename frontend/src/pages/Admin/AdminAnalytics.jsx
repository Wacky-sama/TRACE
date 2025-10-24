import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
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
  const [loading, setLoading] = useState(true);
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [users, events, gts, logs] = await Promise.all([
          api.get("/admin/analytics/users"),
          api.get("/admin/analytics/events"),
          api.get("/admin/analytics/gts"),
          api.get("/admin/analytics/logs"),
        ]);

        setStats({
          ...users.data,
          ...events.data,
          ...gts.data,
          ...logs.data,
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  const summaryCards = [
    { label: "Total Alumni", value: stats.totalAlumni },
    { label: "Active Alumni", value: stats.activeAlumni },
    { label: "Pending Approvals", value: stats.pendingApprovals },
    { label: "Employment Rate", value: `${stats.employmentRate || 0}%` },
    { label: "GTS Completed", value: stats.gtsCompleted },
    { label: "Active Events", value: stats.activeEvents },
    { label: "Departments", value: stats.departments },
    { label: "Recent Logins", value: stats.recentLogins },
  ];

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-6">
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Analytics
            </h1>
            <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Real-time insights from alumni, GTS, and event activity.
            </p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((item, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-xl shadow text-center transition-colors ${
                    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <h3 className="text-2xl font-bold">{item.value ?? 0}</h3>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Event Participation Trend */}
              <div className={`p-6 rounded-xl shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  Event Participation Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.chartData || []}>
                    <XAxis dataKey="month" stroke={isDark ? "#d1d5db" : "#374151"} />
                    <YAxis stroke={isDark ? "#d1d5db" : "#374151"} />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Employment Trend */}
              <div className={`p-6 rounded-xl shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  Employment Trend Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.employmentTrend || []}>
                    <XAxis dataKey="year" stroke={isDark ? "#d1d5db" : "#374151"} />
                    <YAxis stroke={isDark ? "#d1d5db" : "#374151"} />
                    <Tooltip />
                    <Bar dataKey="employed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* GTS Completion Donut */}
              <div className={`p-6 rounded-xl shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  GTS Completion Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed", value: stats.gtsCompleted || 0 },
                        { name: "Incomplete", value: (stats.totalAlumni || 0) - (stats.gtsCompleted || 0) },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      paddingAngle={5}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* GTS Completion by Department */}
              <div className={`p-6 rounded-xl shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  GTS Completion by Department
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.gtsByDept || []}
                      dataKey="value"
                      nameKey="dept"
                      outerRadius={100}
                    >
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

            {/* Recent Activities */}
            <div className={`p-6 rounded-xl shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                Recent Activities
              </h3>
              <ul className="space-y-2 text-sm">
                {stats.recentActivities?.length ? (
                  stats.recentActivities.map((a, i) => (
                    <li key={i} className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {a.description} — <span className="italic">{a.timestamp}</span>
                    </li>
                  ))
                ) : (
                  <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>No recent activities.</p>
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
