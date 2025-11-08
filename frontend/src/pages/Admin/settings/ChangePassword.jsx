import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import api from "../../../services/api";
import {
  isStrongPassword,
  getPasswordStrength,
  getPasswordStrengthMessage,
} from "../../../utils/passwordUtils";
import FloatingInput from "../../../components/FloatingInput";
import { useTheme } from "../../../hooks/useTheme";

const AdminChangePassword = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error("All fields are required.");
      return;
    }

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
    <section
      className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
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
        {/* Current Password */}
        <FloatingInput
          id="currentPassword"
          type={showPassword ? "text" : "password"}
          value={passwordData.current}
          onChange={(e) =>
            setPasswordData({ ...passwordData, current: e.target.value })
          }
          label="Current Password"
        >
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </FloatingInput>

        {/* New Password */}
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
            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
          </span>
        </FloatingInput>

        {/* Password Strength Meter */}
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
                passwordStrength.score <= 2 ? "text-red-500" : "text-green-600"
              }`}
            >
              {passwordStrength.label}
            </p>
          </div>
        )}

        {/* Confirm Password */}
        <FloatingInput
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={passwordData.confirm}
          onChange={(e) =>
            setPasswordData({ ...passwordData, confirm: e.target.value })
          }
          label="Confirm New Password"
        >
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
          >
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
            />
          </span>
        </FloatingInput>

        {/* Password Match Indicator */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-4 font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>
    </section>
  );
};

export default AdminChangePassword;
