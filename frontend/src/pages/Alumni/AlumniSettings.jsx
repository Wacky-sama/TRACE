/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import AccountInfo from "./settings/AccountInfo";
import ChangePassword from "./settings/ChangePassword";

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

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const tabs = [
    { key: "account", label: "Account Information", icon: faUser },
    { key: "password", label: "Change Password", icon: faLock },
  ];

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
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

          <div className="mb-8 border-b border-gray-300 dark:border-gray-700">
            <nav className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 pb-2 text-lg font-medium border-b-2 transition-colors ${
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

          <AnimatePresence mode="wait">
            {activeTab === "account" && (
              <motion.div
                key="account"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-xl shadow-md p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <AccountInfo />
              </motion.div>
            )}
            {activeTab === "password" && (
              <motion.div
                key="password"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-xl shadow-md p-6 transition-colors ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <ChangePassword />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AlumniSettings;
