// B. EDUCATIONAL BACKGROUND
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { ADVANCE_DEGREE_PROGRAMS } from "../../data/GTS/constants";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import AlumniFloatingDatePicker from "../common/AlumniFloatingDatePicker";
import toast from "react-hot-toast";

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

  const removeExamRow = async (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this examination? This action cannot be undone."
    );
    if (!confirmed) return;

    const updatedExams = formData.exams.filter((_, i) => i !== index);
    const removedExam = formData.exams[index];
    setFormData((prev) => ({ ...prev, exams: updatedExams }));

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        exams: updatedExams.filter(
          (exam) => exam.name?.trim() || exam.date || exam.rating?.trim()
        ),
        pursued_advance_degree_reasons: [
          ...formData.pursued_advance_degree_reasons.filter(
            (r) => r !== "Others, please specify"
          ),
          ...(otherReason?.trim() ? [`Others: ${otherReason.trim()}`] : []),
        ],
      };

      const result = await onUpdate("educational", gtsData.id, submitData);
      if (result.success) {
        toast.success("Examination removed successfully!");
        if (result.data) {
          setFormData({
            degree: result.data.degree || "",
            specialization: result.data.specialization || "",
            year_graduated: result.data.year_graduated || "",
            honors: result.data.honors || "",
            exams: Array.isArray(result.data.exams) ? result.data.exams : [],
            pursued_advance_degree: result.data.pursued_advance_degree || false,
            pursued_advance_degree_reasons:
              result.data.pursued_advance_degree_reasons || [],
          });
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          exams: [...updatedExams, removedExam],
        }));
        toast.error("Failed to remove examination. Please try again.");
      }
    } catch (error) {
      console.error("Remove error:", error);
      setFormData((prev) => ({
        ...prev,
        exams: [...updatedExams, removedExam],
      }));
      toast.error("An error occurred while removing the examination.");
    } finally {
      setSaving(false);
    }
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
    if (
      formData.year_graduated &&
      (formData.year_graduated < 1900 || formData.year_graduated > 2100)
    ) {
      toast.error("Year graduated must be between 1900 and 2100.");
      return;
    }

    setSaving(true);

    const submitData = {
      ...formData,
      year_graduated: formData.year_graduated
        ? parseInt(formData.year_graduated, 10)
        : null,
      exams: formData.exams.filter(
        (exam) => exam.name?.trim() || exam.date || exam.rating?.trim()
      ),
      pursued_advance_degree_reasons: [
        ...formData.pursued_advance_degree_reasons.filter(
          (r) => r !== "Others, please specify"
        ),
        ...(otherReason?.trim() ? [`Others: ${otherReason.trim()}`] : []),
      ],
    };

    try {
      const result = await onUpdate("educational", gtsData.id, submitData);
      if (result.success) {
        toast.success("Saved successfully!");
        if (result.data) {
          setFormData({
            degree: result.data.degree || "",
            specialization: result.data.specialization || "",
            year_graduated: result.data.year_graduated || "",
            honors: result.data.honors || "",
            exams: Array.isArray(result.data.exams) ? result.data.exams : [],
            pursued_advance_degree: result.data.pursued_advance_degree || false,
            pursued_advance_degree_reasons:
              result.data.pursued_advance_degree_reasons || [],
          });
        }
      } else {
        toast.error("Update failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`p-4 sm:p-6 rounded-lg shadow transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Educational Attainment */}
      <section className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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
      </section>

      {/* Exams Table */}
      <section className="mb-6">
        <h3 className="mb-2 text-base font-medium sm:text-lg">
          Professional Examination(s) Passed
        </h3>
        <div className="overflow-x-auto border border-gray-300 rounded-md dark:border-gray-700">
          <table className="min-w-[600px] w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-100"}>
                <th className="p-2 border border-gray-300">Name</th>
                <th className="p-2 border border-gray-300">Date Taken</th>
                <th className="p-2 border border-gray-300">Rating</th>
                <th className="p-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.exams.map((exam, index) => (
                <tr key={index} className="text-sm sm:text-base">
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={exam.name}
                      onChange={(e) =>
                        handleExamChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 bg-transparent border border-gray-300 rounded dark:border-gray-600"
                      placeholder="e.g., Licensure Exam"
                    />
                  </td>
                  <td className="p-2 text-center border border-gray-300">
                    <AlumniFloatingDatePicker
                      id={`exam_date_${index}`}
                      label="Date"
                      value={exam.date || ""}
                      onChange={(date) => handleExamChange(index, "date", date)}
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      value={exam.rating}
                      onChange={(e) =>
                        handleExamChange(index, "rating", e.target.value)
                      }
                      className="w-full p-2 bg-transparent border border-gray-300 rounded dark:border-gray-600"
                      placeholder="e.g., 85%"
                    />
                  </td>
                  <td className="p-2 text-center border border-gray-300">
                    <button
                      onClick={() => removeExamRow(index)}
                      className="text-sm text-red-500 hover:text-red-700 sm:text-base"
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addExamRow}
          className="w-full px-4 py-2 mt-3 text-sm text-white bg-green-600 rounded sm:text-base hover:bg-green-700 sm:w-auto"
        >
          Add Examination
        </button>
      </section>

      {/* Pursued Advance Degree */}
      <section>
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
          <div className="mt-4">
            <h3 className="mb-2 text-base font-medium sm:text-lg">
              If yes, why? (You may select multiple answers)
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {ADVANCE_DEGREE_PROGRAMS.map((reason) => (
                <label
                  key={reason}
                  className={`text-center px-2 py-2 border rounded cursor-pointer text-sm transition-colors ${
                    formData.pursued_advance_degree_reasons.includes(reason)
                      ? "bg-blue-600 text-white border-blue-600"
                      : isDark
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-100"
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
              <div className="mt-4">
                <FloatingInput
                  id="otherReason"
                  label="Please specify others"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Save Button */}
      <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded-md font-medium transition-colors w-full sm:w-auto ${
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
    </div>
  );
};

export default EducationalBackground;
