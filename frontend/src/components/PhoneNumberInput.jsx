import { useState, useEffect } from "react";
import { PhoneInput as IntlPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useTheme } from "../hooks/useTheme";
import { isValidPhoneNumber } from "libphonenumber-js";
import api from "../services/api";

function PhoneNumberInput({
  id,
  value,
  onChange,
  label,
  error,
  defaultCountry = "ph",
  onAvailabilityChange,
  onError,
  ...props
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const checkAvailability = async () => {
      if (!value || value.length < 10) {
        setAvailability(null);
        onAvailabilityChange?.(null);
        return;
      }

      // First validate format
      const normalizedValue = value.replace(/\s+/g, "");
      if (!isValidPhoneNumber(normalizedValue)) {
        setValidationError("Please enter a valid phone number");
        setAvailability(null);
        onAvailabilityChange?.(false);
        onError?.("Please enter a valid phone number");
        return;
      }

      setValidationError("");
      setChecking(true);

      try {
        const response = await api.post("/users/check-phone", {
          contact_number: normalizedValue,
        });

        setAvailability(response.data.available);
        onAvailabilityChange?.(response.data.available);

        if (!response.data.available) {
          onError?.(response.data.message);
        } else {
          onError?.(null);
        }
      } catch (err) {
        console.error("Error checking phone availability:", err);
        setAvailability(null);
        onAvailabilityChange?.(null);
      } finally {
        setChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [value, onAvailabilityChange, onError]);

  const handleChange = (phone) => {
    onChange({ target: { id, value: phone } });
  };

  const handleBlur = () => {
    const normalizedValue = value?.replace(/\s+/g, "") || "";

    if (normalizedValue && !isValidPhoneNumber(normalizedValue)) {
      setValidationError("Please enter a valid phone number");
      onError?.("Please enter a valid phone number (e.g., +63 912 345 6789)");
    } else {
      setValidationError("");
      if (availability === true) {
        onError?.(null);
      }
    }
  };

  const getStatusColor = () => {
    if (validationError) return isDark ? "text-red-400" : "text-red-600";
    if (checking) return isDark ? "text-gray-400" : "text-gray-500";
    if (availability === true) return isDark ? "text-green-400" : "text-green-600";
    if (availability === false) return isDark ? "text-red-400" : "text-red-600";
    return "";
  };

  const getStatusMessage = () => {
    if (validationError) return validationError;
    if (checking) return "Checking...";
    if (availability === true) return "Phone number is available";
    if (availability === false) return "Phone number is already registered";
    return "";
  };

  const hasValue = value && value.trim() !== "";

  return (
    <div className="relative mb-4">
      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none z-10
        ${
          hasValue
            ? "text-xs -top-2.5"
            : "top-3 text-sm"
        } 
        ${
          error || validationError
            ? isDark
              ? "text-red-400"
              : "text-red-600"
            : hasValue
            ? isDark
              ? "text-blue-400 bg-gray-800"
              : "text-blue-600 bg-white"
            : isDark
            ? "bg-gray-800 text-gray-400"
            : "bg-white text-gray-500"
        }`}
      >
        {label}
      </label>

      {/* Phone Input */}
      <IntlPhoneInput
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        defaultCountry={defaultCountry}
        className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 
          ${
            error || validationError
              ? isDark
                ? "border-red-500 focus:ring-red-500 bg-gray-800 text-white"
                : "border-red-500 focus:ring-red-500 bg-white text-gray-900"
              : isDark
              ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-500"
              : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
          }`}
        countrySelectorStyleProps={{
          buttonClassName: `flex items-center px-2 py-1 border-r rounded-l-md ${
            isDark
              ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
              : "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200"
          }`,
          dropdownStyleProps: {
            className: `absolute z-50 mt-1 w-full max-h-60 overflow-auto border rounded-md shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`,
          },
        }}
        {...props}
      />

      {/* Status message */}
      {value && getStatusMessage() && (
        <p className={`text-sm mt-1 ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
      )}

      {/* Error from parent */}
      {error && !validationError && !getStatusMessage() && (
        <p className={`text-sm mt-1 ${isDark ? "text-red-400" : "text-red-600"}`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default PhoneNumberInput;