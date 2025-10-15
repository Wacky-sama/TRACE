import { useEffect, useState } from "react";

function FloatingInput({ 
  id, 
  type = "text", 
  value, 
  onChange, 
  label, 
  error, 
  icon, 
  children, 
  ...props 
}) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Listen for changes to dark mode dynamically
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mb-2">
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
          className={`w-full p-3 pt-6 ${icon ? "pl-10" : "pl-3"} ${children ? "pr-8" : ""} 
            border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer
            ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
          {...props}
        />

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute ${icon ? "left-10" : "left-3"} top-1/2 -translate-y-1/2 
            text-gray-500 text-sm transition-all duration-200 transform origin-left
            peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
            peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 
            peer-[:not(:placeholder-shown)]:text-xs
            ${isDark ? "text-gray-400 peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:text-gray-300" : "text-gray-500 peer-[:not(:placeholder-shown)]:text-gray-600"}`}
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
