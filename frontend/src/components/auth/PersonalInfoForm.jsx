import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { isValidPhoneNumber } from "libphonenumber-js";
import AlumniFloatingDatePicker from "../common/AlumniFloatingDatePicker";
import {
  getPasswordStrength,
  getPasswordStrengthMessage,
} from "../../utils/passwordUtils";
import phProvincesCities from "../../data/phProvincesCities.json";
import otherCountriesProvincesCities from "../../data/otherCountriesProvincesCities.json";
import { useTheme } from "../../hooks/useTheme";
import FloatingInput from "../FloatingInput";
import FloatingSearchSelect from "../FloatingSearchSelect";
import FloatingSelect from "../FloatingSelect";
import EmailInput from "../EmailInput";
import UsernameInput from "../UsernameInput";
import PhoneNumberInput from "../PhoneNumberInput";
import { COURSES_OPTIONS } from "../../data/GTS/constants";

function PersonalInfoForm({ formData, setFormData, nextStep }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const allCountries = [
    "Philippines",
    ...Object.keys(otherCountriesProvincesCities),
  ].sort((a, b) => a.localeCompare(b));
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [phoneAvailable, setPhoneAvailable] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const capitalizeEachWord = (str) =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const validate = () => {
    const validateErrors = {};

    // EMAIL
    if (!formData.email?.trim()) validateErrors.email = "Email is required";
    else if (emailAvailable === false)
      validateErrors.email = "Email is already taken";

    // USERNAME
    if (!formData.registerIdentifier?.trim())
      validateErrors.registerIdentifier = "Username is required";
    else if (usernameAvailable === false)
      validateErrors.registerIdentifier = "Username is already taken";

    // NAMES
    if (!formData.lastName?.trim())
      validateErrors.lastName = "Last name is required";
    if (!formData.firstName?.trim())
      validateErrors.firstName = "First name is required";

    // BIRTHDAY & AGE
    if (!formData.birthday) validateErrors.birthday = "Birthday is required";
    if (!formData.age) validateErrors.age = "Age is required";

    // SEX
    if (!formData.sex) validateErrors.sex = "Sex is required";

    // ADDRESSES
    const checkAddress = (prefix, country) => {
      if (country === "Philippines") {
        if (!formData[`${prefix}Province`])
          validateErrors[`${prefix}Province`] = "Province is required";
        if (!formData[`${prefix}Municipality`])
          validateErrors[`${prefix}Municipality`] =
            "City/Municipality is required";
        if (!formData[`${prefix}BarangayStreet`]?.trim())
          validateErrors[`${prefix}BarangayStreet`] =
            "Barangay/Street is required";
      } else {
        if (!formData[`${prefix}Province`])
          validateErrors[`${prefix}Province`] = "State/Region is required";
        if (!formData[`${prefix}Municipality`])
          validateErrors[`${prefix}Municipality`] = "City is required";
      }
    };
    checkAddress("present", formData.presentCountry);
    checkAddress("permanent", formData.permanentCountry);

    // CONTACT NUMBER
    if (!formData.contactNumber?.trim()) {
      validateErrors.contactNumber = "Contact number is required";
    } else if (!isValidPhoneNumber(formData.contactNumber)) {
      validateErrors.contactNumber =
        "Please enter a valid phone number (e.g., +63 912 345 6789)";
    } else if (phoneAvailable === false) {
      validateErrors.contactNumber = "Phone number is already registered";
    }

    // COURSE & BATCH
    if (!formData.course) validateErrors.course = "Course is required";
    if (!formData.batchYear)
      validateErrors.batchYear = "Batch year is required";

    // PASSWORDS
    const password = formData.registerPassword;
    const confirm = formData.registerConfirmPassword;

    if (!password) validateErrors.registerPassword = "Password is required";
    else {
      const strength = getPasswordStrength(password);
      if (strength.score < 3) {
        validateErrors.registerPassword = getPasswordStrengthMessage(password);
      }
    }

    if (!confirm)
      validateErrors.registerConfirmPassword = "Confirm Password is required";
    else if (password && password !== confirm) {
      validateErrors.registerConfirmPassword = "Passwords do not match";
    }

    setErrors(validateErrors);
    return Object.keys(validateErrors).length === 0;
  };

  const handleNext = () => {
    const presentFullAddress = [
      formData.presentBarangayStreet?.trim(),
      formData.presentMunicipality?.trim(),
      formData.presentProvince?.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    const permanentFullAddress = [
      formData.permanentBarangayStreet?.trim(),
      formData.permanentMunicipality?.trim(),
      formData.permanentProvince?.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      presentAddress: presentFullAddress,
      permanentAddress: permanentFullAddress,
      email: prev.email?.trim().toLowerCase() || "",
      registerIdentifier: prev.registerIdentifier?.trim().toLowerCase() || "",
      lastName: capitalizeEachWord(prev.lastName?.trim()),
      firstName: capitalizeEachWord(prev.firstName?.trim()),
      middleInitial: capitalizeFirstLetter(prev.middleInitial?.trim()),
      nameExtension: prev.nameExtension?.trim() || "",
    }));

    if (validate()) {
      nextStep();
    }
  };

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } p-4 sm:p-6 lg:p-8 rounded-lg shadow-md max-w-7xl mx-auto w-full`}
    >
      <h2 className="pb-2 mb-6 text-xl font-semibold border-b">
        Personal Information
      </h2>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FloatingInput
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({
                ...formData,
                lastName: capitalizeEachWord(e.target.value),
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
                firstName: capitalizeEachWord(e.target.value),
              })
            }
            label="First Name"
            error={errors.firstName}
          />
          <FloatingInput
            id="middleInitial"
            value={formData.middleInitial || ""}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (/^[A-Z]?$/.test(value)) {
                setFormData({ ...formData, middleInitial: value });
              }
            }}
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
          shortLabel="Name Extension"
          placeholder="None"
          error={errors.nameExtension}
          options={["Jr.", "Sr.", "I", "II", "III", "IV", "V"]}
        />

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <AlumniFloatingDatePicker
            id="birthday"
            label="Birthday"
            value={formData.birthday}
            onChange={(date) =>
              setFormData({ ...formData, birthday: date || null })
            }
            error={errors.birthday}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            }
            minDate={new Date(1900, 0, 1)}
          />
          <FloatingInput
            id="age"
            label="Age"
            type="number"
            value={formData.age || ""}
            error={errors.age}
            readOnly
          />
        </div>

        <FloatingSelect
          id="sex"
          value={formData.sex || ""}
          onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
          label="Sex"
          error={errors.sex}
          options={["Male", "Female"]}
        />

        {/* PERMANENT ADDRESS */}
        <div className="space-y-6">
          <h3
            className={`font-medium text-base ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Permanent Address
          </h3>

          <FloatingSearchSelect
            id="permanentCountry"
            label="Country"
            value={formData.permanentCountry}
            onChange={(e) =>
              setFormData({
                ...formData,
                permanentCountry: e.target.value,
                permanentProvince: "",
                permanentMunicipality: "",
              })
            }
            options={allCountries}
            error={errors.permanentCountry}
          />

          <FloatingSearchSelect
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
            options={
              formData.permanentCountry === "Philippines"
                ? Object.keys(phProvincesCities).sort((a, b) =>
                    a.localeCompare(b)
                  )
                : Object.keys(
                    otherCountriesProvincesCities[formData.permanentCountry] ||
                      []
                  ).sort((a, b) => a.localeCompare(b))
            }
            error={errors.permanentProvince}
          />

          <FloatingSearchSelect
            id="permanentMunicipality"
            label="City / Municipality"
            shortLabel="City"
            value={formData.permanentMunicipality}
            onChange={(e) =>
              setFormData({
                ...formData,
                permanentMunicipality: e.target.value,
              })
            }
            options={
              formData.permanentCountry === "Philippines"
                ? (phProvincesCities[formData.permanentProvince] || []).sort(
                    (a, b) => a.localeCompare(b)
                  )
                : (
                    otherCountriesProvincesCities[formData.permanentCountry]?.[
                      formData.permanentProvince
                    ] || []
                  ).sort((a, b) => a.localeCompare(b))
            }
            error={errors.permanentMunicipality}
          />

          <FloatingInput
            id="permanentBarangayStreet"
            label="Barangay / Street / House No."
            shortLabel="Barangay / Street"
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

        {/* PRESENT ADDRESS */}
        <div className="space-y-6">
          <h3
            className={`font-medium text-base ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Present Address
          </h3>

          <FloatingSearchSelect
            id="presentCountry"
            label="Country"
            value={formData.presentCountry}
            onChange={(e) =>
              setFormData({
                ...formData,
                presentCountry: e.target.value,
                presentProvince: "",
                presentMunicipality: "",
              })
            }
            options={allCountries}
            error={errors.presentCountry}
          />

          <FloatingSearchSelect
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
            options={
              formData.presentCountry === "Philippines"
                ? Object.keys(phProvincesCities).sort((a, b) =>
                    a.localeCompare(b)
                  )
                : Object.keys(
                    otherCountriesProvincesCities[formData.presentCountry] || []
                  ).sort((a, b) => a.localeCompare(b))
            }
            error={errors.presentProvince}
          />

          <FloatingSearchSelect
            id="presentMunicipality"
            label="City / Municipality"
            shortLabel="City"
            value={formData.presentMunicipality}
            onChange={(e) =>
              setFormData({
                ...formData,
                presentMunicipality: e.target.value,
              })
            }
            options={
              formData.presentCountry === "Philippines"
                ? (phProvincesCities[formData.presentProvince] || []).sort(
                    (a, b) => a.localeCompare(b)
                  )
                : (
                    otherCountriesProvincesCities[formData.presentCountry]?.[
                      formData.presentProvince
                    ] || []
                  ).sort((a, b) => a.localeCompare(b))
            }
            error={errors.presentMunicipality}
          />

          <FloatingInput
            id="presentBarangayStreet"
            label="Barangay / Street / House No."
            shortLabel="Barangay / Street"
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

        <PhoneNumberInput
          id="contactNumber"
          value={formData.contactNumber || ""}
          onChange={(e) =>
            setFormData({ ...formData, contactNumber: e.target.value })
          }
          label="Contact Number"
          error={errors.contactNumber}
          defaultCountry="ph"
          checkAvailability={true}
          onAvailabilityChange={setPhoneAvailable}
          onError={(error) =>
            setErrors((prev) => ({ ...prev, contactNumber: error }))
          }
        />

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <FloatingSelect
            id="course"
            value={formData.course}
            onChange={(e) =>
              setFormData({ ...formData, course: e.target.value })
            }
            label="Course"
            error={errors.course}
            options={COURSES_OPTIONS}
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
            darkMode={isDark}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
              className="text-gray-500 cursor-pointer"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </FloatingInput>

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
              className="text-gray-500 cursor-pointer"
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
              />
            </span>
          </FloatingInput>
        </div>

        {formData.registerPassword && (
          <div>
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
              className={`text-sm mt-2 ${
                passwordStrength.score <= 2
                  ? isDark
                    ? "text-red-400"
                    : "text-red-500"
                  : isDark
                  ? "text-green-400"
                  : "text-green-600"
              }`}
            >
              {passwordStrength.label}
            </p>
          </div>
        )}

        {formData.registerPassword && formData.registerConfirmPassword && (
          <p
            className={`text-sm ${
              formData.registerPassword === formData.registerConfirmPassword
                ? isDark
                  ? "text-green-400"
                  : "text-green-600"
                : isDark
                ? "text-red-400"
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
        className={`w-full py-3 mt-8 font-medium rounded-lg transition-colors ${
          isDark
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
}

export default PersonalInfoForm;
