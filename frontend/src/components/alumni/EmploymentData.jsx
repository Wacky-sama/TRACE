import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeProvider";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import AlumniFloatingDatePicker from "../common/AlumniFloatingDatePicker";

const EMPLOYMENT_NOW_OPTIONS = [
  "Yes", 
  "No", 
  "Never Employed"
];

const EMPLOYED_STATUSES = [
  "Regular or Permanent",
  "Contractual",
  "Temporary",
  "Self-employed / Freelance",
  "Casual"
];

const NON_EMPLOYED_STATUSES = [
  "Unemployed", 
  "Retired", 
  "Looking for Work"
];

const NON_EMPLOYED_REASONS = [
  "Advance or further study",
  "Family concern and decided not to find a job",
  "Health-related reasons",
  "Lack of work experience",
  "No job opportunity",
  "Did not look for a job",
  "Other reasons, please specify"
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
  "Others, please specify"
];

const JOB_SECTORS = [
  "Agriculture, Hunting and Forestry",
  "Fishing",
  "Mining and Quarrying",
  "Manufacturing",
  "Electricity, Gas and Water Supply",
  "Construction",
  "Wholesale and Retail Trade, repair of motor vehicles, motorcycles and personal and household goods",
  "Hotels and Restaurants",
  "Transport Storage and Communication",
  "Financial Intermediation",
  "Real State, Renting and Business Activities",
  "Public Administration and Defense; Compulsory Social Security",
  "Education",
  "Health and Social Work",
  "Other community, Social and Personal Service Activities",
  "Private Households with Employed Persons",
  "Self employed",
  "Others, please specify"
];

const PLACE_OF_WORK_OPTIONS = [
  "Local", 
  "Abroad"
];

const JOB_FIND_METHODS = [
  "Response to an advertisement",
  "As walk-in applicant",
  "Recommended by someone",
  "Information from friends",
  "Arranged by school's job placement officer",
  "Family business",
  "Job Fair or PESO",
  "Others, please specify",
];

const JOB_REASONS = [
  "High salaries and benefits",
  "Career challenge",
  "Related to special skill",
  "Related to course or program of study",
  "Proximity to residence",
  "Peer influence",
  "Family influence",
  "Other reason(s), please specify",
];

const JOB_CHANGE_REASONS = [
  "Higher salaries and benefits",
  "Career Change",
  "Related to special skills",
  "Proximity to residence",
  "Other reason(s), please specify",
];

const JOB_LEVEL_OPTIONS_FIRST = [
  "Rank or Clerical",
  "Professional, Technical or Supervisory",
  "Managerial or Executive",
  "Self-employed",
];

const JOB_LEVEL_OPTIONS_CURRENT = [
  "Rank or Clerical",
  "Professional, Technical or Supervisory",
  "Managerial or Executive",
  "Self-employed",
];

const USEFUL_COMPETENCIES = [
  "Communication skills",
  "Human Relations skills",
  "Entrepreneurial skills",
  "Problem-solving skills",
  "Critical Thinking skills",
  "Other skills, please specify",
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
    job_sector: gtsData.job_sector || "",
    place_of_work: gtsData.place_of_work || "",
    first_job: gtsData.first_job || false,
    job_related_to_course: gtsData.job_related_to_course || false,
    job_start_date: gtsData.job_start_date || "",
    months_to_first_job: gtsData.months_to_first_job || "",
    job_find_methods: gtsData.job_find_methods || [],
    job_reasons: gtsData.job_reasons || [],
    job_change_reasons: gtsData.job_change_reasons || [],
    job_level_first: gtsData.job_level_first || "",
    job_level_current: gtsData.job_level_current || "",
    first_job_salary: gtsData.first_job_salary || "",
    curriculum_relevance_first_job:
      gtsData.curriculum_relevance_first_job || false,
    curriculum_relevance_second_job:
      gtsData.curriculum_relevance_second_job || false,
    useful_competencies: gtsData.useful_competencies || [],
    curriculum_improvement_suggestions:
      gtsData.curriculum_improvement_suggestions || "",
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
        updated.non_employed_reasons = [];
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
          <FloatingSelect
            id="job_sector"
            value={formData.job_sector || ""}
            onChange={(e) =>
              setFormData({ ...formData, job_sector: e.target.value })
            }
            label="Job Sector"
            options={[
              "Government",
              "Private",
              "Non-Government Organization (NGO)",
              "Self-Employed",
              "Others",
            ]}
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
      <FloatingSelect
        id="job_level_current"
        value={formData.job_level_current || ""}
        onChange={(e) =>
          setFormData({ ...formData, job_level_current: e.target.value })
        }
        label="Current Job Level"
        options={[
          "Rank and File",
          "Supervisory",
          "Managerial",
          "Executive",
          "Owner",
        ]}
      />

      <FloatingSelect
        id="job_level_first"
        value={formData.job_level_first || ""}
        onChange={(e) =>
          setFormData({ ...formData, job_level_first: e.target.value })
        }
        label="First Job Level Position"
        options={[
          "Rank or Clerical",
          "Professional, Technical or Supervisory",
          "Managerial or Executive",
          "Self-employed"
        ]}
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.first_job || false}
            onChange={(e) =>
              setFormData({ ...formData, first_job: e.target.checked })
            }
          />
          First Job
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.job_related_to_course || false}
            onChange={(e) =>
              setFormData({
                ...formData,
                job_related_to_course: e.target.checked,
              })
            }
          />
          Job related to your course
        </label>
      </div>

      <AlumniFloatingDatePicker
        id="job_start_date"
        type="date"
        label="Job Start Date"
        value={formData.job_start_date || ""}
        onChange={(e) =>
          setFormData({ ...formData, job_start_date: e.target.value })
        }
      />

      <FloatingInput
        id="months_to_first_job"
        type="number"
        value={formData.months_to_first_job || ""}
        onChange={(e) =>
          setFormData({ ...formData, months_to_first_job: e.target.value })
        }
        label="Months to Land First Job"
      />

      <FloatingInput
        id="first_job_salary"
        type="number"
        value={formData.first_job_salary || ""}
        onChange={(e) =>
          setFormData({ ...formData, first_job_salary: e.target.value })
        }
        label="First Job Salary (₱)"
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.curriculum_relevance_first_job || false}
            onChange={(e) =>
              setFormData({
                ...formData,
                curriculum_relevance_first_job: e.target.checked,
              })
            }
          />
          Curriculum relevant to first job
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.curriculum_relevance_second_job || false}
            onChange={(e) =>
              setFormData({
                ...formData,
                curriculum_relevance_second_job: e.target.checked,
              })
            }
          />
          Curriculum relevant to second job
        </label>
      </div>

      <FloatingSelect
        id="job_find_methods"
        multiple
        value={formData.job_find_methods || []}
        onChange={(e) =>
          setFormData({
            ...formData,
            job_find_methods: Array.from(
              e.target.selectedOptions,
              (opt) => opt.value
            ),
          })
        }
        label="How did you find your job? (multiple)"
        options={[
          "Recommendation",
          "Job Fair",
          "Online Application",
          "Walk-in",
          "School Referral",
          "Other",
        ]}
      />

      <FloatingSelect
        id="job_reasons"
        multiple
        value={formData.job_reasons || []}
        onChange={(e) =>
          setFormData({
            ...formData,
            job_reasons: Array.from(
              e.target.selectedOptions,
              (opt) => opt.value
            ),
          })
        }
        label="Reasons for choosing this job (multiple)"
        options={[
          "Salary",
          "Interest",
          "Career Growth",
          "Family Influence",
          "Course Related",
          "Other",
        ]}
      />

      <FloatingSelect
        id="job_change_reasons"
        multiple
        value={formData.job_change_reasons || []}
        onChange={(e) =>
          setFormData({
            ...formData,
            job_change_reasons: Array.from(
              e.target.selectedOptions,
              (opt) => opt.value
            ),
          })
        }
        label="Reasons for changing job (multiple)"
        options={[
          "Higher Salary",
          "Career Change",
          "Location",
          "Personal Reasons",
          "Better Opportunity",
        ]}
      />

      <FloatingSelect
        id="useful_competencies"
        multiple
        value={formData.useful_competencies || []}
        onChange={(e) =>
          setFormData({
            ...formData,
            useful_competencies: Array.from(
              e.target.selectedOptions,
              (opt) => opt.value
            ),
          })
        }
        label="Useful Competencies (multiple)"
        options={[
          "Communication Skills",
          "Problem Solving",
          "Leadership",
          "Technical Knowledge",
          "Teamwork",
          "Adaptability",
        ]}
      />

      <FloatingInput
        id="curriculum_improvement_suggestions"
        value={formData.curriculum_improvement_suggestions || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            curriculum_improvement_suggestions: e.target.value,
          })
        }
        label="Suggestions for Curriculum Improvement"
      />
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
