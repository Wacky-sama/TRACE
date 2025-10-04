import { useState, useEffect } from "react";
import { checkUsernameAvailability } from "../services/authService";
import FloatingInput from "./FloatingInput";

function UsernameInput({ value, onChange, error: externalError, onAvailabilityChange }) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    // Don't check if username is empty or too short
    if (!value || value.length < 3) {
      setIsAvailable(null);
      setValidationError("");
      setIsChecking(false);
      return;
    }

    // Debounce the API call - wait 500ms after user stops typing
    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      setValidationError("");

      try {
        const response = await checkUsernameAvailability(value);
        setIsAvailable(response.available);
        
        // Notify parent component of availability status
        if (onAvailabilityChange) {
          onAvailabilityChange(response.available);
        }
        
        if (!response.available) {
          setValidationError(response.message);
        }
      } catch (err) {
        console.error("Username check failed:", err);
        setValidationError("Failed to check username availability");
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [value]);

  const getStatusIcon = () => {
    if (!value || value.length < 3) return null;

    if (isChecking) {
      return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      );
    }

    if (isAvailable === true) {
      return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 text-green-600"
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
        </div>
      );
    }

    if (isAvailable === false) {
      return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 text-red-600"
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
        </div>
      );
    }

    return null;
  };

  // Show external error first, then validation error
  const displayError = externalError || validationError;

  return (
    <div className="relative mb-4">
      <FloatingInput
        id="username"
        value={value}
        onChange={onChange}
        label="Username"
        error={displayError}
        className={`pr-10 ${
          isAvailable === true ? "border-green-500 focus:border-green-500" : ""
        } ${
          isAvailable === false ? "border-red-500 focus:border-red-500" : ""
        }`}
      />
      {getStatusIcon()}
      
      {value && value.length >= 3 && !isChecking && isAvailable === true && (
        <p className="text-green-600 text-xs mt-1">
          ✓ Username is available
        </p>
      )}
    </div>
  );
}

export default UsernameInput;