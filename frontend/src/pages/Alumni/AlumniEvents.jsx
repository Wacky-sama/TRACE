import { useEffect, useState } from 'react';
import api from '../../services/api';

const AlumniEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            alert('Backend might be on coffee break ☕');
        } finally {
            setLoading(false);
        }
    };

    fetchEvents();
  }, []);

    if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? events.map(event => (
          <div key={event.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{event.description || "No description"}</p>
            <p className="text-sm"><strong>Location:</strong> {event.location}</p>
            <p className="text-sm"><strong>Date:</strong> {event.event_date}</p>
            <p className="text-sm"><strong>Created By:</strong> {event.created_by_name}</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Attend
            </button>
          </div>
        )) : (
          <p className="text-gray-500">No events available.</p>
        )}
      </div>
    </>
  );
};

export default AlumniEvents;
