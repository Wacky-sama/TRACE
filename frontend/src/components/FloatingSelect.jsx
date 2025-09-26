function FloatingSelect({ 
  id, 
  value, 
  onChange, 
  label, 
  error, 
  options = [], 
  placeholder = "Select an option", 
  ...props 
}) {
  return (
    <div className="mb-2">
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="w-full p-3 pt-6 pl-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer bg-white"
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left
            peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
            peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-600"
        >
          {label}
        </label>
      </div>
      <div className="h-5 mt-1">
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  );
}

export default FloatingSelect;