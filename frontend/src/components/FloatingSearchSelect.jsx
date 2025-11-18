import { useState, useRef, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

function FloatingSearchSelect({
  id,
  value,
  onChange,
  label,
  shortLabel,
  error,
  options = [],
  placeholder = "Select an option"
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mb-4" ref={wrapperRef}>
      <div
        onClick={() => setOpen(!open)}
        className={`relative w-full border rounded-md px-3 pt-8 pb-3 text-sm cursor-pointer
          ${
            error
              ? "border-red-500"
              : isDark
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
      >
        <div className="truncate text-[0.95rem] sm:text-base">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </div>

        <label
          htmlFor={id}
          className={`absolute left-3 top-1.5 pointer-events-none transition-all duration-200
            ${value ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"}
            ${isDark ? "text-gray-400" : "text-gray-500"}
          `}
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

        <svg
          className={`absolute right-3 top-4 w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          } ${isDark ? "text-gray-400" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div
          className={`absolute z-50 w-full max-w-[calc(100vw-2rem)] mt-1 rounded-md shadow-lg border max-h-60 overflow-auto
            ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}
          `}
        >
          <input
            type="text"
            autoFocus
            className={`w-full p-3 sm:p-2 border-b outline-none text-sm
              ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-gray-50 text-gray-900"}
            `}
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.length === 0 && (
            <div className="p-3 text-sm text-center text-gray-400 select-none">
              No results found
            </div>
          )}

          {filtered.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                onChange({ target: { value: opt } });
                setOpen(false);
                setQuery("");
              }}
              className={`p-3 sm:p-2 text-sm cursor-pointer transition-colors
                hover:bg-blue-100 ${isDark ? "hover:bg-gray-700" : ""}
              `}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingSearchSelect;
