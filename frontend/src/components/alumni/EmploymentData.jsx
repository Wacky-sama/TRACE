import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fillOffset, motion } from "framer-motion";
import { useTheme } from "../../context/ThemeProvider";
import AlumniFloatingDatePicker from "../common/AlumniFloatingDatePicker";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

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
  "Other reason(s), please specify"
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
  const [otherJobSector, setOtherJobSector] = useState("");
  const [otherJobFindMethod, setOtherJobFindMethod] = useState("");
  const [otherJobReason, setOtherJobReason] = useState("");
  const [otherJobChangeReason, setOtherJobChangeReason] = useState("");
  const [otherUsefulCompetency, setOtherUsefulCompetency] = useState("");

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
        job_sector: "",
        first_job: false,
        job_related_to_course: false,
        job_start_date: "",
        months_to_first_job: "",
        job_find_methods: [],
        job_reasons: [],
        job_change_reasons: [],
        job_level_first: "",
        job_level_current: "",
        first_job_salary: "",
        curriculum_relevance_first_job: false,
        curriculum_relevance_second_job: false,
        useful_competencies: [],
        curriculum_improvement_suggestions: ""
      }),
      ...(value === "Never Employed" && {
        employment_status: "Never Employed",
        place_of_work: "",
        company_name: "",
        company_address: "",
        occupation: [],
        job_sector: "",
        non_employed_reasons: [],
        first_job: false,
        job_related_to_course: false,
        job_start_date: "",
        months_to_first_job: "",
        job_find_methods: [],
        job_reasons: [],
        job_change_reasons: [],
        job_level_first: "",
        job_level_current: "",
        first_job_salary: "",
        curriculum_relevance_first_job: false,
        curriculum_relevance_second_job: false,
        useful_competencies: [],
        curriculum_improvement_suggestions: ""
      }),
    }));
    setOtherOccupation("");
    setOtherNonEmployedReason("");
    setOtherJobSector("");
    setOtherJobFindMethod("");
    setOtherJobReason("");
    setOtherJobChangeReason("");
    setOtherUsefulCompetency("");
    setErrors({});
  };

  const handleNonEmployedReasonChange = (reason) => {
    setFormData((prev) => {
      let updated = [...prev.non_employed_reasons];
      if (updated.includes(reason)) {
        updated = updated.filter((r) => r !== reason);
        if (reason === "Other reason(s), please specify")
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

  const handleJobSectorChange = (option) => {
    setFormData((prev) => {
      let updated = prev.job_sector;
      if (updated === option) {
        updated = "";
        if (option === "Others, please specify") 
          setOtherJobSector("");
      } else {
        updated = option;
        if (option !== "Others, please specify")
          setOtherJobSector("");
      }
      return { ...prev, job_sector: updated };
    });
  };

  const handleArrayChange = (field, option, otherSetter) => {
    setFormData((prev) => {
      const current = prev[field];
      let updated;
      if (current.includes(option)) {
        updated = current.filter((o) => o !== option);
        if (option === "Others, please specify" || 
          option === "Other reason(s), please specify" ||
          option === "Other skills, please specify")
            otherSetter("");
      } else {
        updated = [ ...current, option ];
      }
      return { ...prev,[field]: updated };
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
      if (!formData.job_sector?.trim()) 
        newErrors.job_sector = "Job sector required.";
      if (formData.job_sector === "Others, please specify" && 
        !otherJobSector.trim()) 
        newErrors.otherJobSector = "Please specify your job sector.";
    }

    if (formData.employmentNow === "No") {
      if (formData.non_employed_reasons.length === 0) 
        newErrors.non_employed_reasons = "Select at least one reason.";
      if (formData.non_employed_reasons.includes("Other reason(s), please specify") && 
        !otherNonEmployedReason.trim()) 
        newErrors.otherNonEmployedReason = "Please specify your reason.";
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

     const processArrayWithOther = (array, otherValue, otherKey) => {
      return array.map((item) => {
        if (item === otherKey) return otherValue.trim();
        return item;
      });
    };

     const updatedFields = {
      ...formData,
      ever_employed: formData.employmentNow === "Yes",
      is_employed: formData.employmentNow === "Yes",
      non_employed_reasons: processArrayWithOther(formData.non_employed_reasons, otherNonEmployedReason, "Other reason(s), please specify"),
      occupation: processArrayWithOther(formData.occupation, otherOccupation, "Others, pls specify"),
      job_sector: formData.job_sector === "Others, please specify" ? otherJobSector.trim() : formData.job_sector,
      job_find_methods: processArrayWithOther(formData.job_find_methods, otherJobFindMethod, "Others, please specify"),
      job_reasons: processArrayWithOther(formData.job_reasons, otherJobReason, "Other reason(s), please specify"),
      job_change_reasons: processArrayWithOther(formData.job_change_reasons, otherJobChangeReason, "Other reason (s), please specify"),
      useful_competencies: processArrayWithOther(formData.useful_competencies, otherUsefulCompetency, "Other skills, please specify"),
    };

    const result = await onUpdate("employment", updatedFields);
    setSaving(false);
    setSaveSuccess(result.success);
    setMessage(result.success ? "Saved successfully!" : `Update failed: ${result.message}`);
    if (!result.success) toast.error(`Update failed: ${result.message}`);
  };

  useEffect(() => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (prev.employmentNow === "Yes") {
        updated.non_employed_reasons = [];
        if (NON_EMPLOYED_STATUSES.includes(prev.employment_status) || 
          prev.employment_status === "Never Employed") {
          updated.employment_status = "";
        }
      }

      if (prev.employmentNow === "No") {
        updated.place_of_work = "";
        updated.company_name = "";
        updated.company_address = "";
        updated.occupation = [];
        updated.job_sector = "";
        updated.employment_status = NON_EMPLOYED_STATUSES.includes(prev.employment_status)
         ? prev.employment_status : "";
      }

      if (prev.employmentNow === "Never Employed") {
        updated.employment_status = "Never Employed";
        updated.place_of_work = "";
        updated.company_name = "";
        updated.company_address = "";
        updated.occupation = [];
        updated.job_sector = "";
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
          <p className="mt-1 text-xs text-red-500">
            {errors.employmentNow}
          </p>
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
              Major line of business of the company you are  presently employed in.
            </label>
            <div className="flex flex-wrap gap-2">
              {JOB_SECTORS.map((sector) => (
                <label
                  key={sector}
                  className={`px-2 py-1 border rounded cursor-pointer transition-colors ${
                    formData.job_sector === sector
                      ? "bg-blue-600 text-white border-blue-600"
                      : isDark
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FloatingInput
                    id="job_sector"
                    type="radio"
                    value={sector}
                    checked={formData.job_sector === sector}
                    onChange={() => handleJobSectorChange(sector)}
                    className="hidden"
                  />
                  {sector}
                </label>
              ))}
            </div>
            {formData.job_sector === "Others, please specify" && (
              <FloatingInput
                id="otherJobSector"
                value={otherJobSector}
                onChange={(e) => otherJobSector(e.target.value.trimStart())}
                label="Please specify your job sector"
                error={errors.otherJobSector}
              />
            )}
            {errors.job_sector && (
              <p className="mt-1 text-xs text-red-500">
                {errors.job_sector}
              </p>
            )}
          </div>
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
            {formData.occupation.includes("Others, pls specify") && (
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
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.first_job || false}
                onChange={(e) =>
                  setFormData({ ...formData, first_job: e.target.checked })
                }
              />
              Is this your first job after college?
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
              Is your first job related to the course you took up in college?
            </label>
          </div>
          <AlumniFloatingDatePicker
            id="job_start_date"
            type="date"
            label="Date of first employment: mm/dd/year"
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
            label="How long did it take you to land your first job? (in months)"
          />
          <div className="mb-4">
            <label
              className={`block mb-2 text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              How did you find your first job? (You may select multiple answers)
            </label>
            <div className="flex flex-wrap gap-2">
              {JOB_FIND_METHODS.map((method) => (
                <label
                  key={method}
                  className={`px-2 py-1 border rounded cursor-pointer transition-colors ${
                    formData.job_find_methods.includes(method)
                      ? "bg-blue-600 text-white border-blue-600"
                      : isDark
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={method}
                    checked={formData.job_find_methods.includes(method)}
                    onChange={() => handleArrayChange("job_find_methods", method, setOtherJobFindMethod)}
                    className="hidden"
                  />
                  {method}
                </label>
                ))}
            </div>
             {formData.job_find_methods.includes("Others, please specify") && (
              <FloatingInput
                id="otherJobFindMethod"
                value={otherJobFindMethod}
                onChange={(e) => setOtherJobFindMethod(e.target.value.trimStart())}
                label="Please specify"
              />
            )}
          </div>
          <div className="mb-4">
             <label
              className={`block mb-2 text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              What are the reason(s) for landing on the job? (You may select multiple answers)
            </label>
             <div className="flex flex-wrap gap-2">
              {JOB_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`px-2 py-1 border rounded cursor-pointer transition-colors ${
                    formData.job_reasons.includes(reason)
                      ? "bg-blue-600 text-white border-blue-600"
                      : isDark
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={reason}
                    checked={formData.job_reasons.includes(reason)}
                    onChange={() => handleArrayChange("job_reasons", reason, setOtherJobReason)}
                    className="hidden"
                  />
                  {reason}
                </label>
              ))}
             </div>
             {formData.job_change_reasons.includes("Other reason (s), please specify") && (
              <FloatingInput
                id="otherJobChangeReason"
                value={otherJobChangeReason}
                onChange={(e) => setOtherJobChangeReason(e.target.value.trimStart())}
                label="Please specify"
              />
            )}
          </div>
           <FloatingSelect
            id="job_level_first"
            value={formData.job_level_first || ""}
            onChange={(e) =>
              setFormData({ ...formData, job_level_first: e.target.value })
            }
            label="Job Level Position - First Job"
            options={JOB_LEVEL_OPTIONS_FIRST}
          />
          <FloatingSelect
            id="job_level_current"
            value={formData.job_level_current || ""}
            onChange={(e) =>
              setFormData({ ...formData, job_level_current: e.target.value })
            }
            label="Job Level Position - Current Job"
            options={JOB_LEVEL_OPTIONS_CURRENT}
          />
          <FloatingInput
            id="first_job_salary"
            type="number"
            value={formData.first_job_salary || ""}
            onChange={(e) =>
              setFormData({ ...formData, first_job_salary: e.target.value })
            }
            label="What are your initial gross monthly earning in your first job after college? (PhP)"
          />
          <div className="flex gap-4 mb-4">
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
              Was the curriculum you had in college relevant to your first job?
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
              Was the curriculum you had in college related to your second job (if any)?
            </label>
          </div>
           <div className="mb-4">
            <label
              className={`block mb-2 text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              If yes, what competencies learned in college did you find very useful in your job? (You may select multiple answers)
            </label>
            <div className="flex flex-wrap gap-2">
              {USEFUL_COMPETENCIES.map((competency) => (
                <label
                  key={competency}
                  className={`px-2 py-1 border rounded cursor-pointer transition-colors ${
                    formData.useful_competencies.includes(competency)
                      ? "bg-blue-600 text-white border-blue-600"
                      : isDark
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={competency}
                    checked={formData.useful_competencies.includes(competency)}
                    onChange={() => handleArrayChange("useful_competencies", competency, setOtherUsefulCompetency)}
                    className="hidden"
                  />
                  {competency}
                </label>
              ))}
            </div>
            {formData.useful_competencies.includes("Other skills, please specify") && (
              <FloatingInput
                id="otherUsefulCompetency"
                value={otherUsefulCompetency}
                onChange={(e) => setOtherUsefulCompetency(e.target.value.trimStart())}
                label="Please specify"
              />
            )}
           </div>
           <FloatingInput
            id="curriculum_improvement_suggestions"
            value={formData.curriculum_improvement_suggestions || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                curriculum_improvement_suggestions: e.target.value,
              })
            }
            label="List down suggestions to further improve your course curriculum"
          />
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
            "Other reason(s), please specify"
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
