import { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeProvider";
import api from "../../../services/api";

const AdminAccountInfo = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className={`p-6 rounded-xl shadow-md text-center ${
          isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
        }`}
      >
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`p-6 rounded-xl shadow-md text-center ${
          isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
        }`}
      >
        <p>Failed to load account information.</p>
      </div>
    );
  }

  return (
    <section
      className={`rounded-xl shadow-md p-6 transition-colors ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-semibold mb-4 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Account Information
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
          <p
            className={`text-lg font-semibold ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {user.firstname} {user.lastname}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p
            className={`text-lg font-semibold ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {user.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
          <p
            className={`text-lg font-semibold capitalize ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {user.role}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminAccountInfo;
