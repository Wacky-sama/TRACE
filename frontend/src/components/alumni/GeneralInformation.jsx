// A. GENERAL INFORMATION
import { useState } from "react";

const GeneralInformation = ({ gtsData, onUpdate }) => {
  const [civilStatus, setCivilStatus] = useState(gtsData.civil_status || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    const result = await onUpdate({ civil_status: civilStatus });
    setSaving(false);
    setMessage(result.success ? "Saved successfully!" : "Update failed.");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-semibold">General Information</h2>

      {/* Display read-only personal info */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            value={gtsData.full_name}
            readOnly
            className="w-full p-2 bg-gray-100 rounded-md dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Birthday</label>
          <input
            value={gtsData.birthday}
            readOnly
            className="w-full p-2 bg-gray-100 rounded-md dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Editable field */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Civil Status</label>
        <select
          value={civilStatus}
          onChange={(e) => setCivilStatus(e.target.value)}
          className="w-full p-2 border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="">Select status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Separated">Separated/Divorced</option>
          <option value="Widowed">Widow or Widower</option>
          <option value="Widowed">Single Parent</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 text-white bg-blue-600 rounded-md"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default GeneralInformation;
