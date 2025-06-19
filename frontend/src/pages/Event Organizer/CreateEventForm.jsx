import { useState } from 'react';
import api from '../../services/api';

const CreateEventForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = "Title is required";
    if (!form.location) errs.location = "Location is required";
    if (!form.event_date) errs.event_date = "Event date is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await api.post('/events', form);
      setMessage("Event created successfully!");
      setForm({ title: '', description: '', location: '', event_date: '' });
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-xl font-semibold mb-4">Create Event</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description (optional)"
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
        rows={3}
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />
      {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

      <input
        name="event_date"
        type="date"
        value={form.event_date}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />
      {errors.event_date && <p className="text-red-500 text-sm">{errors.event_date}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Event"}
      </button>

      {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
    </form>
  );
};

export default CreateEventForm;
