/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";
import { Download, FileText, Table, Calendar, Users, ClipboardList } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useTheme } from "../../hooks/useTheme";

const AdminReports = () => {
  const { theme } = useTheme();  
  const isDark = theme === "dark";
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (type, format = "pdf") => {
    setDownloading(`${type}-${format}`);
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
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    { 
      key: "alumni", 
      label: "Alumni Summary",
      icon: Users,
      description: "Comprehensive alumni database export",
      color: "blue"
    },
    { 
      key: "events", 
      label: "Event Attendance",
      icon: Calendar,
      description: "Event participation and RSVP data",
      color: "purple"
    },
    { 
      key: "gts", 
      label: "Graduate Tracer Study",
      icon: ClipboardList,
      description: "Employment and feedback responses",
      color: "green"
    },
  ];

  const getColorClasses = (color, type = "button") => {
    const colors = {
      blue: type === "button" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500/10 text-blue-400 border-blue-500/30",
      purple: type === "button" ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500/10 text-purple-400 border-purple-500/30",
      green: type === "button" ? "bg-green-600 hover:bg-green-700" : "bg-green-500/10 text-green-400 border-green-500/30",
    };
    return colors[color];
  };

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              Admin Reports
            </h1>
            <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Generate and export system reports for analysis and record-keeping
            </p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {reports.map((report, index) => {
              const Icon = report.icon;
              const isDownloadingPdf = downloading === `${report.key}-pdf`;
              const isDownloadingCsv = downloading === `${report.key}-csv`;
              
              return (
                <motion.div
                  key={report.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`rounded-xl shadow-xl overflow-hidden border transition-all ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-lg ${getColorClasses(report.color, "icon")} flex items-center justify-center mb-4 border`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {report.label}
                    </h3>
                    <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {report.description}
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => handleDownload(report.key, "pdf")}
                        disabled={isDownloadingPdf}
                        className={`w-full px-4 py-3 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                          isDownloadingPdf 
                            ? "bg-gray-600 cursor-not-allowed" 
                            : "bg-red-600 hover:bg-red-700 active:scale-95"
                        }`}
                      >
                        {isDownloadingPdf ? (
                          <>
                            <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            Download PDF
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDownload(report.key, "csv")}
                        disabled={isDownloadingCsv}
                        className={`w-full px-4 py-3 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                          isDownloadingCsv 
                            ? "bg-gray-600 cursor-not-allowed" 
                            : "bg-green-600 hover:bg-green-700 active:scale-95"
                        }`}
                      >
                        {isDownloadingCsv ? (
                          <>
                            <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Table className="w-4 h-4" />
                            Download CSV
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`mt-8 rounded-xl p-6 border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <Download className={`w-5 h-5 mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <div>
                <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Export Formats
                </h4>
                <div className={`text-sm space-y-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <p>
                    <strong className={isDark ? "text-gray-300" : "text-gray-800"}>PDF:</strong> Best for official documentation, printing, and sharing formatted reports
                  </p>
                  <p>
                    <strong className={isDark ? "text-gray-300" : "text-gray-800"}>CSV:</strong> Perfect for data analysis in Excel, Google Sheets, or further processing
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;