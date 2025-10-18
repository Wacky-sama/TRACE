// D. EMPLOYMENT DATA
import { useState } from "react";

const EmploymentData = ({ gtsData, onUpdate }) => {
  const [form, setForm] = useState({
    ever_employed: gtsData.ever_employed || false,
    is_employed: gtsData.is_employed || false,
    employment_status: gtsData.employment_status || "",
    company_name: gtsData.company_name || "",
    company_address: gtsData.company_address || "",
    occupation: gtsData.occupation?.join(", ") || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    setSaving(true);

    // Convert comma-separated occupations to array
    const updatedFields = {
      ...form,
      occupation: form.occupation
        ? form.occupation.split(",").map((item) => item.trim())
        : [],
    };

    const result = await onUpdate(updatedFields);
    setSaving(false);
    setMessage(result.success ? "Saved successfully!" : "Update failed.");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-semibold">Employment Information</h2>

      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Employment Status</label>
          <input
            type="text"
            name="employment_status"
            value={form.employment_status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Company Address</label>
          <input
            type="text"
            name="company_address"
            value={form.company_address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Occupation(s) (comma-separated)
          </label>
          <input
            type="text"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700"
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

export default EmploymentData;
