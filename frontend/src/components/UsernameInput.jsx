import { useState, useEffect } from "react";
import { checkUsernameAvailability } from "../services/authService";
import { useTheme } from "../context/ThemeProvider";

function UsernameInput({
  id,
  value,
  onChange,
  error: externalError,
  onAvailabilityChange,
  ...props
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!value || value.length < 3) {
      setIsAvailable(null);
      setValidationError("");
      setIsChecking(false);
      if (onAvailabilityChange) onAvailabilityChange(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      setValidationError("");

      try {
        const response = await checkUsernameAvailability(value);
        setIsAvailable(response.available);
        if (onAvailabilityChange) onAvailabilityChange(response.available);
        if (!response.available) setValidationError(response.message);
      } catch (err) {
        console.error("Username check failed:", err);
        setValidationError("Failed to check username availability");
        setIsAvailable(null);
        if (onAvailabilityChange) onAvailabilityChange(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, onAvailabilityChange]);

  const getStatusIcon = () => {
    if (!value || value.length < 3) return null;
    if (isChecking) {
      return <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />;
    }
    if (isAvailable === true) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (isAvailable === false) {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return null;
  };

  const displayError = externalError || validationError;

  return (
    <div className="mb-2">
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={onChange}
          placeholder=" "
          className={`w-full p-3 pt-6 pr-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer
            ${displayError
              ? "border-red-500"
              : isAvailable === true
              ? "border-green-500"
              : isAvailable === false
              ? "border-red-500"
              : isDark
              ? "border-gray-600 bg-gray-800 text-white"
              : "border-gray-300 bg-white text-gray-900"}`}
          {...props}
        />

        <label
          htmlFor={id}
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left
            peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
            peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 
            peer-[:not(:placeholder-shown)]:text-xs
            ${isDark ? "text-gray-400 peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:text-gray-300" : "text-gray-500 peer-[:not(:placeholder-shown)]:text-gray-600"}`}
        >
          Username
        </label>

        <div className="absolute inset-y-0 flex items-center right-3">{getStatusIcon()}</div>
      </div>

      <div className="h-5 mt-1">
        {displayError && <p className="text-xs text-red-500">{displayError}</p>}
        {!displayError && value && value.length >= 3 && !isChecking && isAvailable === true && (
          <p className="text-xs text-green-500">✓ Username is available</p>
        )}
      </div>
    </div>
  );
}

export default UsernameInput;
