import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Events</h2>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-gray-100 text-left text-sm text-gray-700">
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
                  <td className="p-3 flex gap-3">
                    <button title="Edit" className="text-yellow-500 hover:text-yellow-600">
                      <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                    </button>
                    <button title="Delete" className="text-red-500 hover:text-red-600">
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
    </div>
  );
};

export default AdminEvents;