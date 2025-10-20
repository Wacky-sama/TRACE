import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeProvider";
import { toast } from "react-toastify";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

const EMPLOYMENT_NOW_OPTIONS = ["Yes", "No", "Never Employed"];

const EMPLOYED_STATUSES = [
  "Regular or Permanent",
  "Contractual",
  "Temporary",
  "Self-employed / Freelance",
  "Casual",
];

const NON_EMPLOYED_STATUSES = ["Unemployed", "Retired", "Looking for Work"];

const NON_EMPLOYED_REASONS = [
  "Advance or further study",
  "Family concern and decided not to find a job",
  "Health-related reasons",
  "Lack of work experience",
  "No job opportunity",
  "Did not look for a job",
  "Other reasons, please specify",
];

const OCCUPATION_OPTIONS = [
  "Officials of Government and Special-Interest Organizations, Corporate Executives, Managers, Managing Proprietors and Supervisors",
  "Professionals",
  "Technicians and Associate Professionals",
  "Clerks",
  "Service Workers and Shop and Market Sales Workers",
  "Farmers, Forestry Workers and Fishermen",
  "Trades and Related Workers",
  "Plant and Machine Operators and Assemblers",
  "Laborers and Unskilled Workers",
  "Others, please specify",
];

const EmploymentData = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const initialEmploymentNow =
    gtsData.ever_employed === false &&
    gtsData.employment_status === "Never Employed"
      ? "Never Employed"
      : gtsData.ever_employed
      ? "Yes"
      : "No";

  const [formData, setFormData] = useState({
    employmentNow: initialEmploymentNow,
    ever_employed: gtsData.ever_employed || false,
    is_employed: gtsData.is_employed || false,
    non_employed_reasons: gtsData.non_employed_reasons || [],
    employment_status: gtsData.employment_status || "",
    occupation: gtsData.occupation || [],
    company_name: gtsData.company_name || "",
    company_address: gtsData.company_address || "",
    place_of_work: gtsData.place_of_work || "",
  });

  const [otherOccupation, setOtherOccupation] = useState("");
  const [otherNonEmployedReason, setOtherNonEmployedReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const handleEmploymentNowChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      employmentNow: value,
      ever_employed: value === "Yes",
      is_employed: value === "Yes",
      ...(value === "No" && {
        employment_status: NON_EMPLOYED_STATUSES.includes(
          prev.employment_status
        )
          ? prev.employment_status
          : "",
        place_of_work: "",
        company_name: "",
        company_address: "",
        occupation: [],
      }),
      ...(value === "Never Employed" && {
        employment_status: "Never Employed",
        place_of_work: "",
        company_name: "",
        company_address: "",
        occupation: [],
        non_employed_reasons: [],
      }),
    }));
    setOtherOccupation("");
    setOtherNonEmployedReason("");
    setErrors({});
  };

  const handleNonEmployedReasonChange = (reason) => {
    setFormData((prev) => {
      let updated = [...prev.non_employed_reasons];
      if (updated.includes(reason)) {
        updated = updated.filter((r) => r !== reason);
        if (reason === "Other reasons, please specify")
          setOtherNonEmployedReason("");
      } else {
        updated.push(reason);
      }
      return { ...prev, non_employed_reasons: updated };
    });
  };

  const handleOccupationChange = (option) => {
    setFormData((prev) => {
      const current = prev.occupation;
      let updated;
      if (current.includes(option)) {
        updated = current.filter((o) => o !== option);
        if (option === "Others, please specify") setOtherOccupation("");
      } else {
        updated = [...current, option];
      }
      return { ...prev, occupation: updated };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.employmentNow) {
      newErrors.employmentNow = "Please select an option.";
    }

    if (formData.employmentNow === "Yes") {
      if (!formData.employment_status)
        newErrors.employment_status = "Select your employment status.";
      if (!formData.place_of_work?.trim())
        newErrors.place_of_work = "Place of work required.";
      if (!formData.company_name?.trim())
        newErrors.company_name = "Company name required.";
      if (!formData.company_address?.trim())
        newErrors.company_address = "Company address required.";
      if (!formData.occupation.length)
        newErrors.occupation = "Select at least one occupation.";
      if (
        formData.occupation.includes("Others, please specify") &&
        !otherOccupation.trim()
      ) {
        newErrors.otherOccupation = "Please specify your occupation.";
      }
    }

    if (formData.employmentNow === "No") {
      if (formData.non_employed_reasons.length === 0) {
        newErrors.non_employed_reasons = "Select at least one reason.";
      }
      if (
        formData.non_employed_reasons.includes(
          "Other reasons, please specify"
        ) &&
        !otherNonEmployedReason.trim()
      ) {
        newErrors.otherNonEmployedReason = "Please specify your reason.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before saving.");
      return;
    }

    setSaving(true);

    const finalNonEmployedReasons = formData.non_employed_reasons.map((r) =>
      r === "Other reasons, please specify" ? otherNonEmployedReason.trim() : r
    );
    const finalOccupations = formData.occupation.map((o) =>
      o === "Others, please specify" ? otherOccupation.trim() : o
    );

    const updatedFields = {
      ...formData,
      ever_employed: formData.employmentNow === "Yes",
      is_employed: formData.employmentNow === "Yes",
      non_employed_reasons: finalNonEmployedReasons,
      occupation: finalOccupations,
    };

    const result = await onUpdate("employment", updatedFields);
    setSaving(false);
    setSaveSuccess(result.success);
    setMessage(
      result.success
        ? "Saved successfully!"
        : `Update failed: ${result.message}`
    );
    if (!result.success) toast.error(`Update failed: ${result.message}`);
  };

  useEffect(() => {
    setFormData((prev) => {
      const updated = { ...prev };

      if (prev.employmentNow === "Yes") {
        if (
          NON_EMPLOYED_STATUSES.includes(prev.employment_status) ||
          prev.employment_status === "Never Employed"
        ) {
          updated.employment_status = "";
        }
      }

      if (prev.employmentNow === "No") {
        updated.place_of_work = "";
        updated.company_name = "";
        updated.company_address = "";
        updated.occupation = [];
        updated.employment_status = NON_EMPLOYED_STATUSES.includes(
          prev.employment_status
        )
          ? prev.employment_status
          : "";
      }

      if (prev.employmentNow === "Never Employed") {
        updated.employment_status = "Never Employed";
        updated.place_of_work = "";
        updated.company_name = "";
        updated.company_address = "";
        updated.occupation = [];
      }

      return updated;
    });
    setOtherOccupation("");
  }, [formData.employmentNow]);

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

      <div className="mb-4">
        <label
          className={`block mb-2 text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Are you presently employed?
        </label>
        <div className="flex flex-col gap-2">
          {EMPLOYMENT_NOW_OPTIONS.map((opt) => (
            <label key={opt} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="employmentNow"
                value={opt}
                checked={formData.employmentNow === opt}
                onChange={(e) => handleEmploymentNowChange(e.target.value)}
                className="w-4 h-4"
              />
              <span
                className={`text-sm ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {opt}
              </span>
            </label>
          ))}
        </div>
        {errors.employmentNow && (
          <p className="mt-1 text-xs text-red-500">{errors.employmentNow}</p>
        )}
      </div>

      {formData.employmentNow === "Yes" && (
        <>
          <FloatingSelect
            id="employment_status"
            value={formData.employment_status}
            onChange={(e) =>
              setFormData({ ...formData, employment_status: e.target.value })
            }
            label="Employment Status"
            error={errors.employment_status}
            options={EMPLOYED_STATUSES}
          />
          <FloatingSelect
            id="place_of_work"
            value={formData.place_of_work}
            onChange={(e) =>
              setFormData({ ...formData, place_of_work: e.target.value })
            }
            label="Place of Work"
            error={errors.place_of_work}
            options={["Local", "Abroad"]}
          />
          <FloatingInput
            id="company_name"
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            label="Company Name"
            error={errors.company_name}
          />
          <FloatingInput
            id="company_address"
            value={formData.company_address}
            onChange={(e) =>
              setFormData({ ...formData, company_address: e.target.value })
            }
            label="Company Address"
            error={errors.company_address}
          />

          <div className="mb-4">
            <label
              className={`block mb-2 text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Present occupation: (you may have multiple answers)
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCUPATION_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`px-2 py-1 border rounded cursor-pointer transition-colors ${
                    formData.occupation.includes(opt)
                      ? "bg-blue-600 text-white border-blue-600"
                      : isDark
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={formData.occupation.includes(opt)}
                    onChange={() => handleOccupationChange(opt)}
                    className="hidden"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {formData.occupation.includes("Others, please specify") && (
              <FloatingInput
                id="otherOccupation"
                value={otherOccupation}
                onChange={(e) => setOtherOccupation(e.target.value.trimStart())}
                label="Please specify your occupation"
                error={errors.otherOccupation}
              />
            )}
            {errors.occupation && (
              <p className="mt-1 text-xs text-red-500">{errors.occupation}</p>
            )}
          </div>
        </>
      )}

      {formData.employmentNow === "No" && (
        <div className="mb-4">
          <label
            className={`block mb-2 text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Why? (You may select multiple answers)
          </label>
          <div className="flex flex-wrap gap-2">
            {NON_EMPLOYED_REASONS.map((reason) => (
              <label
                key={reason}
                className={`px-2 py-1 border rounded cursor-pointer transition-colors ${
                  formData.non_employed_reasons.includes(reason)
                    ? "bg-blue-600 text-white border-blue-600"
                    : isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  value={reason}
                  checked={formData.non_employed_reasons.includes(reason)}
                  onChange={() => handleNonEmployedReasonChange(reason)}
                  className="hidden"
                />
                {reason}
              </label>
            ))}
          </div>

          {formData.non_employed_reasons.includes(
            "Other reasons, please specify"
          ) && (
            <FloatingInput
              id="otherNonEmployedReason"
              value={otherNonEmployedReason}
              onChange={(e) =>
                setOtherNonEmployedReason(e.target.value.trimStart())
              }
              label="Please specify"
              error={errors.otherNonEmployedReason}
            />
          )}

          {errors.non_employed_reasons && (
            <p className="mt-1 text-xs text-red-500">
              {errors.non_employed_reasons}
            </p>
          )}
        </div>
      )}

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
