import { useEffect, useState } from 'react';
import { getToken } from '../../utils/storage';
import api from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const AdminEvents = () => {
  const [editForm, setEditForm] = useState({
  title: '',
  description: '',
  location: '',
  event_date: '',
  });

  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  const validate = () => {
    const validateErrors = {};
    if (!editForm.title) validateErrors.title = "Title is required";
    if (!editForm.location) validateErrors.location = "Location is required";
    if (!editForm.event_date) validateErrors.event_date = "Event date is required";
    return validateErrors;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
        alert('Backend might be on coffee break ☕');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this event?")) return;

  try {
    await api.delete(`/events/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    setEvents(events.filter(event => event.id !== id));
    alert("Event deleted successfully!");
  } catch (error) {
    console.error("Failed to delete event", error);
    alert("Failed to delete event.");
  }
};

const handleEdit = (eventData) => {
  setEditingEvent(eventData);
  setEditForm({
    title: eventData.title,
    description: eventData.description || '',
    location: eventData.location || '',
    event_date: eventData.event_date,
  });
};

const handleEditSubmit = async (e) => {
  e.preventDefault();

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    return;
  }

  try {
    await api.put(`/events/${editingEvent.id}`, editForm, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    alert("Event updated successfully!");
    setEditingEvent(null);
    setErrors({});
    const res = await api.get('/events', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setEvents(res.data);
  } catch (error) {
    console.error("Failed to update event", error);
    alert("Failed to update event.");
  }
};

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Events</h2>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="text-sm text-left text-gray-700 bg-gray-100">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Location</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {events.length ? (
              events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">{event.description || '-'}</td>
                  <td className="p-3">{event.event_date}</td>
                  <td className="flex gap-3 p-3">
                    <button title="Edit" onClick={() => handleEdit(event)} className="text-yellow-500 hover:text-yellow-600">
                      <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                    </button>
                    <button title="Delete" onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-600">
                      <FontAwesomeIcon icon={faTrash} size="lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingEvent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <form
      onSubmit={handleEditSubmit}
      className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg"
    >
      <h2 className="text-xl font-semibold">Edit Event</h2>

      <input
        name="title"
        value={editForm.title}
        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
        className="w-full p-3 border rounded"
      />

      <textarea
        name="description"
        value={editForm.description}
        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
        className="w-full p-3 border rounded"
      />

      <select
        name="location"
        value={editForm.location}
        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
        className="w-full p-3 text-sm border border-gray-300 rounded-md"
      >
        <option value="">Select a location</option>
        <option value="GYM">GYM</option>
        <option value="Conference Hall">Conference Hall</option>
        <option value="Oval">Oval</option>
        <option value="Admin Building">Admin Building</option>
        <option value="Mabric Hall">Mabric Hall</option>
      </select>

      {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}

      <input
        type="date"
        name="event_date"
        value={editForm.event_date}
        onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })}
        className="w-full p-3 border rounded"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEditingEvent(null)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded"
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