/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import api from "../../services/api";
import {
  isStrongPassword,
  getPasswordStrength,
  getPasswordStrengthMessage,
} from "../../utils/passwordUtils";
import FloatingInput from "../../components/FloatingInput";

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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!isStrongPassword(passwordData.new)) {
      toast.error(getPasswordStrengthMessage(passwordData.new));
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await api.post("/users/change-password", {
        current_password: passwordData.current,
        new_password: passwordData.new,
        confirm_new_password: passwordData.confirm,
      });
      toast.success("Password changed successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordStrength({ score: 0, label: "" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to change password.");
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
                <h2
                  className={`text-2xl font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Change Password
                </h2>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <FloatingInput
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value,
                      })
                    }
                    label="Current Password"
                  >
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </FloatingInput>

                  <FloatingInput
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.new}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPasswordData({ ...passwordData, new: value });
                      setPasswordStrength(getPasswordStrength(value));
                    }}
                    label="New Password"
                  >
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
                    >
                      <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </FloatingInput>

                  {passwordData.new && (
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.score === 0
                              ? "bg-gray-300 w-0"
                              : passwordStrength.score === 1
                              ? "bg-red-500 w-1/4"
                              : passwordStrength.score === 2
                              ? "bg-orange-400 w-2/4"
                              : passwordStrength.score === 3
                              ? "bg-yellow-400 w-3/4"
                              : "bg-green-500 w-full"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          passwordStrength.score <= 2
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}

                  <FloatingInput
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm: e.target.value,
                      })
                    }
                    label="Confirm New Password"
                  >
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </FloatingInput>

                  {passwordData.new && passwordData.confirm && (
                    <p
                      className={`text-sm mt-1 ${
                        passwordData.new === passwordData.confirm
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordData.new === passwordData.confirm
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 mt-4 font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
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
