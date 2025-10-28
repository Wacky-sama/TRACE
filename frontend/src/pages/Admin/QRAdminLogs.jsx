import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const QRAdminLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/checkin/logs");
        setLogs(res.data);
      } catch {
        toast.error("Failed to load check-in logs.");
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Check-In Logs</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b dark:border-gray-600">
            <th className="p-2">Name</th>
            <th className="p-2">Event</th>
            <th className="p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.length ? (
            logs.map((log) => (
              <tr key={log.id} className="border-b dark:border-gray-700">
                <td className="p-2">{log.userName}</td>
                <td className="p-2">{log.eventName}</td>
                <td className="p-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No check-ins recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QRAdminLogs;
