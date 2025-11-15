import { useState } from "react";
import toast from "react-hot-toast";
import FloatingInput from "../FloatingInput";

const Services = ({ gtsData, onUpdate }) => {

  const [formData, setFormData] = useState({
    desired_services: gtsData.desired_services || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!formData.desired_services.trim()) {
      toast.error("Please list at least one desired service.");
      return;
    }

    setSaving(true);
    try {
      const result = await onUpdate("services", gtsData.id, formData);
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
      <FloatingInput
        id="desired_services"
        type="text"
        label="List down services you want to avail from the university"
        shortLabel="Desired Services"
        value={formData.desired_services}
        onChange={handleChange}
      />

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

export default Services;