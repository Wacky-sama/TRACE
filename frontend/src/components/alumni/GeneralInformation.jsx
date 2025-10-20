// A. GENERAL INFORMATION
import { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";

const GeneralInformation = ({ gtsData, onUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: gtsData.full_name || "",
    permanent_address: gtsData.permanent_address || "",
    contact_email: gtsData.contact_email || "",
    mobile: gtsData.mobile || "",
    civil_status: gtsData.civil_status || "",
    sex: gtsData.sex || "",
    birthday: gtsData.birthday || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    const result = await onUpdate(formData);
    setSaving(false);
    setMessage(result.success ? "Saved successfully!" : "Update failed.");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-semibold">General Information</h2>

      {/* Display read-only personal info */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={gtsData.full_name}
            onChange={handleChange}
            className="w-full p-2 bg-gray-100 rounded-md dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block font-medium">Permanent Address</label>
          <input
            type="text"
            name="permanent_address"
            value={formData.permanent_address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Email Address</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled
          />
        </div>

        <div>
          <label className="block font-medium">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Civil Status</label>
          <select
            value={formData.civil_status}
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

        <div>
          <label className="block font-medium">Sex</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
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
