import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

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
    setStatus(`Generating ${type} report...`);
    try {
      const res = await api.get(`/admin/reports/${type}?format=${format}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus(`✅ ${type} report downloaded successfully.`);
    } catch (error) {
      console.error(error);
      setStatus(`❌ Failed to generate ${type} report.`);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <header className="mb-6">
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Admin Reports
            </h1>
            <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Generate and download system reports for record-keeping and analysis.
            </p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`p-6 rounded-xl shadow-md transition-colors ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
          >
            <h3 className="text-2xl font-semibold mb-6">Available Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: "alumni", label: "Alumni Summary" },
                { key: "events", label: "Event Attendance" },
                { key: "gts", label: "Graduate Tracer Study" },
              ].map((r) => (
                <div key={r.key} className="flex flex-col items-center p-4 rounded-lg border border-gray-700/20">
                  <p className="mb-3 text-lg font-medium">{r.label}</p>
                  <div className="space-x-3">
                    <button
                      onClick={() => handleDownload(r.key, "pdf")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownload(r.key, "csv")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                    >
                      CSV
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {status && (
              <p className={`mt-6 text-center ${status.includes("✅") ? "text-green-500" : "text-red-400"}`}>
                {status}
              </p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
