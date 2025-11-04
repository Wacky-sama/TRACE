/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const AlumniSystemAlerts = ({ notifications, loading, markAsRead, isDark }) => {
  return (
    <section className="space-y-4">
      {loading ? (
        <div
          className={`p-6 rounded-lg shadow ${
            isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
          }`}
        >
          Loading system alerts...
        </div>
      ) : notifications.length === 0 ? (
        <div
          className={`p-6 rounded-lg shadow ${
            isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
          }`}
        >
          No system alerts.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notifications.map((notif) => (
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
                <span className="inline-block px-2 py-1 mt-2 text-xs text-white bg-blue-600 rounded-full">
                  New
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AlumniSystemAlerts;