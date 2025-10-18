import { useEffect, useState } from "react";
import api from "../../services/api";

const AlumniEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        alert("Backend might be on coffee break");
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">Events</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">
                {event.title}
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                {event.description || "No description"}
              </p>
              <p className="text-sm">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="text-sm">
                <strong>Date:</strong> {event.event_date}
              </p>
              <p className="text-sm">
                <strong>Created By:</strong> {event.created_by_name}
              </p>
              <button className="px-4 py-2 mt-4 text-white transition-colors bg-green-600 rounded hover:bg-green-700">
                Attend
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No events available.</p>
        )}
      </div>
    </>
  );
};

export default AlumniEvents;
