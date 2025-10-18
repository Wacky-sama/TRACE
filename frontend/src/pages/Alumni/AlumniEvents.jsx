import { useEffect, useState } from "react";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeProvider";

const AlumniEvents = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <p className={`p-4 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
        Loading...
      </p>
    );

  return (
      <div
        className={`${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        } min-h-screen p-6`}
      >
        <h2 className="mb-4 text-2xl font-bold">Events</h2>
        <div
          className={`mt-4 mb-6 border-t ${
            isDark ? "border-gray-700" : "border-gray-300"
          }`}
        ></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg shadow ${
                  isDark
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-900"
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {event.title}
                </h3>
                <p
                  className={`mb-2 text-sm ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
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
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 text-white transition-colors bg-green-600 rounded hover:bg-green-700">
                    Attend
                  </button>
                  <button className="px-4 py-2 text-white transition-colors bg-red-600 rounded hover:bg-red-700">
                    Cannot Attend
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={`text-gray-500 ${isDark ? "text-gray-400" : ""}`}>
              No events available.
            </p>
          )}
        </div>
      </div>
  );
};

export default AlumniEvents;
