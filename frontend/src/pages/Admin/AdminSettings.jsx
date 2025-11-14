/* eslint-disable no-unused-vars */
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGear } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import AdminAccountInfo from "./settings/AccountInfo";
import AdminChangePassword from "./settings/ChangePassword";
import AdminSystemPreference from "./settings/SystemPreference";
import { useTheme } from "../../hooks/useTheme";

const AdminSettings = () => {
  const { theme } = useTheme();  
  const isDark = theme === "dark"; 
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.includes("change-password")
    ? "password"
    : location.pathname.includes("system-preference")
    ? "system"
    : "account";

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const tabs = [
    { key: "account", label: "Account Information", icon: faUser },
    { key: "password", label: "Change Password", icon: faLock },
    { key: "system", label: "System Preference", icon: faGear },
  ];

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <main className="flex-1 p-4 sm:p-6">
        <div className="w-full max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-6 text-center sm:text-left">
            <h1
              className={`text-2xl sm:text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Settings
            </h1>
            <p
              className={`text-base sm:text-lg ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Manage your account preferences and security options.
            </p>
          </header>

          {/* Responsive Dropdown for Mobile */}
          <div className="mb-6 sm:hidden">
            <select
              value={activeTab}
              onChange={(e) =>
                navigate(
                  e.target.value === "password"
                    ? "/admin/settings/change-password"
                    : e.target.value === "system"
                    ? "/admin/settings/system-preference"
                    : "/admin/settings"
                )
              }
              className={`w-full p-2 rounded-md border text-sm font-medium ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              {tabs.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs Navigation for Desktop */}
          <div className="hidden mb-8 border-b border-gray-300 sm:block dark:border-gray-700">
            <nav className="flex flex-wrap gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    navigate(
                      tab.key === "password"
                        ? "/admin/settings/change-password"
                        : tab.key === "system"
                        ? "/admin/settings/system-preference"
                        : "/admin/settings"
                    )
                  }
                  className={`flex items-center gap-2 pb-2 text-sm sm:text-lg font-medium border-b-2 transition-colors ${
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
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "account" && (
              <motion.div
                key="account"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AdminAccountInfo />
              </motion.div>
            )}
            {activeTab === "password" && (
              <motion.div
                key="password"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AdminChangePassword />
              </motion.div>
            )}
            {activeTab === "system" && (
              <motion.div
                key="system"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AdminSystemPreference />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
