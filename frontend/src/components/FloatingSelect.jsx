import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function FloatingSelect({ id, value, onChange, label, options = [], placeholder = "Select an option", error }) {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="mb-2">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          {/* Label */}
          <label
            htmlFor={id}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left pointer-events-none
              peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500
              peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-600"
          >
            {label}
          </label>

          {/* Button */}
          <Listbox.Button
            className={`relative w-full py-3 pl-3 pr-10 text-sm text-left rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300
              ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} border`}
          >
            <span className={`block truncate ${!value ? (isDark ? "text-gray-400" : "text-gray-400") : ""}`}>
              {value || placeholder}
            </span>
            <span className="absolute inset-y-0 flex items-center pointer-events-none right-3">
              <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
            </span>
          </Listbox.Button>

          {/* Options */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`absolute z-10 w-full py-1 mt-1 overflow-auto text-base rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-300
                ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
            >
              {options.map((opt, idx) => (
                <Listbox.Option
                  key={idx}
                  value={opt}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active
                        ? isDark
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-900"
                        : isDark
                        ? "text-white"
                        : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {opt}
                      </span>
                      {selected && (
                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? "text-white" : "text-blue-600"}`}>
                          <CheckIcon className="w-5 h-5" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingSelect;
