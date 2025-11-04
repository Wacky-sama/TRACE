import { useTheme } from "../context/ThemeProvider";

function FloatingSelect({
  id,
  value,
  onChange,
  label,
  error,
  options = [],
  placeholder = "Select an option",
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
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full p-3 pt-6 border rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 peer
            ${
              error
                ? "border-red-500"
                : isDark
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt, i) => {
            const labelText = typeof opt === "string" ? opt : opt.label;
            const val = typeof opt === "string" ? opt : opt.value;
            return (
              <option key={i} value={val}>
                {labelText}
              </option>
            );
          })}
        </select>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute left-3 transition-all duration-200 transform origin-left
            ${hasValue ? "top-1 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
            peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs
            ${
              isDark
                ? "text-gray-400 peer-focus:text-blue-400"
                : "text-gray-500 peer-focus:text-blue-600"
            } ${labelClassName}`}
        >
          {label}
        </label>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingSelect;
