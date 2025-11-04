import { useTheme } from "../context/ThemeProvider";

function FloatingInput({
  id,
  type = "text",
  value,
  onChange,
  label,
  error,
  icon,
  children,
  darkMode,
  labelClassName = "",
  ...props
}) {
  const { theme } = useTheme();
  const isDark = darkMode ?? theme === "dark";
  const hasValue = value && value !== "";

  return (
    <div className="mb-4">
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <span className="absolute z-10 text-gray-400 -translate-y-1/2 left-3 top-1/2">
            {icon}
          </span>
        )}
        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          className={`w-full p-3 pt-6 ${icon ? "pl-10" : "pl-3"} ${
            children ? "pr-8" : ""
          } 
            border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer
            ${
              error
                ? "border-red-500"
                : isDark
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`absolute pointer-events-none ${
            icon ? "left-10" : "left-3"
          } transition-all duration-200 transform origin-left
          ${hasValue ? "top-1" : "top-1/2 -translate-y-1/2"}
          peer-focus:top-1 peer-focus:-translate-y-0
          ${
            isDark
              ? "text-gray-400 peer-focus:text-blue-400"
              : "text-gray-500 peer-focus:text-blue-600"
          } ${labelClassName || "text-sm peer-focus:text-xs"}`}
                >
          {label}
        </label>
        {/* Right Children (e.g. Eye toggle) */}
        {children && (
          <div className="absolute inset-y-0 flex items-center right-3">
            {children}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingInput;
