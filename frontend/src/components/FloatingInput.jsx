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
  return (
    <div className="mb-4">
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
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
          className={`w-full p-3 pt-6 ${icon ? "pl-10" : "pl-3"} ${children ? "pr-10" : ""} 
            border border-gray-300 rounded-md text-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 peer`}
          {...props}
        />

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute ${icon ? "left-10" : "left-3"} top-1/2 -translate-y-1/2 
            text-gray-500 text-sm transition-all duration-200 transform origin-left
            peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
            peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 
            peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-600`}
        >
          {label}
        </label>

        {/* Right Children (e.g. Eye toggle) */}
        {children && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {children}
          </div>
        )}
      </div>

      {/* Error Message */}
      <div className="h-5 mt-1">
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  );
}

export default FloatingInput;
