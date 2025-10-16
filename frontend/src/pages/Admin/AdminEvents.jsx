import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import { getToken } from "../../utils/storage";
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
    event_date: "",
  });
  const [errors, setErrors] = useState({});

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Backend might be on a coffee break ☕");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const validate = () => {
    const validationErrors = {};
    if (!editForm.title) validationErrors.title = "Title is required";
    if (!editForm.location) validationErrors.location = "Location is required";
    if (!editForm.event_date)
      validationErrors.event_date = "Event date is required";
    return validationErrors;
  };

  const handleEdit = (eventData) => {
    setEditingEvent(eventData);
    setEditForm({
      title: eventData.title,
      description: eventData.description || "",
      location: eventData.location || "",
      event_date: eventData.event_date,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.put(`/events/${editingEvent.id}`, editForm, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Event updated successfully!");
      setEditingEvent(null);
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

  const renderTable = (data) => (
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
          {["Title", 
          "Location", 
          "Description", 
          "Date", 
          "Actions"
        ].map(
            (header) => (
              <th key={header} className="p-3">
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="text-sm">
        {data.length ? (
          data.map((event) => (
            <tr
              key={event.id}
              className={`border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <td className="p-3">{event.title}</td>
              <td className="p-3">{event.location}</td>
              <td className="p-3">{event.description || "-"}</td>
              <td className="p-3">{event.event_date}</td>
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
          ))
        ) : (
          <tr>
            <td
              colSpan="5"
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
  );

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } min-h-screen p-6`}
    >
      <h2 className="mb-4 text-2xl font-bold">Events</h2>
      {renderTable(events)}

      <div className="mt-4 mb-6 border-t"></div>

      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleEditSubmit}
            className={`w-full max-w-md p-6 space-y-4 rounded-lg shadow-lg transition-colors ${
              isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-semibold">Edit Event</h2>

            <input
              name="title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              placeholder="Event Title"
              className={`w-full p-3 border rounded ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}

            <textarea
              name="description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Description"
              className={`w-full p-3 border rounded ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />

            <select
              name="location"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
              className={`w-full p-3 border rounded ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">Select a location</option>
              <option value="GYM">GYM</option>
              <option value="Conference Hall">Conference Hall</option>
              <option value="Oval">Oval</option>
              <option value="Admin Building">Admin Building</option>
              <option value="Mabric Hall">Mabric Hall</option>
            </select>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}

            <input
              type="date"
              name="event_date"
              value={editForm.event_date}
              onChange={(e) =>
                setEditForm({ ...editForm, event_date: e.target.value })
              }
              className={`w-full p-3 border rounded ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
            {errors.event_date && (
              <p className="text-sm text-red-500">{errors.event_date}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className={`px-4 py-2 rounded ${
                  isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded ${
                  isDark
                    ? "bg-blue-700 hover:bg-blue-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
