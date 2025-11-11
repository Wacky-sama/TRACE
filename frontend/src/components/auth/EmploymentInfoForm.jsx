/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { EMPLOYED_STATUSES, NON_EMPLOYED_STATUSES, NON_EMPLOYED_REASONS, PLACE_OF_WORK_OPTIONS, EMPLOYMENT_NOW_OPTIONS, OCCUPATION_OPTIONS } from "../../data/GTS/contants"; 
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

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

  const capitalizeEachWord = (str) =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

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
        formData.nonEmployedReasons.includes("Other reason(s), please specify") &&
        !otherNonEmployedReason.trim()
      ) {
        newErrors.otherNonEmployedReason = "Please specify your reason.";
      }
    }

    if (formData.employmentNow === "Never Employed") {
      if (formData.employmentStatus !== "Never Employed") {
        newErrors.employmentStatus = "Invalid status for Never Employed.";
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
      toast.error("Oops! Please check the form for errors and try again.");
      return;
    }

    setSubmitting(true);

    const finalNonEmployedReasons = formData.nonEmployedReasons.map((r) =>
      r === "Other reasons, please specify"
        ? otherNonEmployedReason.trim()
        : r.trim()
    );

    const finalOccupations = formData.occupation.map((o) =>
      o === "Others, please specify" ? otherOccupation.trim() : o.trim()
    );

    try {
      await handleRegister(finalNonEmployedReasons, finalOccupations);

      setFormData({});
      setOtherNonEmployedReason("");
      setOtherOccupation("");

      toast.success("Registration submitted successfully! Redirecting to login page...");

      setTimeout(() => {
        navigate("/alumni-login");
      }, 2000);
    } catch (error) {
      setSubmitting(false);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "Registration failed! Please check your information and try again."
        );
      }
    }
  };

  useEffect(() => {
    setFormData((prev) => {
      const updated = { ...prev };

      if (prev.employmentNow === "Yes") {
        if (
          NON_EMPLOYED_STATUSES.includes(prev.employmentStatus) ||
          prev.employmentStatus === "Never Employed"
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

      if (prev.employmentNow === "Never Employed") {
        updated.employmentStatus = "Never Employed";
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
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } p-6 rounded-lg shadow-md transition-all duration-500`}
    >
      <h2 className="pb-2 mb-4 text-xl font-semibold border-b">
        Employment Information
      </h2>
      <FloatingSelect
        id="employmentNow"
        label="Are you currently employed?"
        value={formData.employmentNow}
        onChange={(e) =>
          setFormData({ ...formData, employmentNow: e.target.value })
        }
        options={EMPLOYMENT_NOW_OPTIONS}
        error={errors.employmentNow}
        darkMode={isDark}
      />

      <AnimatePresence mode="wait">
        {/* If “Yes” */}
        {formData.employmentNow === "Yes" && (
          <motion.div
            key="employment-yes"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.4, ease: "easeInOut" },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            className="overflow-hidden"
          >
            <motion.div
              layout
              className={`p-4 mt-4 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-50"
              } shadow-inner overflow-y-auto`}
              style={{
                maxHeight: "600px",
                transition: "max-height 0.4s ease-in-out",
              }}
            >
              <h3
                className={`mb-2 text-sm font-semibold ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Employment Details
              </h3>

              {/* Status and Place */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingSelect
                  id="employmentStatus"
                  label="Employment Status"
                  value={formData.employmentStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employmentStatus: e.target.value,
                    })
                  }
                  error={errors.employmentStatus}
                  options={EMPLOYED_STATUSES}
                  darkMode={isDark}
                />

                <FloatingSelect
                  id="placeOfWork"
                  label="Place of Work"
                  value={formData.placeOfWork}
                  onChange={(e) =>
                    setFormData({ ...formData, placeOfWork: e.target.value })
                  }
                  error={errors.placeOfWork}
                  options={PLACE_OF_WORK_OPTIONS}
                  darkMode={isDark}
                />
              </div>

              {/* Company info */}
              <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                <FloatingInput
                  id="companyName"
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: capitalizeEachWord(e.target.value) })
                  }
                  error={errors.companyName}
                  darkMode={isDark}
                />

                <FloatingInput
                  id="companyAddress"
                  label="Company Address"
                  value={formData.companyAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, companyAddress:  capitalizeEachWord(e.target.value) })
                  }
                  error={errors.companyAddress}
                  darkMode={isDark}
                />
              </div>

              {/* Occupation Section */}
              <div className="mt-6">
                <h3
                  className={`mb-2 text-sm font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Present Occupation
                </h3>
                <div className="flex flex-wrap gap-1 occupation-grid">
                  {OCCUPATION_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className={`px-2 py-1 text-sm rounded border cursor-pointer ${
                        formData.occupation.includes(option)
                          ? "bg-blue-500 text-white border-blue-600"
                          : isDark
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-gray-100 border-gray-300 text-gray-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={formData.occupation.includes(option)}
                        onChange={() => handleOccupationChange(option)}
                        className="hidden"
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {formData.occupation.includes("Others, please specify") && (
                  <FloatingInput
                    id="otherOccupation"
                    label="Please specify"
                    value={otherOccupation}
                    onChange={(e) => setOtherOccupation(e.target.value)}
                    error={errors.otherOccupation}
                    darkMode={isDark}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* If “No” */}
        {formData.employmentNow === "No" && (
          <motion.div
            key="employment-no"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.4, ease: "easeInOut" },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            className="overflow-hidden"
          >
            <motion.div
              layout
              className={`p-4 mt-4 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-50"
              } shadow-inner overflow-y-auto`}
              style={{
                maxHeight: "400px",
                transition: "max-height 0.4s ease-in-out",
              }}
            >
              <h3
                className={`mb-2 text-sm font-semibold ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Reason for Not Being Employed
              </h3>
              <div className="flex flex-wrap gap-1">
                {NON_EMPLOYED_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`px-2 py-1 text-sm rounded border cursor-pointer ${
                      formData.nonEmployedReasons.includes(reason)
                        ? "bg-blue-500 text-white border-blue-600"
                        : isDark
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-100 border-gray-300 text-gray-800"
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
                  label="Please specify"
                  value={otherNonEmployedReason}
                  onChange={(e) => setOtherNonEmployedReason(e.target.value)}
                  error={errors.otherNonEmployedReason}
                  darkMode={isDark}
                />
              )}
            </motion.div>
          </motion.div>
        )}

        {/* If “Never Employed” */}
        {formData.employmentNow === "Never Employed" && (
          <motion.div
            key="employment-never"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.4, ease: "easeInOut" },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            className="overflow-hidden"
          >
            <motion.div
              layout
              className={`p-4 mt-4 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-50"
              } shadow-inner`}
            >
              <h3
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                You indicated that you have never been employed.
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                This information helps the Graduate Tracer Study identify
                first-time job seekers and analyze employability trends.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Back & Register Buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={submitting}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-300 border ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600"
              : "bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-400"
          }`}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className={`px-8 py-2 rounded-md font-medium transition-all duration-300 ${
            submitting
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default EmploymentInfoForm;
