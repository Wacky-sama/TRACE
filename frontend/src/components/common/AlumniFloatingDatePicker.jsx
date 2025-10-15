import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker-dark.css";
import { useTheme } from "../../hooks/useTheme"; // adjust path if needed

function AlumniFloatingDatePicker({
  id,
  value,
  onChange,
  label,
  error,
  minDate = new Date(1900, 0, 1),
  maxDate = new Date(),
  ...props
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const CustomInput = forwardRef(({ value: inputValue, onClick }, ref) => (
    <div className="relative w-full">
      <input
        id={id}
        ref={ref}
        value={inputValue || ""}
        onClick={onClick}
        readOnly
        placeholder=" "
        className={`w-full p-3 pt-6 pl-3 text-sm rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 peer border transition-colors duration-300
          ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left pointer-events-none
          peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
          peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs
          ${isDark ? "peer-[:not(:placeholder-shown)]:text-gray-300" : "peer-[:not(:placeholder-shown)]:text-gray-600"}`}
      >
        {label}
      </label>
    </div>
  ));

  return (
    <div className="mb-2">
      <DatePicker
        selected={value instanceof Date ? value : null}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="MM/dd/yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={200}
        scrollableYearDropdown
        customInput={<CustomInput />}
        isClearable
        popperClassName={isDark ? "react-datepicker-dark" : ""}
        {...props}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default AlumniFloatingDatePicker;
