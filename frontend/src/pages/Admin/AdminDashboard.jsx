import { toast } from "react-toastify";
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
} from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [archivedUsers, setArchivedUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

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
        console.log("Recent activity raw:", res.data);
        setRecentActivity(res.data);
      } catch (err) {
        console.error("Error fetching recent activity:", err);
      }
    };

    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const approveUser = async (userId) => {
    try {
      await api.post(`/users/${userId}/approve`);
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error approving user:", error);
      // Optionally, show a toast/error message to the user
    }
  };
  const declineUser = async (userId) => {
    try {
      await api.post(`/users/${userId}/decline`); // Assuming /decline endpoint; adjust if it's /reject or similar
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error declining user:", error);
      // Optionally, show a toast/error message to the user
    }
  };

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

  const getActivityIcon = (actionType, description) => {
    if (actionType === "register")
      return { icon: faUserPlus, color: "text-blue-600 bg-blue-100" };
    if (actionType === "approve")
      return { icon: faUserCheck, color: "text-green-600 bg-green-100" };
    if (actionType === "decline")
      return { icon: faUserTimes, color: "text-red-600 bg-red-100" };
    if (actionType === "create_event" || description.includes("Event"))
      return { icon: faCalendarPlus, color: "text-indigo-600 bg-indigo-100" };
    if (actionType === "update")
      return { icon: faPen, color: "text-yellow-600 bg-yellow-100" };
    if (actionType === "delete")
      return { icon: faTrash, color: "text-gray-600 bg-gray-100" };
    return { icon: faUserPlus, color: "text-blue-600 bg-blue-100" };
  };

  const topPendingUsers = pendingUsers.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <h2 className="text-xl text-gray-700 mb-8">
            Welcome, {currentUser?.firstname}!
          </h2>

          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Users",
                value: userStats?.total_users,
              },
              {
                title: "Active Users",
                value: activeUsers,
              },
              {
                title: "Blocked Users",
                value: blockedUsers,
              },
              {
                title: "Archived Users",
                value: archivedUsers,
              },
            ].map((card, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {card.value ?? "Loading..."}
                </p>
                <p className="text-xs text-green-600 mt-1">Live Data</p>
              </div>
            ))}
          </div>

           {/* Pending Approvals Widget */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold ">
                Pending Alumni Approvals
              </h3>
              <span className="text-2xl font-bold text-orange-600">
                {pendingUsers.length}
              </span>
            </div>
            {pendingUsers.length === 0 ? (
              <p className="text-sm text-gray-500">No pending approvals.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {topPendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-xs text-gray-500">
                          Registered{" "}
                          {formatDistanceToNow(parseISO(user.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => approveUser(user.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineUser(user.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="mt-4 w-full text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                >
                  View All ({pendingUsers.length})
                </button>
              </>
            )}
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

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
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
                        className="flex items-start justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${color}`}
                          >
                            <FontAwesomeIcon icon={icon} />
                          </div>
                          <span className="text-sm text-gray-800">
                            {log.description}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatDistanceToNow(parseISO(log.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No recent activities.</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
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
