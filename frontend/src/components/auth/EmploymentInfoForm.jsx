import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

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

const EMPLOYMENT_NOW_OPTIONS = ["Yes", "No", "Never employed"];

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

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

function EmploymentInfoForm({
  formData,
  setFormData,
  prevStep,
  handleRegister,
}) {
  const [errors, setErrors] = useState({});
  const [otherOccupation, setOtherOccupation] = useState("");
  const [otherNonEmployedReason, setOtherNonEmployedReason] = useState("");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const isDark = useDarkMode();

  const validate = () => {
    const newErrors = {};

    if (!formData.employmentNow) {
      newErrors.employmentNow = "Please select an option.";
    }

    if (formData.employmentNow === "Yes") {
      if (!formData.employmentStatus)
        newErrors.employmentStatus = "Select your employment status.";
      if (!formData.placeOfWork?.trim())
        newErrors.placeOfWork = "Place of work required.";
      if (!formData.companyName?.trim())
        newErrors.companyName = "Company name required.";
      if (!formData.companyAddress?.trim())
        newErrors.companyAddress = "Company address required.";
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
      if (formData.nonEmployedReasons.length === 0) {
        newErrors.employmentStatus = "Select at least one reason.";
      }
      if (
        formData.nonEmployedReasons.includes("Other reasons, please specify") &&
        !otherNonEmployedReason.trim()
      ) {
        newErrors.otherNonEmployedReason = "Please specify your reason.";
      }
    }

    if (formData.employmentNow === "Never employed") {
      if (formData.employmentStatus !== "Never employed") {
        newErrors.employmentStatus =
          "Invalid status for never employed.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNonEmployedReasonChange = (reason) => {
    setFormData((prev) => {
      let updated = [...prev.nonEmployedReasons];
      if (updated.includes(reason)) {
        updated = updated.filter((r) => r !== reason);
      } else {
        updated.push(reason);
      }
      return { ...prev, nonEmployedReasons: updated };
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

  const onSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setSubmitting(true);

    const finalNonEmployedReasons = formData.nonEmployedReasons.map((r) =>
      r === "Other reasons, please specify"
        ? otherNonEmployedReason.trim()
        : r.trim()
    );

    const finalOccupations = formData.occupation.map((o) =>
      o === "Others, please specify" 
      ? otherOccupation.trim() 
      : o.trim()
    );

    try {
      await handleRegister(finalNonEmployedReasons, finalOccupations);

      setFormData({});
      setOtherNonEmployedReason("");
      setOtherOccupation("");

      toast.success(
        "Registration submitted successfully! Redirecting to login page..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      
      setSubmitting(false);
    
      if (error.message?.toLowerCase().includes("username")) {
        toast.error("Username is already taken. Please go back and choose a different username.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed! Please check your information and try again.");
      }
    }
  };

  useEffect(() => {
    setFormData((prev) => {
      const updated = { ...prev };

      if (prev.employmentNow === "Yes") {
        if (
          NON_EMPLOYED_STATUSES.includes(prev.employmentStatus) ||
          prev.employmentStatus === "Never employed"
        ) {
          updated.employmentStatus = "";
        }
      }

      if (prev.employmentNow === "No") {
        updated.placeOfWork = "";
        updated.companyName = "";
        updated.companyAddress = "";
        updated.occupation = [];
        updated.employmentStatus = NON_EMPLOYED_STATUSES.includes(
          prev.employmentStatus
        )
          ? prev.employmentStatus
          : "";
      }

      if (prev.employmentNow === "Never employed") {
        updated.employmentStatus = "Never employed";
        updated.placeOfWork = "";
        updated.companyName = "";
        updated.companyAddress = "";
        updated.occupation = [];
      }

      return updated;
    });

    setOtherOccupation("");
  }, [formData.employmentNow, setFormData]);

  return (
    <div className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} p-6 rounded-lg shadow-md`}>
      <h2 className="pb-2 mb-4 text-xl font-semibold border-b">Employment Information</h2>

      <div className="mb-4">
        <label className={`block mb-2 text-sm font-medium ${ isDark ? "text-gray-200" : "text-gray-700"}`}>
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
                onChange={(e) =>
                  setFormData({ ...formData, employmentNow: e.target.value })
                }
                className="w-4 h-4"
              />
              <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>{opt}</span>
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
            id="employmentStatus"
            value={formData.employmentStatus}
            onChange={(e) =>
              setFormData({ ...formData, employmentStatus: e.target.value })
            }
            label="Employment Status"
            error={errors.employmentStatus}
            options={EMPLOYED_STATUSES}
            darkMode={isDark}
          />
          <FloatingSelect
            id="placeOfWork"
            value={formData.placeOfWork}
            onChange={(e) =>
              setFormData({ ...formData, placeOfWork: e.target.value })
            }
            label="Place of Work"
            error={errors.placeOfWork}
            options={["Local", "Abroad"]}
            darkMode={isDark}
          />
          <FloatingInput
            id="companyName"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            label="Company Name"
            error={errors.companyName}
            darkMode={isDark}
          />
          <FloatingInput
            id="companyAddress"
            value={formData.companyAddress}
            onChange={(e) =>
              setFormData({ ...formData, companyAddress: e.target.value })
            }
            label="Company Address"
            error={errors.companyAddress}
            darkMode={isDark}
          />

          <div className="mb-4">
            <label className={`block mb-2 text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Occupation(s)
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
                darkMode={isDark}
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
          <label className={`block mb-2 text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Why? (You may select multiple answers)
          </label>
          <div className="flex flex-wrap gap-2">
            {NON_EMPLOYED_REASONS.map((reason) => (
              <label
                key={reason}
                className={`px-2 py-1 border rounded cursor-pointer transition-colors ${
                  formData.nonEmployedReasons.includes(reason)
                    ? "bg-blue-600 text-white border-blue-600"
                    : isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  value={reason}
                  checked={formData.nonEmployedReasons.includes(reason)}
                  onChange={() => handleNonEmployedReasonChange(reason)}
                  className="hidden"
                />
                {reason}
              </label>
            ))}
          </div>

          {formData.nonEmployedReasons.includes(
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
              darkMode={isDark}
            />
          )}

          {errors.employmentStatus && (
            <p className="mt-1 text-xs text-red-500">
              {errors.employmentStatus}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          disabled={submitting}
          className={`px-4 py-2 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed 
            ${isDark ? "bg-gray-600 text-gray-100 hover:bg-gray-400" : "bg-gray-300 text-gray-800 hover:bg-gray-800"
          }`}
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="px-6 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default EmploymentInfoForm;