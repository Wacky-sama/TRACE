import { useState } from "react";
import toast from "react-hot-toast";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

const SATISFACTION_LEVELS = ["Very High", "High", "Moderate", "Low", "Very Low"];

const JobSatisfaction = ({ gtsData, onUpdate }) => {

  const [formData, setFormData] = useState({
    job_satisfaction: gtsData.job_satisfaction || "",
    job_satisfaction_reason: gtsData.job_satisfaction_reason || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, job_satisfaction: value }));
  };

  const handleSave = async () => {
    if (!formData.job_satisfaction) {
      toast.error("Please select your job satisfaction level.");
      return;
    }

    setSaving(true);
    try {
      const result = await onUpdate("job-satisfaction", gtsData.id, formData);
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FloatingSelect
          id="job_satisfaction"
          value={formData.job_satisfaction}
          label="How would you rate your overall job satisfaction?"
          shortLabel="Job Satisfaction"
          onChange={handleSelectChange}
          options={SATISFACTION_LEVELS}
        />

        <FloatingInput
          id="job_satisfaction_reason"
          type="text"
          label="Why? (Reason for your answer)"
          shortLabel="Reason"
          value={formData.job_satisfaction_reason}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
            saving
              ? "opacity-70 cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default JobSatisfaction;