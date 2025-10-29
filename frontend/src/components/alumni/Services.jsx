// F. SERVICES FROM CSU
import { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import FloatingInput from "../FloatingInput";

const Services = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    desired_services: gtsData.desired_services || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await onUpdate("services", gtsData.id, formData);
    setSaving(false);
    setSaveSuccess(result.success);
    setMessage(result.success ? "Saved successfully!" : "Update failed.");
  };

  return (
    <div
      className={`p-4 rounded-lg shadow transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2
        className={`mb-4 text-xl font-semibold ${
          isDark ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Services from CSU
      </h2>

      <FloatingInput
        id="desired_services"
        type="text"
        label="List down services you want to avail from the university"
        value={formData.desired_services}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded-md transition-colors ${
            saving
              ? "opacity-70 cursor-not-allowed"
              : isDark
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-2 text-sm ${
            saveSuccess
              ? isDark
                ? "text-green-400"
                : "text-green-600"
              : isDark
              ? "text-red-400"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Services;
