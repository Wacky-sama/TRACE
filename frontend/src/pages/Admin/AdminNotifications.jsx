import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelopeOpenText,
  faTrash,
  faCircleExclamation,
  faSort,
  faFilter,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { formatDistanceToNow, parseISO } from "date-fns";
import api from "../../services/api";
import { useTheme } from "../../hooks/useTheme";

const AdminNotifications = () => {
  const { theme } = useTheme();  
  const isDark = theme === "dark"; 

  const [notifications, setNotifications] = useState([]);
  const getNotifType = (actionType) => {
    if (["decline", "delete"].includes(actionType)) return "alert";
    if (["approve", "register"].includes(actionType)) return "message";
    return "info";
  };
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const safeFormatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications. Please refresh.");
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
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter(n => !n.is_read);
    if (unreadNotifs.length === 0) {
      toast.error("No unread notifications");
      return;
    }

    try {
      await Promise.all(
        unreadNotifs.map(n => api.patch(`/notifications/${n.id}/read`))
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Permanently delete this notification? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const filteredNotifications = notifications
    .filter((n) => {
      if (filter === "unread") return !n.is_read;
      if (filter === "read") return n.is_read;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div
      className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-1 ml-3 text-sm font-medium text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className={`mt-1 text-sm sm:text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Manage system alerts, user updates, and platform events.
              </p>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FontAwesomeIcon icon={faCheckDouble} />
                <span className="hidden sm:inline">Mark All Read</span>
                <span className="sm:hidden">Mark All</span>
              </button>
            )}
          </div>

          {/* Filter and Sort Toolbar */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 mb-6 rounded-lg shadow ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faFilter} className={isDark ? "text-gray-400" : "text-gray-500"} />
              <label htmlFor="filter" className="text-sm font-medium whitespace-nowrap">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`text-sm px-3 py-1.5 rounded-md border flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faSort} className={isDark ? "text-gray-400" : "text-gray-500"} />
              <label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">
                Sort:
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`text-sm px-3 py-1.5 rounded-md border flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div
            className={`p-4 sm:p-6 rounded-lg shadow transition-colors ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            {loading ? (
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                Loading notifications...
              </p>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FontAwesomeIcon
                  icon={faBell}
                  size="2x"
                  className={`${
                    isDark ? "text-gray-500" : "text-gray-400"
                  } mb-3`}
                />
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  You're all caught up! No notifications found.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 p-4 rounded-lg transition-colors ${
                      isDark
                        ? notif.is_read
                          ? "bg-gray-700"
                          : "bg-gray-600 hover:bg-gray-500"
                        : notif.is_read
                        ? "bg-gray-50"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <div className="flex items-start flex-1 min-w-0 gap-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
                          getNotifType(notif.action_type) === "alert"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : getNotifType(notif.action_type) === "message"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={
                            getNotifType(notif.action_type) === "alert"
                              ? faCircleExclamation
                              : getNotifType(notif.action_type) === "message"
                              ? faEnvelopeOpenText
                              : faBell
                          }
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">
                          {notif.action_type.replace(/_/g, ' ')}
                        </p>
                        <p
                          className={`text-sm mt-1 break-words ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {notif.description || "No details available."}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {safeFormatDate(notif.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:flex-col sm:gap-1 sm:ml-2">
                      {!notif.is_read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium text-white transition bg-green-600 rounded-md hover:bg-green-700 whitespace-nowrap"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium text-white transition bg-red-600 rounded-md hover:bg-red-700"
                        title="Delete permanently"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        <span className="ml-1.5 sm:hidden">Remove</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;