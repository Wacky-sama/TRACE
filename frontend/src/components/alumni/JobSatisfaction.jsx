// E. JOB SATISFACTION
import { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

const SATISFACTION_LEVELS = ["Very High", "High", "Moderate", "Low", "Very Low"];

const JobSatisfaction = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    job_satisfaction: gtsData.job_satisfaction || "",
    job_satisfaction_reason: gtsData.job_satisfaction_reason || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, job_satisfaction: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    const result = await onUpdate("job-satisfaction", gtsData.id, formData);
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
        Job Satisfaction
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
        <div>
          <FloatingSelect
            id="job_satisfaction"
            value={formData.job_satisfaction}
            label="How would you rate your overall job satisfaction?"
            onChange={handleSelectChange}
            options={SATISFACTION_LEVELS}
          />
        </div>

        <div>
          <FloatingInput
            id="job_satisfaction_reason"
            type="text"
            label="Why? (Reason for your answer)"
            value={formData.job_satisfaction_reason}
            onChange={handleChange}
          />
        </div>
      </div>

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

export default JobSatisfaction;
