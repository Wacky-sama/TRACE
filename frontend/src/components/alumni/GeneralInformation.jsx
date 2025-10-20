// A. GENERAL INFORMATION
import { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

const GeneralInformation = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div  className={`p-4 rounded-lg shadow transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className={`mb-4 text-xl font-semibold ${
          isDark ? "text-gray-100" : "text-gray-800"
        }`}
      >General Information</h2>

      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
        <div>
          <FloatingInput
            id="full_name"
            type="text"
            label="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div>
          <FloatingInput
            id="permanent_address"
            type="text"
            label="Permanent Address"
            value={formData.permanent_address}
            onChange={handleChange}
          />
        </div>

        <div>
          <FloatingInput
            id="contact_email"
            type="email"
            label="E-mail Address"
            value={formData.contact_email}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div>
          <FloatingInput
            id="mobile"
            type="tel"
            label="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <FloatingSelect
            id="civil_status"
            value={formData.civil_status}
            label="Civil Status"
            onChange={handleChange}
            options={["Single", "Married", "Separated/Divorced", "Widow or Widower", "Single Parent"]}
          >
          </FloatingSelect>
        </div>

        <div>
          <FloatingInput
            id="sex"
            value={formData.sex}
            label="Sex"
            readOnly
          >
          </FloatingInput>
        </div>

        <div>
          <FloatingInput
            id="birthday"
            value={formData.birthday}
            label="Birthday"
            readOnly
          />
        </div>
      </div>

      {/* Save Button */}
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

      {/* Message */}
      {message && (
        <p
          className={`mt-2 text-sm ${
            result?.success
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

export default GeneralInformation;
