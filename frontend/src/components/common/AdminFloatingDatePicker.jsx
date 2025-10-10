import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AdminFloatingDatePicker({
  id,
  value,
  onChange,
  label,
  error,
  minDate = new Date(), 
  maxDate,
  ...props
}) {
  const CustomInput = forwardRef(({ value: inputValue, onClick }, ref) => {
    return (
      <div className="relative w-full">
        <input
          id={id}
          ref={ref}
          value={inputValue || ""}
          onClick={onClick}
          readOnly
          placeholder=" "
          className="w-full p-3 pt-6 pl-3 border border-gray-300 rounded-md text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 peer cursor-pointer bg-white"
        />

        <label
          htmlFor={id}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left pointer-events-none
            peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
            peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-600"
        >
          {label}
        </label>
      </div>
    );
  });

  return (
    <div className="mb-2">
      <DatePicker
        selected={value instanceof Date ? value : null}
        onChange={onChange}
        minDate={minDate} // ✅ Only restricts to today or future
        maxDate={maxDate} // ✅ Can be undefined
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

export default AdminFloatingDatePicker;
