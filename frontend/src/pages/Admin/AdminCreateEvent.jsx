import { getToken } from "../../utils/storage";
import { useState } from "react";
import api from "../../services/api";
import FloatingInput from "../../components/FloatingInput";
import FloatingSelect from "../../components/FloatingSelect";
import AdminFloatingDatePicker from "../../components/AdminFloatingDatePicker";

const AdminCreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const validateErrors = {};
    if (!formData.title.trim()) validateErrors.title = "Title is required";
    if (!formData.location) validateErrors.location = "Location is required";
    if (!formData.event_date)
      validateErrors.event_date = "Event date is required";
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
          ...formData,
          event_date: formData.event_date
            ? formData.event_date.toISOString().split("T")[0] // Convert to YYYY-MM-DD
            : "",
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setMessage("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        event_date: "",
      });
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <p className="text-lg font-semibold mb-4">
          On this page, you can create events that alumni can view and register
          for.
        </p>
        <p className="text-sm mb-6">
          Note: Make sure to provide accurate details for your event.
        </p>
      </div>

      <div className="space-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Create Event
          </h2>

          <div className="space-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatingInput
                id="title"
                label="Event Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={errors.title}
              />

              <FloatingSelect
                id="location"
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                error={errors.location}
                options={[
                  "GYM",
                  "Conference Hall",
                  "Oval",
                  "Admin Building",
                  "Mabric Hall",
                ]}
                placeholder="Select Location"
              />
            </div>
          </div>

          <div className="space-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your event..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mt-2">
            <AdminFloatingDatePicker
              id="event_date"
              value={formData.event_date}
              onChange={(date) =>
                setFormData({ ...formData, event_date: date })
              }
              label="Event Date"
              error={errors.event_date}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>

          {message && (
            <p
              className={`text-center text-sm mt-2 ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default AdminCreateEvent;
