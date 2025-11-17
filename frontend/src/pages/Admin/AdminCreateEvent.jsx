import { useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "../../utils/storage";
import api from "../../services/api";
import FloatingInput from "../../components/FloatingInput";
import FloatingSelect from "../../components/FloatingSelect";
import AdminFloatingDatePicker from "../../components/common/AdminFloatingDatePicker";
import { useTheme } from "../../hooks/useTheme"; 

const AdminCreateEvent = () => {
  const { theme } = useTheme();  
  const isDark = theme === "dark"; 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_date: null,
    start_time_startday: "",
    end_time_startday: "",
    end_date: null,
    start_time_endday: "",
    end_time_endday: "",
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const locationOptions = [
    "GYM",
    "Conference Hall",
    "Oval",
    "Admin Building",
    "Mabric Hall",
    "Other",
  ];

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value);
    setShowCustomLocation(value === "Other");
    const effectiveLocation = value === "Other" ? customLocation : value;
    setFormData({ ...formData, location: effectiveLocation });
  };

  const handleCustomLocationChange = (e) => {
    const value = e.target.value;
    setCustomLocation(value);
    setFormData({ ...formData, location: value });
  };

  const validate = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Event title is required";
    if (!formData.start_date) errors.start_date = "Start date is required";
    if (!formData.end_date) errors.end_date = "End date is required";

    if (!formData.start_time_startday)
      errors.start_time_startday = "Start time for start date is required";
    if (!formData.end_time_startday)
      errors.end_time_startday = "End time for start date is required";
    if (!formData.start_time_endday)
      errors.start_time_endday = "Start time for end date is required";
    if (!formData.end_time_endday)
      errors.end_time_endday = "End time for end date is required";

    if (selectedLocation === "Other" && !customLocation.trim()) {
      errors.location = "Please enter a custom location";
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_time_startday &&
      formData.end_time_endday &&
      new Date(`${formData.start_date}T${formData.start_time_startday}`) >
        new Date(`${formData.end_date}T${formData.end_time_endday}`)
    ) {
      errors.end_time_endday = "End time must be after start time";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post(
        "/events/create-event",
        {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          start_date: formData.start_date
            ? `${formData.start_date.getFullYear()}-${(formData.start_date.getMonth()+1)
                .toString().padStart(2,"0")}-${formData.start_date.getDate().toString().padStart(2,"0")}`
            : "",
          end_date: formData.end_date
            ? `${formData.end_date.getFullYear()}-${(formData.end_date.getMonth()+1)
                .toString().padStart(2,"0")}-${formData.end_date.getDate().toString().padStart(2,"0")}`
            : "",
          start_time_startday: formData.start_time_startday || null,
          end_time_startday: formData.end_time_startday || null,
          start_time_endday: formData.start_time_endday || null,
          end_time_endday: formData.end_time_endday || null,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      toast.success("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        start_date: null,
        end_date: null,
        start_time_startday: "",
        end_time_startday: "",
        start_time_endday: "",
        end_time_endday: "",
      });

      setSelectedLocation("");
      setCustomLocation("");
      setShowCustomLocation(false);
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } min-h-screen p-4 sm:p-6`}
    >
      <style>
        {`
          input[type="time"]::-webkit-calendar-picker-indicator {
            filter: ${isDark ? 'invert(1)' : 'invert(0)'};
          }
        `}
      </style>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <p className="mb-2 text-base font-semibold sm:mb-4 sm:text-lg">
            On this page, you can create events that alumni can view and attend.
          </p>
          <p className="text-xs sm:text-sm">
            Note: Make sure to provide accurate details for your event.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-4 sm:p-6 shadow-md rounded-lg`}
        >
          <h2
            className={`text-lg sm:text-xl font-semibold border-b pb-2 mb-4 ${
              isDark
                ? "text-gray-100 border-gray-700"
                : "text-gray-800 border-gray-200"
            }`}
          >
            Create Event
          </h2>

          {/* Title & Location */}
          <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2">
            <FloatingInput
              id="title"
              label="Event Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.title}
              darkMode={isDark}
            />

            <div className="space-y-3">
              <FloatingSelect
                id="location"
                label="Location"
                value={selectedLocation}
                onChange={handleLocationChange}
                options={locationOptions}
                error={errors.location}
                darkMode={isDark}
              />
              {showCustomLocation && (
                <FloatingInput
                  id="customLocation"
                  label="Custom Location"
                  value={customLocation}
                  onChange={handleCustomLocationChange}
                  error={errors.location}
                  darkMode={isDark}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className={`block mb-1 text-xs sm:text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your event..."
              rows={3}
              className={`w-full p-3 text-sm border rounded-md focus:outline-none focus:ring ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-200"
              }`}
            />
          </div>

          {/* Start Date Section */}
          <div className="mb-4">
            <h3
              className={`text-xs sm:text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Start Date and Times
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <AdminFloatingDatePicker
                id="start_date"
                label="Start Date"
                value={formData.start_date}
                onChange={(date) =>
                  setFormData({ ...formData, start_date: date })
                }
                error={errors.start_date}
                darkMode={isDark}
                showTimeSelect={false}
              />

              <FloatingInput
                id="start_time_startday"
                label="Start Time"
                type="time"
                value={formData.start_time_startday}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    start_time_startday: e.target.value,
                  })
                }
                error={errors.start_time_startday}
                darkMode={isDark}
              />

              <FloatingInput
                id="end_time_startday"
                label="End Time (Same Day)"
                type="time"
                value={formData.end_time_startday || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    end_time_startday: e.target.value,
                  })
                }
                error={errors.end_time_startday}
                darkMode={isDark}
              />
            </div>
          </div>

          {/* End Date Section */}
          <div className="mb-4">
            <h3
              className={`text-xs sm:text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              End Date and Times
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <AdminFloatingDatePicker
                id="end_date"
                label="End Date"
                value={formData.end_date}
                onChange={(date) =>
                  setFormData({ ...formData, end_date: date })
                }
                error={errors.end_date}
                darkMode={isDark}
                showTimeSelect={false}
              />

              <FloatingInput
                id="start_time_endday"
                label="Start Time (End Day)"
                type="time"
                value={formData.start_time_endday || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    start_time_endday: e.target.value,
                  })
                }
                error={errors.start_time_endday}
                darkMode={isDark}
              />

              <FloatingInput
                id="end_time_endday"
                label="End Time (End Day)"
                type="time"
                value={formData.end_time_endday || ""}
                onChange={(e) =>
                  setFormData({ ...formData, end_time_endday: e.target.value })
                }
                error={errors.end_time_endday}
                darkMode={isDark}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 mt-4 font-medium text-sm sm:text-base text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateEvent;