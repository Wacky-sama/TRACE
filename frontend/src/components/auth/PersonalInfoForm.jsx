import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { isValidPhoneNumber } from "libphonenumber-js";
import AlumniFloatingDatePicker from "../common/AlumniFloatingDatePicker";
import {
  isStrongPassword,
  getPasswordStrength,
  getPasswordStrengthMessage,
} from "../../utils/passwordUtils";
import phProvincesCities from "../../data/phProvincesCities.json";
import PhoneInput from "../PhoneInput";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import EmailInput from "../EmailInput";
import UsernameInput from "../UsernameInput";

function PersonalInfoForm({ formData, setFormData, nextStep }) {
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const provinces = Object.keys(phProvincesCities);
  const municipalities =
    phProvincesCities[formData.province] || [];

  useEffect(() => {
    if (formData.registerPassword) {
      setPasswordStrength(getPasswordStrength(formData.registerPassword));
    } else {
      setPasswordStrength({ score: 0, label: "" });
    }
  }, [formData.registerPassword]);

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

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const validate = () => {
    const validateErrors = {};

    if (!formData.email?.trim()) validateErrors.email = "Email is required";
    else if (emailAvailable === false)
      validateErrors.email = "Email is already taken";

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

    if (!formData.presentProvince)
      validateErrors.presentProvince = "Present province is required";
    if (!formData.presentMunicipality)
      validateErrors.presentMunicipality =
        "Present city/municipality is required";
    if (!formData.presentBarangayStreet?.trim())
      validateErrors.presentBarangayStreet =
        "Present barangay/street is required";

    if (!formData.permanentProvince)
      validateErrors.permanentProvince = "Permanent province is required";
    if (!formData.permanentMunicipality)
      validateErrors.permanentMunicipality =
        "Permanent city/municipality is required";
    if (!formData.permanentBarangayStreet?.trim())
      validateErrors.permanentBarangayStreet =
        "Permanent barangay/street is required";

    if (!formData.presentAddress?.trim())
      validateErrors.presentAddress = "Present address is required";

    if (!formData.permanentAddress?.trim())
      validateErrors.permanentAddress = "Permanent address is required";

    if (!formData.contactNumber?.trim()) {
      validateErrors.contactNumber = "Contact number is required";
    } else if (!isValidPhoneNumber(formData.contactNumber)) {
      validateErrors.contactNumber =
        "Please enter a valid phone number (e.g., +63 912 345 6789)";
    }

    if (!formData.course) validateErrors.course = "Course is required";

    if (!formData.batchYear)
      validateErrors.batchYear = "Batch year is required";

    if (!formData.registerPassword)
      validateErrors.registerPassword = "Password is required";
    else if (!isStrongPassword(formData.registerPassword))
      validateErrors.registerPassword = getPasswordStrengthMessage(
        formData.registerPassword
      );

    if (!formData.registerConfirmPassword)
      validateErrors.registerConfirmPassword = "Confirm Password is required";
    else if (!isStrongPassword(formData.registerConfirmPassword))
      validateErrors.registerConfirmPassword = getPasswordStrengthMessage(
        formData.registerConfirmPassword
      );

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
        email: prev.email?.trim().toLowerCase() || "",
        registerIdentifier: prev.registerIdentifier?.trim().toLowerCase() || "",
        lastName: capitalizeFirstLetter(prev.lastName?.trim()),
        firstName: capitalizeFirstLetter(prev.firstName?.trim()),
        middleInitial: capitalizeFirstLetter(prev.middleInitial?.trim()),
        nameExtension: prev.nameExtension?.trim() || "",
        presentAddress: prev.presentAddress?.trim() || "",
        permanentAddress: prev.permanentAddress?.trim() || "",
      }));
      nextStep();
    }
  };

  return (
    <div className="space-4">
      <h2 className="pb-2 mb-4 text-xl font-semibold border-b">
        Personal Information
      </h2>

      <div className="space-2">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <EmailInput
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value.toLowerCase(),
              })
            }
            label="Email"
            error={errors.email}
            onAvailabilityChange={setEmailAvailable}
          />
          <UsernameInput
            id="registerIdentifier"
            value={formData.registerIdentifier}
            onChange={(e) =>
              setFormData({
                ...formData,
                registerIdentifier: e.target.value.toLowerCase(),
              })
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
              setFormData({
                ...formData,
                lastName: capitalizeFirstLetter(e.target.value),
              })
            }
            label="Last Name"
            error={errors.lastName}
          />
          <FloatingInput
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({
                ...formData,
                firstName: capitalizeFirstLetter(e.target.value),
              })
            }
            label="First Name"
            error={errors.firstName}
          />
          <FloatingInput
            id="middleInitial"
            value={formData.middleInitial || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                middleInitial: capitalizeFirstLetter(e.target.value),
              })
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
        {/* PRESENT ADDRESS */}
        <div>
          <h3 className="mb-1 font-medium text-md">Present Address</h3>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <FloatingSelect
              id="presentProvince"
              label="Province"
              value={formData.presentProvince}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  presentProvince: e.target.value,
                  presentMunicipality: "",
                })
              }
              options={Object.keys(phProvincesCities)}
              error={errors.presentProvince}
            />
            <FloatingSelect
              id="presentMunicipality"
              label="City / Municipality"
              value={formData.presentMunicipality}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  presentMunicipality: e.target.value,
                })
              }
              options={
                formData.presentProvince
                  ? phProvincesCities[formData.presentProvince]
                  : []
              }
              error={errors.presentMunicipality}
            />
          </div>
          <FloatingInput
            id="presentBarangayStreet"
            label="Barangay / Street / House No."
            value={formData.presentBarangayStreet}
            onChange={(e) =>
              setFormData({
                ...formData,
                presentBarangayStreet: e.target.value,
              })
            }
            error={errors.presentBarangayStreet}
          />
        </div>

        {/* PERMANENT ADDRESS */}
        <div>
          <h3 className="mb-1 font-medium text-md">Permanent Address</h3>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <FloatingSelect
              id="permanentProvince"
              label="Province"
              value={formData.permanentProvince}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  permanentProvince: e.target.value,
                  permanentMunicipality: "",
                })
              }
              options={Object.keys(phProvincesCities)}
              error={errors.permanentProvince}
            />
            <FloatingSelect
              id="permanentMunicipality"
              label="City / Municipality"
              value={formData.permanentMunicipality}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  permanentMunicipality: e.target.value,
                })
              }
              options={
                formData.permanentProvince
                  ? phProvincesCities[formData.permanentProvince]
                  : []
              }
              error={errors.permanentMunicipality}
            />
          </div>
          <FloatingInput
            id="permanentBarangayStreet"
            label="Barangay / Street / House No."
            value={formData.permanentBarangayStreet}
            onChange={(e) =>
              setFormData({
                ...formData,
                permanentBarangayStreet: e.target.value,
              })
            }
            error={errors.permanentBarangayStreet}
          />
        </div>

        <PhoneInput
          id="contactNumber"
          value={formData.contactNumber || ""}
          onChange={(e) =>
            setFormData({ ...formData, contactNumber: e.target.value })
          }
          label="Contact Number"
          error={errors.contactNumber}
          defaultCountry="ph"
          onError={(error) =>
            setErrors((prev) => ({ ...prev, contactNumber: error }))
          }
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
          {/* Password Field */}
          <FloatingInput
            id="registerPassword"
            type={showPassword ? "text" : "password"}
            value={formData.registerPassword || ""}
            onChange={(e) =>
              setFormData({ ...formData, registerPassword: e.target.value })
            }
            label="Password"
            error={errors.registerPassword}
          >
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </FloatingInput>

          {/* Confirm Password Field */}
          <FloatingInput
            id="registerConfirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.registerConfirmPassword || ""}
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
              className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
              />
            </span>
          </FloatingInput>
        </div>

        {/* Password Strength Bar */}
        {formData.registerPassword && (
          <div className="mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordStrength.score === 0
                    ? "bg-gray-300 w-0"
                    : passwordStrength.score === 1
                    ? "bg-red-500 w-1/4"
                    : passwordStrength.score === 2
                    ? "bg-orange-400 w-2/4"
                    : passwordStrength.score === 3
                    ? "bg-yellow-400 w-3/4"
                    : "bg-green-500 w-full"
                }`}
              />
            </div>
            <p
              className={`text-sm mt-1 ${
                passwordStrength.score <= 2 ? "text-red-500" : "text-green-600"
              }`}
            >
              {passwordStrength.label}
            </p>
          </div>
        )}

        {/* Password Match Message */}
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
