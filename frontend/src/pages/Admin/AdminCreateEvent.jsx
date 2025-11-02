import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getToken } from "../../utils/storage";
import api from "../../services/api";
import FloatingInput from "../../components/FloatingInput";
import FloatingSelect from "../../components/FloatingSelect";
import AdminFloatingDateTimePicker from "../../components/common/AdminFloatingDateTimePicker";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const AdminCreateEvent = () => {
  const isDark = useDarkMode();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_datetime: null,
    end_datetime: null,
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
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
    const validateErrors = {};

    if (!formData.title.trim()) validateErrors.title = "Title is required";
    if (!formData.location.trim())
      validateErrors.location = "Location is required";
    if (!formData.start_datetime)
      validateErrors.start_datetime = "Start date/time is required";
    if (!formData.end_datetime)
      validateErrors.end_datetime = "End date/time is required";
    if (
      formData.start_datetime &&
      formData.end_datetime &&
      formData.start_datetime > formData.end_datetime
    ) {
      validateErrors.end_datetime = "End datetime must be after start datetime";
    }

    setErrors(validateErrors);
    return Object.keys(validateErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post(
        "/events/",
        {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          start_date: formData.start_datetime?.toISOString().split("T")[0],
          end_date: formData.end_datetime?.toISOString().split("T")[0],
          start_time: formData.start_datetime
            ? formData.start_datetime.toISOString().split("T")[1].slice(0, 8)
            : null, 
          end_time: formData.end_datetime
            ? formData.end_datetime.toISOString().split("T")[1].slice(0, 8)
            : null,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      toast.success("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        start_datetime: null,
        end_datetime: null,
      });
      setSelectedLocation("");
      setCustomLocation("");
      setShowCustomLocation(false);
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } min-h-screen p-6`}
    >
      <div>
        <p className="mb-4 text-lg font-semibold">
          On this page, you can create events that alumni can view and attend
          for.
        </p>
        <p className="mb-6 text-sm">
          Note: Make sure to provide accurate details for your event.
        </p>

        <form
          onSubmit={handleSubmit}
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 shadow-md rounded-lg`}
        >
          <h2
            className={`text-xl font-semibold border-b pb-2 mb-4 ${
              isDark
                ? "text-gray-100 border-gray-700"
                : "text-gray-800 border-gray-200"
            }`}
          >
            Create Event
          </h2>

          <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-2">
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

            <div>
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

          <div className="mb-4">
            <label
              htmlFor="description"
              className={`block mb-1 text-sm font-medium ${
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
                  ? "border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500"
                  : "border-gray-300 bg-white text-gray-900 focus:ring-blue-200"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-2">
            <AdminFloatingDateTimePicker
              id="start_datetime"
              label="Start Date & Time"
              value={formData.start_datetime}
              onChange={(datetime) =>
                setFormData({ ...formData, start_datetime: datetime })
              }
              error={errors.start_datetime}
              darkMode={isDark}
            />

            <AdminFloatingDateTimePicker
              id="end_datetime"
              label="End Date & Time"
              value={formData.end_datetime}
              onChange={(datetime) =>
                setFormData({ ...formData, end_datetime: datetime })
              }
              error={errors.end_datetime}
              darkMode={isDark}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>

          {message && (
            <p className="mt-2 text-sm text-center text-green-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminCreateEvent;
