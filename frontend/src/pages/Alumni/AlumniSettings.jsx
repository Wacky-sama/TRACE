/* eslint-disable no-unused-vars */
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGear } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import AlumniAccountInfo from "./settings/AccountInfo";
import AlumniChangePassword from "./settings/ChangePassword";
import AlumniSystemPreference from "./settings/SystemPreference";

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
                    ? "/alumni/settings/change-password"
                    : e.target.value === "system"
                    ? "/alumni/settings/system-preference"
                    : "/alumni/settings"
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
                        ? "/alumni/settings/change-password"
                        : tab.key === "system"
                        ? "/alumni/settings/system-preference"
                        : "/alumni/settings"
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
                className={`rounded-xl shadow-md p-4 sm:p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <AlumniAccountInfo />
              </motion.div>
            )}
            {activeTab === "password" && (
              <motion.div
                key="password"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-xl shadow-md p-4 sm:p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <AlumniChangePassword />
              </motion.div>
            )}
            {activeTab === "system" && (
              <motion.div
                key="system"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-xl shadow-md p-4 sm:p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <AlumniSystemPreference />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AlumniSettings;
