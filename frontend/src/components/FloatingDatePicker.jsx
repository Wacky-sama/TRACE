import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function FloatingDatePicker({
  id,
  value,
  onChange,
  label,
  error,
  minDate = new Date(1900, 0, 1),
  maxDate = new Date(),
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const CustomInput = forwardRef(({ value: inputValue, onClick }, ref) => (
    <div className="relative w-full">
      <input
        id={id}
        ref={ref}
        value={inputValue || ""}
        onClick={onClick}
        readOnly
        placeholder=" "
        onFocus={(e) => {
          setIsFocused(true);
          onClick?.(e);
        }}
        onBlur={() => setIsFocused(false)}
        className="w-full p-3 pt-6 pl-3 border border-gray-300 rounded-md text-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 peer cursor-pointer bg-white"
      />

      <label
        htmlFor={id}
        className={`absolute left-3 text-sm transition-all duration-200 transform origin-left
            ${isFocused || inputValue
            ? "top-1 translate-y-0 text-xs " + (isFocused ? "text-blue-500" : "text-gray-500")
            : "top-1/2 -translate-y-1/2 text-gray-500"}`}
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
        {...props}
      />

      <div className="h-5 mt-1">
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  );
}

export default FloatingDatePicker;
