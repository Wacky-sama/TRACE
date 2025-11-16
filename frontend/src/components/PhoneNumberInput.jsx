import { useState, useEffect, useRef } from "react";
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
  error: externalError,
  defaultCountry = "ph",
  onAvailabilityChange,
  onError,
  ...props
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [validationError, setValidationError] = useState("");

  const onAvailabilityChangeRef = useRef(onAvailabilityChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onAvailabilityChangeRef.current = onAvailabilityChange;
    onErrorRef.current = onError;
  }, [onAvailabilityChange, onError]);

  // Debounced phone checker
  useEffect(() => {
    if (!value || value.length < 10) {
      setIsAvailable(null);
      setValidationError("");
      setIsChecking(false);
      onAvailabilityChangeRef.current?.(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      setValidationError("");

      const normalizedValue = value.replace(/\s+/g, "");
      if (!isValidPhoneNumber(normalizedValue)) {
        const msg = "Please enter a valid phone number";
        setValidationError(msg);
        onAvailabilityChangeRef.current?.(null);
        onErrorRef.current?.(msg);
        setIsChecking(false);
        return;
      }

      try {
        const response = await api.post("/users/check-phone", {
          contact_number: normalizedValue,
        });

        setIsAvailable(response.data.available);
        onAvailabilityChangeRef.current?.(response.data.available);

        if (!response.data.available) {
          setValidationError(response.data.message);
          onErrorRef.current?.(response.data.message);
        } else {
          onErrorRef.current?.(null);
        }
      } catch (err) {
        console.error("Phone check failed:", err);
        const msg = "Failed to check phone availability";
        setValidationError(msg);
        setIsAvailable(null);
        onAvailabilityChangeRef.current?.(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleChange = (phone) => {
    onChange({ target: { id, value: phone } });
  };

  const displayError = externalError || validationError;

  const getStatusIcon = () => {
    if (!value || value.length < 10) return null;
    if (isChecking) {
      return (
        <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
      );
    }
    if (isAvailable === true) {
      return (
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }
    if (isAvailable === false) {
      return (
        <svg
          className="w-5 h-5 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }
    return null;
  };

  const hasValue = value && value.trim() !== "";

  return (
    <div className="relative mb-4">
      {/* Floating Label — copied from old component */}
      <label
        htmlFor={id}
        className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none z-10
        ${hasValue ? "-top-1.5 text-[12px] text-blue-600" : "top-3 text-sm"}
        ${isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}
      >
        {label}
      </label>

      {/* Phone Input */}
      <div className="relative">
        <IntlPhoneInput
          id={id}
          value={value}
          onChange={handleChange}
          defaultCountry={defaultCountry}
          className={`w-full p-3 pt-4 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${
              displayError
                ? "border-red-500"
                : isAvailable === true
                ? "border-green-500"
                : isAvailable === false
                ? "border-red-500"
                : isDark
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
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

        {/* Status icon */}
        <div className="absolute top-0 bottom-0 flex items-center right-3">
          {getStatusIcon()}
        </div>
      </div>

      {/* Error or Success Message */}
      {displayError && (
        <p className="mt-1 text-xs text-red-500">{displayError}</p>
      )}
      {!displayError &&
        value &&
        value.length >= 10 &&
        !isChecking &&
        isAvailable === true && (
          <p className="mt-1 text-xs text-green-500">
            ✓ Phone number is available
          </p>
        )}
    </div>
  );
}

export default PhoneNumberInput;
