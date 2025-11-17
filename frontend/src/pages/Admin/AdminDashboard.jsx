import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseISO, formatDistanceToNow } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUserCheck,
  faUserTimes,
  faCalendarPlus,
  faPen,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../hooks/useTheme";
import api from "../../services/api";

const AdminDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [userStats, setUserStats] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [archivedUsers, setArchivedUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [approvingUsers, setApprovingUsers] = useState(new Set());
  const [decliningUsers, setDecliningUsers] = useState(new Set());
  const navigate = useNavigate();

  const safeFormatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "Recently";
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [
          statsRes,
          activeRes,
          blockedRes,
          archivedRes,
          onlineRes,
          pendingRes,
          meRes,
        ] = await Promise.all([
          api.get("/users/stats"),
          api.get("/users/active"),
          api.get("/users/blocked"),
          api.get("/users/archived"),
          api.get("/users/online"),
          api.get("/users/pending-alumni"),
          api.get("/users/me"),
        ]);

        setUserStats(statsRes.data);
        setActiveUsers(activeRes.data.active_users);
        setBlockedUsers(blockedRes.data.blocked_users);
        setArchivedUsers(archivedRes.data.archived_users);
        setOnlineUsers(onlineRes.data);
        setPendingUsers(pendingRes.data || []);
        setCurrentUser(meRes.data);
      } catch (error) {
        console.error("Error fetching user stats: ", error);
        toast.error("Failed to load dashboard data. Please refresh.");
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
        setRecentActivity(res.data || []);
      } catch (err) {
        console.error("Error fetching recent activity:", err);
      }
    };

    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const approveUser = async (userId) => {
    setApprovingUsers((prev) => new Set([...prev, userId]));
    try {
      await api.patch(`/users/${userId}/approve`);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User approved successfully!");
    } catch {
      toast.error("Failed to approve user. Please try again.");
    } finally {
      setApprovingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const declineUser = async (userId) => {
    setDecliningUsers((prev) => new Set([...prev, userId]));
    try {
      await api.patch(`/users/${userId}/decline`);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User declined successfully!");
    } catch {
      toast.error("Failed to decline user. Please try again.");
    } finally {
      setDecliningUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const chartData = userStats
    ? [
        { role: "Admins", count: userStats.admins || 0 },
        { role: "Alumni", count: userStats.alumni || 0 },
      ]
    : [];

  const getActivityIcon = (actionType, description) => {
    if (actionType === "register")
      return {
        icon: faUserPlus,
        color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-800",
      };
    if (actionType === "approve")
      return {
        icon: faUserCheck,
        color:
          "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-800",
      };
    if (actionType === "decline")
      return {
        icon: faUserTimes,
        color: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-800",
      };
    if (actionType === "create_event" || description.includes("Event"))
      return {
        icon: faCalendarPlus,
        color:
          "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-800",
      };
    if (actionType === "update")
      return {
        icon: faPen,
        color:
          "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-800",
      };
    if (actionType === "delete")
      return {
        icon: faTrash,
        color: "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700",
      };
    return {
      icon: faUserPlus,
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-800",
    };
  };

  const topPendingUsers = pendingUsers.slice(0, 5);
  const isApproving = (userId) => approvingUsers.has(userId);
  const isDeclining = (userId) => decliningUsers.has(userId);

  return (
    <div
      className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
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
              Welcome, {currentUser?.firstname}!
            </p>
          </header>
          
          {/* User Statistics */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Users", value: userStats?.total_users },
              { title: "Active Users", value: activeUsers },
              { title: "Blocked Users", value: blockedUsers },
              { title: "Archived Users", value: archivedUsers },
            ].map((card, i) => (
              <div
                key={i}
                className={`p-6 rounded-lg shadow transition-colors ${
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
                  Live Data
                </p>
              </div>
            ))}
          </div>

          {/* Pending Approvals Widget */}
          <div
            className={`p-6 rounded-lg shadow mb-8 transition-colors ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Pending Alumni Approvals
              </h3>
              <span className="text-2xl font-bold text-green-600">
                {pendingUsers.length}
              </span>
            </div>
            {pendingUsers.length === 0 ? (
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No pending approvals.
              </p>
            ) : (
              <>
                <div className="space-y-3 overflow-y-auto max-h-64">
                  {topPendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {user.firstname} {user.middle_initial || "-"}.{" "}
                          {user.lastname}
                        </p>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Registered {safeFormatDate(user.created_at)}
                        </p>
                      </div>
                      <div className="flex ml-4 space-x-2">
                        <button
                          onClick={() => approveUser(user.id)}
                          disabled={
                            isApproving(user.id) || isDeclining(user.id)
                          }
                          className="flex items-center px-3 py-1 space-x-1 text-xs font-medium text-white transition-colors bg-green-600 rounded hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                        >
                          {isApproving(user.id) ? (
                            <>
                              <FontAwesomeIcon
                                icon={faSpinner}
                                spin
                                size="xs"
                              />
                              <span>Approving...</span>
                            </>
                          ) : (
                            <span>Approve</span>
                          )}
                        </button>
                        <button
                          onClick={() => declineUser(user.id)}
                          disabled={
                            isApproving(user.id) || isDeclining(user.id)
                          }
                          className="flex items-center px-3 py-1 space-x-1 text-xs font-medium text-white transition-colors bg-red-600 rounded hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                          {isDeclining(user.id) ? (
                            <>
                              <FontAwesomeIcon
                                icon={faSpinner}
                                spin
                                size="xs"
                              />
                              <span>Declining...</span>
                            </>
                          ) : (
                            <span>Decline</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/admin/users")}
                  className={`mt-4 w-full text-sm font-medium transition-colors hover:underline ${
                    isDark
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  View All ({pendingUsers.length})
                </button>
              </>
            )}
          </div>

          {/* Chart Section */}
          <div
            className={`p-6 rounded-lg shadow mb-8 transition-colors ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h3 className="mb-4 text-lg font-semibold">Users by Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#4B5563" : "#E5E7EB"}
                />
                <XAxis dataKey="role" stroke={isDark ? "#D1D5DB" : "#374151"} />
                <YAxis
                  stroke={isDark ? "#D1D5DB" : "#374151"}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                    color: isDark ? "#F9FAFB" : "#111827",
                    border: "none",
                  }}
                  formatter={(value) => [value, "Count"]}
                />
                <Bar dataKey="count" fill={isDark ? "#60A5FA" : "#2563EB"} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <div
              className={`p-6 rounded-lg shadow max-h-96 overflow-y-auto transition-colors ${
                isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((log) => {
                    const { icon, color } = getActivityIcon(
                      log.action_type,
                      log.description
                    );
                    return (
                      <div
                        key={log.id}
                        className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 rounded-lg transition-colors ${
                          isDark
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start flex-1 min-w-0 gap-3">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${color}`}
                          >
                            <FontAwesomeIcon icon={icon} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-sm break-words ${
                                isDark ? "text-gray-200" : "text-gray-800"
                              }`}
                            >
                              {log.description || "No description"}
                            </span>
                            <span
                              className={`block sm:hidden text-xs mt-1 ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {safeFormatDate(log.created_at)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`hidden sm:block text-xs flex-shrink-0 whitespace-nowrap ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {safeFormatDate(log.created_at)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No recent activities.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className={`p-6 rounded-lg shadow transition-colors ${
                isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  "/admin/create-user",
                  "/admin/create-event",
                  "/admin/reports",
                ].map((path, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(path)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      isDark
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {path.includes("user")
                      ? "Create User"
                      : path.includes("event")
                      ? "Create Event"
                      : "Generate Report"}
                  </button>
                ))}
              </div>
            </div>

            {/* Online Users */}
            <div className="flex justify-center lg:col-span-2">
              <div
                className={`p-6 rounded-lg shadow flex flex-col items-center w-full max-w-sm transition-colors ${
                  isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <h3
                  className={`text-sm font-medium ${
                    isDark ? "text-green-400" : "text-green-500"
                  }`}
                >
                  Online Users
                </h3>
                {onlineUsers ? (
                  <ul className="mt-2">
                    {onlineUsers.map((user) => (
                      <li
                        key={user.id}
                        className={`text-sm ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {user.firstname}{" "}
                        {user.middle_initial ? `${user.middle_initial}. ` : ""}
                        {user.lastname || "User"} -{" "}
                        <span className="capitalize">{user.role}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className={`text-sm mt-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Loading...
                  </p>
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
