import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeProvider";

const AlumniEvents = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  if (loading) {
    return (
      <div
        className={`min-h-screen p-6 ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-b-2 border-gray-600 rounded-full animate-spin"></div>
          <p className="ml-2">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h2 className="mb-4 text-2xl font-bold">Events</h2>
      <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        Browse upcoming events and attend.
      </p>
      <div
        className={`mt-4 mb-6 border-t ${
          isDark ? "border-gray-700" : "border-gray-300"
        }`}
      ></div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => {
            const status = attendanceStatuses[event.id];
            const isAttending = status === "registered";
            const isDeclined = status === "declined";
            const isLoadingAttend = loadingActions[event.id] === "attend";
            const isLoadingDecline = loadingActions[event.id] === "decline";

            return (
              <div
                key={event.id}
                className={`p-4 rounded-lg shadow transition-all ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-750 text-gray-200"
                    : "bg-white hover:bg-gray-50 text-gray-900"
                }`}
              >
                <h3 className="mb-1 text-lg font-semibold">{event.title}</h3>
                <p className="mb-2 text-sm">
                  <strong>Description:</strong>
                  {event.description || "No description provided."}
                </p>

                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Location:</strong>
                    {event.location}
                  </p>
                  <p>
                    <strong>Start:</strong> {formatDate(event.start_date)} —{" "}
                    {formatTime(event.start_time_startday)} —{" "}
                    {formatTime(event.start_time_endday)}
                  </p>

                  <p>
                    <strong>End:</strong> {formatDate(event.end_date)} —{" "}
                    {formatTime(event.end_time_endday)} —{" "}
                    {formatTime(event.end_time_startday)}
                  </p>

                  <p>
                    <strong>Created By:</strong> {event.created_by_name}
                  </p>
                </div>

                {status && (
                  <p
                    className={`mt-3 text-sm font-medium ${
                      isDeclined ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  {!isAttending && !isDeclined && (
                    <>
                      <button
                        onClick={() => handleAttend(event.id)}
                        disabled={isLoadingAttend || isLoadingDecline}
                        className={`px-4 py-2 text-white rounded transition-colors ${
                          isLoadingAttend
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isLoadingAttend ? (
                          <>
                            <div className="inline-block w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                            Attending...
                          </>
                        ) : (
                          "Attend"
                        )}
                      </button>

                      <button
                        onClick={() => handleDecline(event.id)}
                        disabled={isLoadingAttend || isLoadingDecline}
                        className={`px-4 py-2 text-white rounded transition-colors ${
                          isLoadingDecline
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {isLoadingDecline ? (
                          <>
                            <div className="inline-block w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                            Declining...
                          </>
                        ) : (
                          "Cannot Attend"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
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
