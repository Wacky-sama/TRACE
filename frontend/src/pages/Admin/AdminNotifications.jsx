import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelopeOpenText,
  faTrash,
  faCircleExclamation,
  faSort,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { formatDistanceToNow, parseISO } from "date-fns";
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

const AdminNotifications = () => {
  const isDark = useDarkMode();
  const [notifications, setNotifications] = useState([]);
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
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const deleteNotification = async (id) => {
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

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl">
          <h1
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Notifications
          </h1>
          <p
            className={`mb-8 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Manage system alerts, user updates, and platform events in real-time.
          </p>

          {/* Filter and Sort Toolbar */}
          <div
            className={`flex flex-wrap items-center justify-between p-4 mb-6 rounded-lg shadow ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faFilter} />
              <label htmlFor="filter" className="text-sm font-medium ml-2">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`text-sm px-2 py-1 rounded border ${
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

            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faSort} />
              <label htmlFor="sort" className="text-sm font-medium ml-2">
                Sort:
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`text-sm px-2 py-1 rounded border ${
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
            className={`p-6 rounded-lg shadow transition-colors ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            {loading ? (
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                Loading notifications...
              </p>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <FontAwesomeIcon
                  icon={faBell}
                  size="2x"
                  className={`${isDark ? "text-gray-500" : "text-gray-400"} mb-3`}
                />
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  You’re all caught up! No notifications found.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex justify-between items-start p-4 rounded-lg my-2 transition-colors ${
                      isDark
                        ? notif.is_read
                          ? "bg-gray-700"
                          : "bg-gray-600 hover:bg-gray-500"
                        : notif.is_read
                        ? "bg-gray-50"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          notif.type === "alert"
                            ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-400"
                            : notif.type === "message"
                            ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={
                            notif.type === "alert"
                              ? faCircleExclamation
                              : notif.type === "message"
                              ? faEnvelopeOpenText
                              : faBell
                          }
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {notif.message || "No details available."}
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

                    <div className="flex space-x-2">
                      {!notif.is_read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
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
