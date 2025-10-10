import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../../services/api";

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [archivedUsers, setArchivedUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [statsRes, activeRes, blockedRes, archivedRes, onlineRes, meRes] =
          await Promise.all([
            api.get("/users/stats"),
            api.get("/users/active"),
            api.get("/users/blocked"),
            api.get("/users/archived"),
            api.get("/users/online"),
            api.get("/users/me"),
          ]);

        setUserStats(statsRes.data);
        setActiveUsers(activeRes.data.active_users);
        setBlockedUsers(blockedRes.data.blocked_users);
        setArchivedUsers(archivedRes.data.archived_users);
        setOnlineUsers(onlineRes.data);
        setCurrentUser(meRes.data);

        console.log("Online users:", onlineRes.data);
      } catch (error) {
        console.error("Error fetching user stats: ", error);
      }
    };

    fetchUserStats();
    const interval = setInterval(fetchUserStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const res = await api.get("/activity/recent");
        setRecentActivity(res.data);
      } catch (err) {
        console.error("Error fetching recent activity:", err);
      }
    };

    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = userStats
    ? [{ role: "Alumni", count: userStats.alumni }]
    : [];

  const formatRole = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "alumni":
        return "Alumni";
      default:
        return role;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome, {currentUser?.firstname}!
          </h1>

          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {userStats ? userStats.total_users : "Loading..."}
              </p>
              <p className="text-xs text-green-600 mt-1">Live Data</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Active Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {activeUsers ?? "Loading..."}
              </p>
              <p className="text-xs text-green-600 mt-1">Live Data</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Blocked Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {blockedUsers ?? "Loading..."}
              </p>
              <p className="text-xs text-green-600 mt-1">Live Data</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Archived Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {archivedUsers ?? "Loading..."}
              </p>
              <p className="text-xs text-green-600 mt-1">Live Data</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [value, "Count"]} />
                <Bar dataKey="count" name="Count" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions and Online Users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{log.description}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent activities.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/admin/create-user")}
                  className="w-full text-left text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Create User
                </button>
                <button
                  onClick={() => navigate("/admin/create-event")}
                  className="w-full text-left text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Create Event
                </button>
                <button className="w-full text-left text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Online Users */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center w-full max-w-sm">
                <h3 className="text-sm font-medium text-green-500">
                  Online Users
                </h3>
                {onlineUsers ? (
                  <ul className="mt-2">
                    {onlineUsers.map((user) => (
                      <li key={user.id} className="text-gray-800 text-sm">
                        {user.firstname}{" "}
                        {user.middle_initial ? `${user.middle_initial}. ` : ""}
                        {user.lastname} - {formatRole(user.role)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
