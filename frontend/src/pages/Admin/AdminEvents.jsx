import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import { getToken } from "../../utils/storage";
import FloatingInput from "../../components/FloatingInput";
import FloatingSelect from "../../components/FloatingSelect";
import AdminFloatingDatePicker from "../../components/common/AdminFloatingDateTimePicker";
import { useTheme } from "../../context/ThemeProvider";

const AdminEvents = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    start_date: null,
    end_date: null,
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [showCustomLocation, setShowCustomLocation] = useState(false);

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const locationOptions = [
    "GYM",
    "Conference Hall",
    "Oval",
    "Admin Building",
    "Mabric Hall",
    "Other",
  ];

  const validate = () => {
    const validateErrors = {};
    if (!editForm.title.trim()) validateErrors.title = "Title is required";
    if (!editForm.location.trim())
      validateErrors.location = "Location is required";
    if (!editForm.start_date)
      validateErrors.start_date = "Start date is required";
    if (!editForm.end_date) validateErrors.end_date = "End date is required";
    if (
      editForm.start_date &&
      editForm.end_date &&
      editForm.start_date > editForm.end_date
    ) {
      validateErrors.end_date = "End date must be on or after start date";
    }
    setErrors(validateErrors);
    return Object.keys(validateErrors).length === 0;
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Backend might be on a coffee break.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (eventData) => {
    setEditingEvent(eventData);
    setEditForm({
      title: eventData.title,
      description: eventData.description || "",
      location: eventData.location || "",
      start_date: new Date(eventData.start_date),
      end_date: new Date(eventData.end_date),
    });

    const isOther = !locationOptions.slice(0, -1).includes(eventData.location);
    setSelectedLocation(isOther ? "Other" : eventData.location);
    setCustomLocation(isOther ? eventData.location : "");
    setShowCustomLocation(isOther);
    setErrors({});
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value);
    setShowCustomLocation(value === "Other");
    const effectiveLocation = value === "Other" ? customLocation : value;
    setEditForm({ ...editForm, location: effectiveLocation });
  };

  const handleCustomLocationChange = (e) => {
    const value = e.target.value;
    setCustomLocation(value);
    setEditForm({ ...editForm, location: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.put(
        `/events/${editingEvent.id}`,
        {
          ...editForm,
          start_date: editForm.start_date
            ? editForm.start_date.toISOString().split("T")[0]
            : "",
          end_date: editForm.end_date
            ? editForm.end_date.toISOString().split("T")[0]
            : "",
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      toast.success("Event updated successfully!");
      setEditingEvent(null);
      setSelectedLocation("");
      setCustomLocation("");
      setShowCustomLocation(false);
      setErrors({});
      await fetchEvents();
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setEvents(events.filter((event) => event.id !== id));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event.");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } min-h-screen p-6`}
    >
      <h2 className="mb-4 text-2xl font-bold">Events</h2>
      <p className="mb-4 text-lg font-semibold">
        On this page, you can manage events that alumni can view and register
        for.
      </p>
      <p className="mb-6 text-sm">
        You can edit or delete existing events below.
      </p>
      <div className="flex items-center justify-end mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search Event"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`border rounded px-3 py-1 ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={isDark ? "text-gray-300" : "text-gray-600"}
        />
      </div>
      {/* Border */}
      <div className="mb-6 border-t"></div>

      <table
  className={`min-w-full border rounded-lg shadow transition-colors duration-300 ${
    isDark
      ? "bg-gray-800 border-gray-700 text-gray-200"
      : "bg-white border-gray-200 text-gray-900"
  }`}
>
  <thead
    className={`${
      isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"
    }`}
  >
    <tr>
      {[
        "Title",
        "Location",
        "Description",
        "Start Date",
        "Start Time",
        "End Date",
        "End Time",
        "Actions",
      ].map((header) => (
        <th key={header} className="p-3 text-left align-middle">
          {header}
        </th>
      ))}
    </tr>
  </thead>
  <tbody className="text-sm">
    {events
      .filter((event) =>
        `${event.title} ${event.location} ${event.description || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .map((event) => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const formattedStartDate = startDate.toLocaleDateString();
        const formattedStartTime = startDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedEndDate = endDate.toLocaleDateString();
        const formattedEndTime = endDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <tr
            key={event.id}
            className={`border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <td className="p-3">{event.title}</td>
            <td className="p-3">{event.location}</td>
            <td className="p-3">{event.description || "-"}</td>
            <td className="p-3">{formattedStartDate}</td>
            <td className="p-3">{formattedStartTime}</td>
            <td className="p-3">{formattedEndDate}</td>
            <td className="p-3">{formattedEndTime}</td>
            <td className="flex gap-3 p-3">
              <button
                title="Edit"
                onClick={() => handleEdit(event)}
                className="text-yellow-500 hover:text-yellow-600"
              >
                <FontAwesomeIcon icon={faPenToSquare} size="lg" />
              </button>
              <button
                title="Delete"
                onClick={() => handleDelete(event.id)}
                className="text-red-500 hover:text-red-600"
              >
                <FontAwesomeIcon icon={faTrash} size="lg" />
              </button>
            </td>
          </tr>
        );
      })}
    {events.filter((event) =>
      `${event.title} ${event.location} ${event.description || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ).length === 0 && (
      <tr>
        <td
          colSpan="8"
          className={`p-4 text-center ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No events found.
        </td>
      </tr>
    )}
  </tbody>
</table>


      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleEditSubmit}
            className={`w-full max-w-md p-6 rounded-lg shadow-lg transition-colors ${
              isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
            }`}
          >
            <h2
              className={`text-xl font-semibold border-b pb-2 mb-4 ${
                isDark
                  ? "text-gray-100 border-gray-700"
                  : "text-gray-800 border-gray-200"
              }`}
            >
              Edit Event
            </h2>

            <div className="grid grid-cols-1 gap-3 mb-4">
              <FloatingInput
                id="title"
                label="Event Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
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
                    className="mt-2"
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
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
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

            <div className="grid grid-cols-1 gap-3 mb-4">
              <AdminFloatingDatePicker
                id="start_date"
                label="Start Date"
                value={editForm.start_date}
                onChange={(date) =>
                  setEditForm({ ...editForm, start_date: date })
                }
                error={errors.start_date}
                darkMode={isDark}
              />

              <AdminFloatingDatePicker
                id="end_date"
                label="End Date"
                value={editForm.end_date}
                onChange={(date) =>
                  setEditForm({ ...editForm, end_date: date })
                }
                error={errors.end_date}
                darkMode={isDark}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setSelectedLocation("");
                  setCustomLocation("");
                  setShowCustomLocation(false);
                }}
                className={`px-4 py-2 rounded ${
                  isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
