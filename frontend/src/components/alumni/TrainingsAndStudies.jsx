import { useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeProvider";
import FloatingInput from "../FloatingInput";

const TrainingsAndStudies = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Include 'id' from backend data, or null for new trainings
  const [trainings, setTrainings] = useState(
    gtsData.trainings && gtsData.trainings.length > 0
      ? gtsData.trainings.map((t) => ({
          id: t.id,
          title: t.title || "",
          duration: t.duration || "",
          credits_earned: t.credits_earned || "",
          institution: t.institution || "",
        }))
      : [{ id: null, title: "", duration: "", credits_earned: "", institution: "" }]
  );

  const [saving, setSaving] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...trainings];
    updated[index][field] = value;
    setTrainings(updated);
  };

  const handleAddTraining = () => {
    setTrainings([
      ...trainings,
      { id: null, title: "", duration: "", credits_earned: "", institution: "" },
    ]);
  };

  const handleRemoveTraining = (index) => {
    const updated = trainings.filter((_, i) => i !== index);
    setTrainings(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await onUpdate("trainings", gtsData.id, { trainings });

      if (result.success) {
        toast.success("Saved successfully!");
      } else {
        toast.error("Update failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
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
      <h2
        className={`mb-4 text-xl font-semibold ${
          isDark ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Training(s) / Advance Studies Attended After College (Optional)
      </h2>

      {trainings.map((training, index) => (
        <div
          key={training.id || index}
          className={`p-4 mb-4 rounded-lg border ${
            isDark ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <div className="grid grid-cols-1 gap-4 mb-2 sm:grid-cols-2">
            <FloatingInput
              id={`title-${index}`}
              type="text"
              label="Title of Training or Advance Study"
              value={training.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
            <FloatingInput
              id={`duration-${index}`}
              type="text"
              label="Duration"
              value={training.duration}
              onChange={(e) => handleChange(index, "duration", e.target.value)}
            />
            <FloatingInput
              id={`credits_earned-${index}`}
              type="text"
              label="Credits Earned"
              value={training.credits_earned}
              onChange={(e) => handleChange(index, "credits_earned", e.target.value)}
            />
            <FloatingInput
              id={`institution-${index}`}
              type="text"
              label="Institution"
              value={training.institution}
              onChange={(e) => handleChange(index, "institution", e.target.value)}
            />
          </div>

          {trainings.length > 1 && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => handleRemoveTraining(index)}
                className={`text-sm ${
                  isDark
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-700"
                }`}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleAddTraining}
          type="button"
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          + Add Another Training
        </button>

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

export default TrainingsAndStudies;
