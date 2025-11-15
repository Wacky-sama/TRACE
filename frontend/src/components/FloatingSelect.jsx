import { useTheme } from "../hooks/useTheme";

function FloatingSelect({
  id,
  value,
  onChange,
  label,
  shortLabel,
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
          className={`w-full px-3 pt-8 pb-3 border rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 peer
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
            const optionValue = typeof opt === "object" ? opt.value : opt;
            const optionLabel = typeof opt === "object" ? opt.label : opt;

            return (
              <option key={i} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        <label
          htmlFor={id}
          className={`absolute left-3 top-1.5 pointer-events-none transition-all duration-200 transform origin-left
            ${value && value !== "" ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"}
            ${
              isDark
                ? "text-gray-400"
                : "text-gray-500"
            }
            max-w-[85%] truncate leading-tight`}
        >
          {shortLabel ? (
            <>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel}</span>
            </>
          ) : (
            label
          )}
        </label>

        <div className="absolute inset-y-0 flex items-center pointer-events-none right-3">
          <svg
            className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingSelect;