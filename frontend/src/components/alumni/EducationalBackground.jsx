// B. EDUCATIONAL BACKGROUND
import { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import AlumniFloatingDatePicker from "../common/AlumniFloatingDatePicker";

const ADVANCE_DEGREE_PROGRAMS = [
  "High Grades in the course or subject area (s) related to the course",
  "Influence of parents or relatives",
  "Peer Influence",
  "Inspired by a role model",
  "Strong passion for the profession",
  "Prospect for immediate employment",
  "Status or prestige of the profession",
  "Availability of course offering in chosen institution",
  "Prospect of career advancement",
  "Affordable for the family",
  "Prospect of attractive compensation",
  "Opportunity for employment abroad",
  "No particular choice or no better idea",
  "For promotion",
  "For professional development",
  "Others, please specify",
];

const EducationalBackground = ({ gtsData, onUpdate }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    degree: gtsData.degree || "",
    specialization: gtsData.specialization || "",
    year_graduated: gtsData.year_graduated || "",
    honors: gtsData.honors || "",
    exams: Array.isArray(gtsData.exams) ? gtsData.exams : [],
    pursued_advance_degree: gtsData.pursued_advance_degree || false,
    pursued_advance_degree_reasons:
      gtsData.pursued_advance_degree_reasons || [],
  });

  const [otherReason, setOtherReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleExamChange = (index, field, value) => {
    const updatedExams = [...formData.exams];
    updatedExams[index][field] = value;
    setFormData((prev) => ({ ...prev, exams: updatedExams }));
  };

  const addExamRow = () => {
    setFormData((prev) => ({
      ...prev,
      exams: [...prev.exams, { name: "", date: "", rating: "" }],
    }));
  };

  const removeExamRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      exams: prev.exams.filter((_, i) => i !== index),
    }));
  };

  const handleReasonChange = (reason) => {
    setFormData((prev) => {
      const exists = prev.pursued_advance_degree_reasons.includes(reason);
      const updated = exists
        ? prev.pursued_advance_degree_reasons.filter((r) => r !== reason)
        : [...prev.pursued_advance_degree_reasons, reason];
      return { ...prev, pursued_advance_degree_reasons: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);

    const submitData = {
      ...formData,
      year_graduated: formData.year_graduated
        ? parseInt(formData.year_graduated)
        : null,
      exams: formData.exams.filter(
        (exam) => exam.name || exam.date || exam.rating
      ),
      pursued_advance_degree_reasons: [
        ...formData.pursued_advance_degree_reasons.filter(
          (r) => r !== "Others, please specify"
        ),
        ...(otherReason ? [`Others: ${otherReason}`] : []),
      ],
    };

    const result = await onUpdate("educational", submitData);
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
        Educational Background
      </h2>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium">
          Educational Attainment (Baccalaureate Degree Only)
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FloatingInput
            id="degree"
            type="text"
            label="Degree"
            value={formData.degree}
            onChange={handleChange}
            readOnly
          />
          <FloatingInput
            id="specialization"
            type="text"
            label="Specialization/Major Field of Study"
            value={formData.specialization}
            onChange={handleChange}
          />

          <div className="w-full">
            <AlumniFloatingDatePicker
              id="year_graduated"
              label="Year Graduated"
              value={
                formData.year_graduated
                  ? `${formData.year_graduated}-01-01`
                  : ""
              }
              onChange={(date) => {
                const year = date ? new Date(date).getFullYear() : "";
                setFormData((prev) => ({ ...prev, year_graduated: year }));
              }}
              yearOnly
              className="w-full"
            />
          </div>

          <FloatingInput
            id="honors"
            type="text"
            label="Honors/Awards Received"
            value={formData.honors}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium">
          Professional Examination(s) Passed
        </h3>
        <table className="w-full border border-collapse border-gray-300">
          <thead>
            <tr className={isDark ? "bg-gray-700" : "bg-gray-100"}>
              <th className="p-2 border border-gray-300">
                Name of Examination
              </th>
              <th className="p-2 border border-gray-300">Date Taken</th>
              <th className="p-2 border border-gray-300">Rating</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.exams.map((exam, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    value={exam.name}
                    onChange={(e) =>
                      handleExamChange(index, "name", e.target.value)
                    }
                    className="w-full p-1"
                    placeholder="e.g., Licensure Exam"
                  />
                </td>
                <td className="p-2 text-center align-middle border border-gray-300">
                  <div className="flex justify-center">
                    <div className="w-30">
                      <AlumniFloatingDatePicker
                        id={`exam_date_${index}`}
                        label="Date Taken"
                        value={exam.date ? exam.date : ""}
                        onChange={(date) =>
                          handleExamChange(index, "date", date)
                        }
                      />
                    </div>
                  </div>
                </td>

                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    value={exam.rating}
                    onChange={(e) =>
                      handleExamChange(index, "rating", e.target.value)
                    }
                    className="w-full p-1"
                    placeholder="e.g., 85%"
                  />
                </td>
                <td className="p-2 text-center border border-gray-300">
                  <button
                    type="button"
                    onClick={() => removeExamRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addExamRow}
          className="px-4 py-2 mt-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Add Examination
        </button>
      </div>

      <FloatingSelect
        id="pursued_advance_degree"
        label="Have you pursued advance degree program?"
        value={formData.pursued_advance_degree ? "Yes" : "No"}
        onChange={(e) =>
          setFormData({
            ...formData,
            pursued_advance_degree: e.target.value === "Yes",
          })
        }
        options={["Yes", "No"]}
      />

      {formData.pursued_advance_degree && (
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-medium">
            If yes, why? (You may select multiple answers)
          </h3>
          <div className="flex flex-wrap gap-2">
            {ADVANCE_DEGREE_PROGRAMS.map((reason) => (
              <label
                key={reason}
                className={`px-2 py-1 border rounded cursor-pointer transition-colors ${
                  formData.pursued_advance_degree_reasons.includes(reason)
                    ? "bg-blue-600 text-white border-blue-600"
                    : isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  value={reason}
                  checked={formData.pursued_advance_degree_reasons.includes(
                    reason
                  )}
                  onChange={() => handleReasonChange(reason)}
                  className="hidden"
                />
                {reason}
              </label>
            ))}
          </div>

          {formData.pursued_advance_degree_reasons.includes(
            "Others, please specify"
          ) && (
            <FloatingInput
              id="otherReason"
              label="Please specify others"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          )}
        </div>
      )}

       <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center sm:justify-end">
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
      </div>

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

export default EducationalBackground;
