import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../services/api";

const AlumniEventUpdates = ({ isDark }) => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRes = await api.get("/events");
        setEvents(eventsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load events. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    try {
      const [h, m, s] = timeStr.split(":");
      const d = new Date();
      d.setHours(h, m, s || 0);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <section className="space-y-4">
      {loading ? (
        <div
          className={`p-6 rounded-lg shadow ${
            isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-b-2 border-gray-600 rounded-full animate-spin"></div>
            <p className="ml-2">Loading events...</p>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div
          className={`p-6 rounded-lg shadow ${
            isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
          }`}
        >
          No events available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            return (
              <div
                key={event.id}
                className={`p-5 rounded-lg shadow transition-colors ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-750 text-gray-200"
                    : "bg-white hover:bg-gray-50 text-gray-900"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {event.title}
                </h3>
                <p
                  className={`text-sm mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <strong>Description:</strong>{" "}
                  {event.description || "No description provided."}
                </p>

                <div className="space-y-1 text-sm">
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <strong>Start:</strong> {formatDate(event.start_date)} —{" "}
                    {formatTime(event.start_time_startday)} —{" "}
                    {formatTime(event.start_time_endday)}
                  </p>
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <strong>End:</strong> {formatDate(event.end_date)} —{" "}
                    {formatTime(event.end_time_endday)} —{" "}
                    {formatTime(event.end_time_startday)}
                  </p>
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <strong>Created By:</strong> {event.created_by_name}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate("/alumni/events")}
                    className={`px-4 py-2 text-sm font-medium text-white rounded transition-colors ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    View Event
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AlumniEventUpdates;
