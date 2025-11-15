import { useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../../hooks/useTheme";
import FloatingInput from "../FloatingInput";

const TrainingsAndStudies = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  const handleRemoveTraining = async (index) => {
    const confirmed = window.confirm("Are you sure you want to remove this training? This action cannot be undone.");
    if (!confirmed) return;

    const updated = trainings.filter((_, i) => i !== index);
    const removedItem = trainings[index];
    setTrainings(updated);

    setSaving(true);
    try {
      const result = await onUpdate("trainings", gtsData.id, { trainings: updated });
      if (result.success) {
        toast.success("Training removed successfully!");
        if (result.data?.trainings) {
          setTrainings(result.data.trainings);
        }
      } else {
        setTrainings([...updated, removedItem]);
        toast.error("Failed to remove training. Please try again.");
      }
    } catch (error) {
      console.error("Remove error:", error);
      setTrainings([...updated, removedItem]);
      toast.error("An error occurred while removing the training.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await onUpdate("trainings", gtsData.id, { trainings });
      if (result.success) {
        toast.success("Saved successfully!");
        if (result.data?.trainings) {
          setTrainings(result.data.trainings);
        }
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
    <div className="space-y-6">
      {trainings.map((training, index) => (
        <div
          key={training.id || index}
          className={`p-4 rounded-lg border ${
            isDark ? "border-gray-700 bg-gray-700" : "border-gray-300 bg-gray-50"
          }`}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FloatingInput
              id={`title-${index}`}
              type="text"
              label="Title of Training or Advance Study"
              shortLabel="Training Title"
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
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => handleRemoveTraining(index)}
                className="text-sm font-medium text-red-500 hover:text-red-700"
                disabled={saving}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-col justify-between gap-4 pt-4 sm:flex-row">
        <button
          onClick={handleAddTraining}
          type="button"
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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

export default TrainingsAndStudies;