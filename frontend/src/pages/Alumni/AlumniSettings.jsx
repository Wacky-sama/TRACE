/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import { toast } from "react-toastify";

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

const AlumniSettings = () => {
  const isDark = useDarkMode();
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, []);

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      await api.post("/users/change-password", passwordData);
      toast.success("Password changed successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch {
      toast.error("Failed to change password.");
    }
  };

  return (
    <div
      className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-6">
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Settings
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Manage your account preferences and security options.
            </p>
          </header>

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-300 dark:border-gray-700">
            <nav className="flex space-x-6">
              {[
                { key: "account", label: "Account Information", icon: faUser },
                { key: "password", label: "Change Password", icon: faLock },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 pb-2 text-lg font-medium transition-colors border-b-2 ${
                    activeTab === tab.key
                      ? isDark
                        ? "border-blue-400 text-blue-400"
                        : "border-blue-600 text-blue-600"
                      : isDark
                      ? "border-transparent text-gray-400 hover:text-gray-200"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "account" && (
              <motion.section
                key="account"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-xl shadow-md p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {user ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Full Name
                      </p>
                      <p className="text-lg font-semibold">
                        {user.firstname} {user.lastname}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="text-lg font-semibold">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Role
                      </p>
                      <p className="text-lg font-semibold capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading user data...
                  </p>
                )}
              </motion.section>
            )}

            {activeTab === "password" && (
              <motion.section
                key="password"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-xl shadow-md p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.current}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          current: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.new}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          new: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirm: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                </form>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AlumniSettings;
