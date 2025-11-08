// G. PROBLEMS, ISSUES AND CONCERNS
import { useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../../hooks/useTheme";
import FloatingInput from "../FloatingInput";

const ProblemsIssuesAndConcerns = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    job_problems: gtsData.job_problems || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!formData.job_problems.trim()) {
      toast.error("Please write at least one problem, issue, or concern.");
      return;
    }

    setSaving(true);
    try {
      const result = await onUpdate("problems", gtsData.id, formData);
      if (result.success) {
        toast.success("Saved successfully!");
      } else {
        toast.error("Update failed. Please try again.");
      }
    } catch {
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <FloatingInput
        id="job_problems"
        type="text"
        label="Write problems, issues, or concerns you encountered in your job or in finding one"
        value={formData.job_problems}
        onChange={handleChange}
        labelClassName="text-[0.50rem] sm:text-xs peer-focus:text-[0.50rem]"
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
    </div>
  );
};

export default ProblemsIssuesAndConcerns;
