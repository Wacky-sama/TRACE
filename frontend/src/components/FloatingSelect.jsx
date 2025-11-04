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
  ...props
}) {
  const { theme } = useTheme();
  const isDark = darkMode ?? theme === "dark";

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
            const label = typeof opt === "string" ? opt : opt.label;
            const val = typeof opt === "string" ? opt : opt.value;
            return (
              <option key={i} value={val}>
                {label}
              </option>
            );
          })}
        </select>

        <label
          htmlFor={id}
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left
            peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
            peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 
            peer-[:not(:placeholder-shown)]:text-xs
            ${
              isDark
                ? "text-gray-400 peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:text-gray-300"
                : "text-gray-500 peer-[:not(:placeholder-shown)]:text-gray-600"
            }`}
        >
          {label}
        </label>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingSelect;
