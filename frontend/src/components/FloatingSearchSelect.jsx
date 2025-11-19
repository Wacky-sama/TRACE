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
  placeholder = "Search or select...",
  darkMode,
  disabled = false,
  ...props
}) {
  const { theme } = useTheme();
  const isDark = darkMode ?? theme === "dark";
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter options based on search
  const filteredOptions = options.filter((opt) => {
    const optionLabel = typeof opt === "object" ? opt.label : opt;
    return optionLabel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get display value
  const getDisplayValue = () => {
    if (!value) return "";
    const selected = options.find((opt) => {
      const optVal = typeof opt === "object" ? opt.value : opt;
      return optVal === value;
    });
    return typeof selected === "object" ? selected.label : selected || "";
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (option) => {
    const optionValue = typeof option === "object" ? option.value : option;
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { value: "" } });
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <div className="relative">
        {/* Input Field */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={isOpen ? searchTerm : getDisplayValue()}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={!value ? placeholder : ""}
          className={`w-full px-3 pt-8 pb-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition-colors
            ${
              error
                ? "border-red-500"
                : isDark
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
          `}
          autoComplete="off"
          {...props}
        />

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute left-3 top-1.5 pointer-events-none transition-all duration-200 transform origin-left
            ${value || isOpen ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"}
            ${isDark ? "text-gray-400" : "text-gray-500"}
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

        {/* Clear & Dropdown Icons */}
        <div className="absolute inset-y-0 flex items-center gap-1 right-3">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-1 hover:bg-opacity-10 rounded transition-colors ${
                isDark ? "hover:bg-white" : "hover:bg-black"
              }`}
              tabIndex={-1}
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            } ${isDark ? "text-gray-400" : "text-gray-500"}`}
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

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          className={`absolute z-50 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto border
            ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
            }`}
        >
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => {
                const optionValue = typeof option === "object" ? option.value : option;
                const optionLabel = typeof option === "object" ? option.label : option;
                const isSelected = optionValue === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={optionValue}
                    onClick={() => handleSelect(option)}
                    className={`px-3 py-2 cursor-pointer text-sm transition-colors
                      ${isSelected
                        ? isDark
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : isHighlighted
                        ? isDark
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        : isDark
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {optionLabel}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div
              className={`px-3 py-2 text-sm text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No results found
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingSearchSelect;
