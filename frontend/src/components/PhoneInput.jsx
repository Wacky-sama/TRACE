import { PhoneInput as IntlPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useTheme } from "../context/ThemeProvider";
import { isValidPhoneNumber } from "libphonenumber-js";

function PhoneInput({
  id,
  value,
  onChange,
  label,
  error,
  defaultCountry = "ph",
  onError,
  ...props
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleBlur = () => {
    if (value && !isValidPhoneNumber(value)) {
      onError && onError("Please enter a valid phone number (e.g., +63 912 345 6789)");
    } else {
      onError && onError("");
    }
  };

  const handleChange = (phone) => {
    onChange({ target: { value: phone } });
  };

  return (
    <div className="mb-4">
      {/* Standard Label */}
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>

      {/* Wrapped IntlPhoneInput */}
      <IntlPhoneInput
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        defaultCountry={defaultCountry}
        className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDark
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-gray-900 border-gray-300"
        }`}
        countrySelectorStyleProps={{
          buttonClassName: `flex items-center px-2 py-1 border-r rounded-l-md ${
            isDark
              ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-600"
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

      {/* Error Message */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default PhoneInput;
