// D. EMPLOYMENT DATA
import { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

const EmploymentData = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    ever_employed: gtsData.ever_employed || false,
    is_employed: gtsData.is_employed || false,
    non_employed_reasons: gtsData.non_employed_reasons || "",
    employment_status: gtsData.employment_status || "",
    occupation: gtsData.occupation?.join(", ") || "",
    company_name: gtsData.company_name || "",
    company_address: gtsData.company_address || "",
    job_sector: gtsData.job_sector || "",
    place_of_work: gtsData.place_of_work || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    const updatedFields = {
      ...formData,
      occupation: formData.occupation
        ? formData.occupation.split(",").map((item) => item.trim())
        : [],
    };

    const result = await onUpdate(updatedFields);
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
        Employment Information
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
        <div>
          <FloatingSelect
            id="ever_employed"
            label="Are you presently employed?"
            value={formData.ever_employed ? "Yes" : "No"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ever_employed: e.target.value === "Yes",
              }))
            }
            options={["Yes", "No", "Never Employed"]}
          />
        </div>

        {!formData.is_employed && (
          <div>
            <FloatingInput
              id="non_employed_reasons"
              type="text"
              label="If not employed, specify reason"
              value={formData.non_employed_reasons}
              onChange={handleChange}
            />
          </div>
        )}

        <div>
          <FloatingSelect
            id="employment_status"
            label="Employment Status"
            value={formData.employment_status}
            onChange={handleChange}
            options={[
              "Regular/Permanent",
              "Temporary/Contractual",
              "Self-Employed",
              "Casual",
              "Part-Time",
              "Unemployed",
            ]}
          />
        </div>

        <div>
          <FloatingInput
            id="company_name"
            type="text"
            label="Company Name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <FloatingInput
            id="company_address"
            type="text"
            label="Company Address"
            value={formData.company_address}
            onChange={handleChange}
          />
        </div>

        <div>
          <FloatingInput
            id="occupation"
            type="text"
            label="Occupation(s) (comma-separated)"
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>

        <div>
          <FloatingSelect
            id="job_sector"
            label="Job Sector"
            value={formData.job_sector}
            onChange={handleChange}
            options={[
              "Public Sector",
              "Private Sector",
              "Self-Employed",
              "NGO",
              "Others",
            ]}
          />
        </div>

        <div>
          <FloatingSelect
            id="place_of_work"
            label="Place of Work"
            value={formData.place_of_work}
            onChange={handleChange}
            options={["Local", "Abroad"]}
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

export default EmploymentData;
