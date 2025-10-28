import { useState } from "react";
import QRCode from "qrcode.react";
import toast from "react-hot-toast";
import api from "../../services/api";

const AdminQRGenerator = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [qrValue, setQrValue] = useState("");

  // Fetch events (you can trigger this via useEffect)
  useState(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch {
        toast.error("Failed to load events.");
      }
    };
    fetchEvents();
  }, []);

  const handleGenerateQR = () => {
    if (!selectedEvent) {
      toast.error("Please select an event first.");
      return;
    }

    // Generate QR payload (could include user or event info)
    const qrPayload = JSON.stringify({
      eventId: selectedEvent,
      timestamp: Date.now(),
    });

    setQrValue(qrPayload);
    toast.success("QR code generated!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">QR Code Generator</h2>

      <div className="space-y-4">
        <label className="block mb-2 font-medium">Select Event</label>
        <select
          className="w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">-- Choose an event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleGenerateQR}
          className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Generate QR Code
        </button>

        {qrValue && (
          <div className="flex flex-col items-center mt-6 space-y-2">
            <QRCode value={qrValue} size={200} />
            <p className="text-gray-600 dark:text-gray-300 break-all text-center mt-2">
              {qrValue}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQRGenerator;
