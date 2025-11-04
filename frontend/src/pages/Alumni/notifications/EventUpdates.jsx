/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../services/api";

const AlumniEventUpdates = ({ notifications, loading, markAsRead, isDark }) => {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);  // Separate loading for events

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch approved events:", error);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();

    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="space-y-4">
      {eventsLoading ? (
        <div
          className={`p-6 rounded-lg shadow ${
            isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
          }`}
        >
          Loading events...
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
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-5 rounded-lg shadow transition-colors ${
                isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
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
                {event.description || "No description available."}
              </p>
              <p
                className={`text-xs mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Date: {event.date ? new Date(event.date).toLocaleDateString() : "TBD"}
              </p>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Location: {event.location || "TBD"}
              </p>
              {/* Optional: Add a button for more actions, e.g., "View Details" */}
              {/* <button className="mt-2 text-blue-500 hover:underline">View Details</button> */}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AlumniEventUpdates;
