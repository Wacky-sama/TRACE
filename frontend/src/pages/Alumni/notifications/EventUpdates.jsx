/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";  // Add for navigation
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../services/api";

const AlumniEventUpdates = ({ isDark }) => {
  const navigate = useNavigate();  // For redirecting to /alumni/events

  const [events, setEvents] = useState([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRes = await api.get("/events");
        setEvents(eventsRes.data);

        const statusRes = await api.get("/attendance/my-status");
        const statuses = {};
        statusRes.data.forEach((item) => {
          statuses[item.event_id] = item.status;
        });
        setAttendanceStatuses(statuses);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error(
          "Failed to load events or attendance status. Please refresh."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAttend = async (eventId) => {
    setLoadingActions((prev) => ({ ...prev, [eventId]: "attend" }));
    try {
      await api.post(`/attendance/${eventId}`);
      toast.success("Successfully registered for the event!");

      const qrRes = await api.post(`/attendance/${eventId}/accept`);
      const { qr_code } = qrRes.data;

      const link = document.createElement("a");
      link.href = `data:image/png;base64,${qr_code}`;
      link.download = `event-${eventId}-qr.png`;
      link.click();

      toast.success(
        "QR Code generated! You can scan it when the event starts."
      );

      setAttendanceStatuses((prev) => ({ ...prev, [eventId]: "registered" }));
    } catch (error) {
      console.error("Attend error:", error);
      toast.error(
        error.response?.data?.detail || "Failed to register for the event."
      );
    } finally {
      setLoadingActions((prev) => ({ ...prev, [eventId]: null }));
    }
  };

  const handleDecline = async (eventId) => {
    setLoadingActions((prev) => ({ ...prev, [eventId]: "decline" }));
    try {
      await api.post(`/attendance/${eventId}/decline`);
      toast.info("You have declined this event.");

      setAttendanceStatuses((prev) => ({ ...prev, [eventId]: "declined" }));
    } catch (error) {
      console.error("Decline error:", error);
      toast.error(
        error.response?.data?.detail || "Failed to decline the event."
      );
    } finally {
      setLoadingActions((prev) => ({ ...prev, [eventId]: null }));
    }
  };

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
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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

                {/* Added "View Event" button */}
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
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AlumniEventUpdates;
