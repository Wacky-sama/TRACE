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
  
  // Store callbacks in refs to avoid dependency issues
  const onAvailabilityChangeRef = useRef(onAvailabilityChange);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onAvailabilityChangeRef.current = onAvailabilityChange;
    onErrorRef.current = onError;
  }, [onAvailabilityChange, onError]);

  useEffect(() => {
    if (!value || value.length < 10) {
      setIsAvailable(null);
      setValidationError("");
      setIsChecking(false);
      if (onAvailabilityChangeRef.current) onAvailabilityChangeRef.current(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      setValidationError("");

      // Validate format first
      const normalizedValue = value.replace(/\s+/g, "");
      if (!isValidPhoneNumber(normalizedValue)) {
        setValidationError("Please enter a valid phone number");
        setIsAvailable(null);
        if (onAvailabilityChangeRef.current) onAvailabilityChangeRef.current(null);
        if (onErrorRef.current) onErrorRef.current("Please enter a valid phone number");
        setIsChecking(false);
        return;
      }

      try {
        const response = await api.post("/users/check-phone", {
          contact_number: normalizedValue,
        });
        setIsAvailable(response.data.available);
        if (onAvailabilityChangeRef.current) onAvailabilityChangeRef.current(response.data.available);
        if (!response.data.available) {
          setValidationError(response.data.message);
          if (onErrorRef.current) onErrorRef.current(response.data.message);
        } else {
          if (onErrorRef.current) onErrorRef.current(null);
        }
      } catch (err) {
        console.error("Phone check failed:", err);
        setValidationError("Failed to check phone availability");
        setIsAvailable(null);
        if (onAvailabilityChangeRef.current) onAvailabilityChangeRef.current(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleChange = (phone) => {
    onChange({ target: { id, value: phone } });
  };

  const getStatusIcon = () => {
    if (!value || value.length < 10) return null;
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
  const hasValue = value && value.trim() !== "";

  return (
    <div className="mb-2">
      <div className="relative">
        <IntlPhoneInput
          id={id}
          value={value}
          onChange={handleChange}
          defaultCountry={defaultCountry}
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

        <label
          htmlFor={id}
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left pointer-events-none
            peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
            ${hasValue ? "top-1 translate-y-0 text-xs" : ""}
            ${isDark ? "text-gray-400 peer-focus:text-blue-400" : "text-gray-500"}
            ${hasValue && !isDark ? "text-gray-600" : ""}
            ${hasValue && isDark ? "text-gray-300" : ""}`}
        >
          {label}
        </label>

        <div className="absolute inset-y-0 flex items-center right-3">{getStatusIcon()}</div>
      </div>

      <div className="h-5 mt-1">
        {displayError && <p className="text-xs text-red-500">{displayError}</p>}
        {!displayError && value && value.length >= 10 && !isChecking && isAvailable === true && (
          <p className="text-xs text-green-500">✓ Phone number is available</p>
        )}
      </div>
    </div>
  );
}

export default PhoneNumberInput;