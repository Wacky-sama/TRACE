import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AlumniFloatingDatePicker from "../common/AlumniFloatingDatePicker";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import UsernameInput from "../UsernameInput";

function PersonalInfoForm({ formData, setFormData, nextStep }) {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    if (formData.birthday) {
      const today = new Date();
      const birthDate = new Date(formData.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData((formData) => ({ ...formData, age }));
    } else {
      setFormData((formData) => ({ ...formData, age: "" }));
    }
  }, [formData.birthday, setFormData]);

  const validate = () => {
    const validateErrors = {};
    if (!formData.email?.trim()) validateErrors.email = "Email is required";
    if (!formData.registerIdentifier?.trim())
      validateErrors.registerIdentifier = "Username is required";
    else if (usernameAvailable === false)
      validateErrors.registerIdentifier = "Username is already taken";
    if (!formData.lastName?.trim())
      validateErrors.lastName = "Last name is required";
    if (!formData.firstName?.trim())
      validateErrors.firstName = "First name is required";
    if (!formData.birthday) validateErrors.birthday = "Birthday is required";
    if (!formData.sex) validateErrors.sex = "Sex is required";
    if (!formData.presentAddress?.trim())
      validateErrors.presentAddress = "Present address is required";
    if (!formData.permanentAddress?.trim())
      validateErrors.permanentAddress = "Permanent address is required";
    if (!formData.contactNumber?.trim())
      validateErrors.contactNumber = "Contact number is required";
    if (!formData.course) validateErrors.course = "Course is required";
    if (!formData.batchYear)
      validateErrors.batchYear = "Batch year is required";
    if (!formData.registerPassword)
      validateErrors.registerPassword = "Password is required";
    if (!formData.registerConfirmPassword)
      validateErrors.registerConfirmPassword = "Confirm Password is required";
    if (
      formData.registerPassword &&
      formData.registerConfirmPassword &&
      formData.registerPassword !== formData.registerConfirmPassword
    ) {
      validateErrors.registerConfirmPassword = "Passwords do not match";
    }
    setErrors(validateErrors);
    return Object.keys(validateErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email?.trim() || "",
        registerIdentifier: prev.registerIdentifier?.trim() || "",
        lastName: prev.lastName?.trim() || "",
        firstName: prev.firstName?.trim() || "",
        middleInitial: prev.middleInitial?.trim() || "",
        nameExtension: prev.nameExtension?.trim() || "",
        presentAddress: prev.presentAddress?.trim() || "",
        permanentAddress: prev.permanentAddress?.trim() || "",
      }));
      nextStep();
    }
  };

  return (
    <div className="space-4">
      <h2 className="pb-2 mb-4 text-xl font-semibold border-b ">
        Personal Information
      </h2>

      <div className="space-2">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FloatingInput
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            label="Email"
            error={errors.email}
          />
          <UsernameInput
            id="registerIdentifier"
            value={formData.registerIdentifier}
            onChange={(e) =>
              setFormData({ ...formData, registerIdentifier: e.target.value })
            }
            error={errors.registerIdentifier}
            onAvailabilityChange={setUsernameAvailable}
          />
        </div>
      </div>

      <div className="space-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FloatingInput
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            label="Last Name"
            error={errors.lastName}
          />
          <FloatingInput
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            label="First Name"
            error={errors.firstName}
          />
          <FloatingInput
            id="middleInitial"
            value={formData.middleInitial || ""}
            onChange={(e) =>
              setFormData({ ...formData, middleInitial: e.target.value })
            }
            label="Middle Initial"
            error={errors.middleInitial}
          />
        </div>

        <FloatingSelect
          id="nameExtension"
          value={formData.nameExtension || ""}
          onChange={(e) =>
            setFormData({ ...formData, nameExtension: e.target.value })
          }
          label="Name Extension (e.g., Jr., Sr., III)"
          placeholder="None"
          error={errors.nameExtension}
          options={["Jr.", "Sr.", "II", "III", "IV", "V"]}
        />
      </div>

      <div className="space-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <AlumniFloatingDatePicker
            id="birthday"
            value={formData.birthday}
            onChange={(date) =>
              setFormData({ ...formData, birthday: date || null })
            }
            label="Birthday"
            error={errors.birthday}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            }
            minDate={new Date(1900, 0, 1)}
          />

          <FloatingInput
            id="age"
            type="number"
            value={formData.age || ""}
            label="Age"
            readOnly
          />
        </div>
      </div>

      <FloatingSelect
        id="sex"
        value={formData.sex || ""}
        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
        label="Sex"
        error={errors.sex}
        options={["Male", "Female"]}
      />

      <div className="space-2">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FloatingInput
            id="presentAddress"
            value={formData.presentAddress}
            onChange={(e) =>
              setFormData({ ...formData, presentAddress: e.target.value })
            }
            label="Present Address"
            error={errors.presentAddress}
          />
          <FloatingInput
            id="permanentAddress"
            value={formData.permanentAddress}
            onChange={(e) =>
              setFormData({ ...formData, permanentAddress: e.target.value })
            }
            label="Permanent Address"
            error={errors.permanentAddress}
          />
        </div>

        <FloatingInput
          id="contactNumber"
          type="tel"
          value={formData.contactNumber || ""}
          onChange={(e) =>
            setFormData({ ...formData, contactNumber: e.target.value })
          }
          label="Contact Number"
          error={errors.contactNumber}
        />
      </div>

      <div className="space-2">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FloatingSelect
            id="course"
            value={formData.course}
            onChange={(e) =>
              setFormData({ ...formData, course: e.target.value })
            }
            label="Course"
            error={errors.course}
            options={[
              "BACHELOR OF SCIENCE IN AGRICULTURE",
              "BACHELOR OF SCIENCE IN ACCOUNTING INFORMATION SYSTEM",
              "BACHELOR OF SCIENCE IN CRIMINOLOGY",
              "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT",
              "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
              "BACHELOR OF ELEMENTARY EDUCATION",
              "BACHELOR OF SECONDARY EDUCATION",
            ]}
          />
          <FloatingSelect
            id="batchYear"
            value={formData.batchYear}
            onChange={(e) =>
              setFormData({ ...formData, batchYear: e.target.value })
            }
            label="Batch Year"
            error={errors.batchYear}
            options={Array.from(
              { length: new Date().getFullYear() - 1950 + 1 },
              (_, i) => (new Date().getFullYear() - i).toString()
            )}
          />
        </div>
      </div>

      <div className="space-2">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FloatingInput
            id="registerPassword"
            type={showPassword ? "text" : "password"}
            value={formData.registerPassword}
            onChange={(e) =>
              setFormData({ ...formData, registerPassword: e.target.value })
            }
            label="Password"
            error={errors.registerPassword}
          >
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </FloatingInput>

          <FloatingInput
            id="registerConfirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.registerConfirmPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                registerConfirmPassword: e.target.value,
              })
            }
            label="Confirm Password"
            error={errors.registerConfirmPassword}
          >
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer"
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
              />
            </span>
          </FloatingInput>
        </div>

        {formData.registerPassword && formData.registerConfirmPassword && (
          <p
            className={`text-sm mt-1 ${
              formData.registerPassword === formData.registerConfirmPassword
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formData.registerPassword === formData.registerConfirmPassword
              ? "Passwords match"
              : "Passwords do not match"}
          </p>
        )}
      </div>

      <button
        onClick={handleNext}
        className="w-full py-3 mt-6 font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  );
}

export default PersonalInfoForm;
