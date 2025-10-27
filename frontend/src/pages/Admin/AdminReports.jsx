/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  return isDark;
}

const AdminReports = () => {
  const isDark = useDarkMode();
  const [status, setStatus] = useState("");

  const handleDownload = async (type, format = "pdf") => {
    const toastId = toast.loading(`Generating ${type} report...`);
    try {
      const res = await api.get(`/admin/reports/${type}?format=${format}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`${type} report downloaded successfully.`, {
        id: toastId,
      });
    } catch (error) {
      console.error(error);
      toast.error(`Failed to generate ${type} report.`, { id: toastId });
    }
  };

  return (
    <div
      className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Reports
            </h1>
            <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Generate and download system reports for record-keeping and
              analysis.
            </p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`p-6 rounded-xl shadow-md transition-colors ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h3 className="mb-6 text-2xl font-semibold">Available Reports</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: "alumni", label: "Alumni Summary" },
                { key: "events", label: "Event Attendance" },
                { key: "gts", label: "Graduate Tracer Study" },
              ].map((r) => (
                <div
                  key={r.key}
                  className="flex flex-col items-center p-4 border rounded-lg border-gray-700/20"
                >
                  <p className="mb-3 text-lg font-medium">{r.label}</p>
                  <div className="space-x-3">
                    <button
                      onClick={() => handleDownload(r.key, "pdf")}
                      className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownload(r.key, "csv")}
                      className="px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      CSV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
