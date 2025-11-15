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
    <div className="space-y-6">
      {/* Educational Attainment */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Educational Attainment</h3>
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
            shortLabel="Specialization"
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
            shortLabel="Honors/Awards"
            value={formData.honors}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Exams - Responsive Cards/Table */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">
          Professional Examination(s) Passed
        </h3>
        
        {/* Mobile: Card Layout */}
        <div className="space-y-4 sm:hidden">
          {formData.exams.map((exam, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                isDark ? "border-gray-700 bg-gray-750" : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="space-y-3">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-500">
                    Examination Name
                  </label>
                  <input
                    type="text"
                    value={exam.name}
                    onChange={(e) =>
                      handleExamChange(index, "name", e.target.value)
                    }
                    className="w-full p-2 bg-transparent border border-gray-300 rounded dark:border-gray-600"
                    placeholder="e.g., Licensure Exam"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-500">
                    Date Taken
                  </label>
                  <AlumniFloatingDatePicker
                    id={`exam_date_${index}`}
                    label=""
                    value={exam.date || ""}
                    onChange={(date) => handleExamChange(index, "date", date)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-500">
                    Rating
                  </label>
                  <input
                    type="text"
                    value={exam.rating}
                    onChange={(e) =>
                      handleExamChange(index, "rating", e.target.value)
                    }
                    className="w-full p-2 bg-transparent border border-gray-300 rounded dark:border-gray-600"
                    placeholder="e.g., 85%"
                  />
                </div>
                
                <button
                  onClick={() => removeExamRow(index)}
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                  disabled={saving}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden overflow-x-auto border border-gray-300 rounded-lg sm:block dark:border-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-100"}>
                <th className="p-3 text-left border-b border-gray-300 dark:border-gray-700">
                  Name
                </th>
                <th className="p-3 text-left border-b border-gray-300 dark:border-gray-700">
                  Date Taken
                </th>
                <th className="p-3 text-left border-b border-gray-300 dark:border-gray-700">
                  Rating
                </th>
                <th className="p-3 text-center border-b border-gray-300 dark:border-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.exams.map((exam, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3">
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
                  <td className="p-3">
                    <AlumniFloatingDatePicker
                      id={`exam_date_${index}`}
                      label=""
                      value={exam.date || ""}
                      onChange={(date) => handleExamChange(index, "date", date)}
                    />
                  </td>
                  <td className="p-3">
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
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeExamRow(index)}
                      className="text-sm font-medium text-red-500 hover:text-red-700"
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
          className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 sm:w-auto"
        >
          Add Examination
        </button>
      </section>

      {/* Pursued Advance Degree */}
      <section>
        <FloatingSelect
          id="pursued_advance_degree"
          label="Have you pursued advance degree program?"
          shortLabel="Pursued Advance Degree?"
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
          <div className="mt-6">
            <h4 className="mb-3 text-base font-medium">
              If yes, why? (You may select multiple answers)
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ADVANCE_DEGREE_PROGRAMS.map((reason) => (
                <label
                  key={reason}
                  className={`px-4 py-3 border rounded-lg cursor-pointer text-sm font-medium transition-all text-center ${
                    formData.pursued_advance_degree_reasons.includes(reason)
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : isDark
                      ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
            saving
              ? "opacity-70 cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EducationalBackground;