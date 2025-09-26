import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

function PersonalInfoForm({ formData, setFormData, nextStep }) {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (formData.birthday) {
      const today = new Date();
      const birthDate = new Date(formData.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData(formData => ({ ...formData, age }));
    } else {
      setFormData(formData => ({ ...formData, age: "" }));
    }
  }, [formData.birthday, setFormData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.registerIdentifier?.trim()) newErrors.registerIdentifier = "Username required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name required";
    if (!formData.firstName?.trim()) newErrors.firstName = "First name required";
    if (!formData.birthday) newErrors.birthday = "Birthday required";
    if (!formData.sex) newErrors.sex = "Sex is required";
    if (!formData.presentAddress?.trim()) newErrors.presentAddress = "Present address required";
    if (!formData.permanentAddress?.trim()) newErrors.permanentAddress = "Permanent address required";
    if (!formData.contactNumber?.trim()) newErrors.contactNumber = "Contact number required";
    if (!formData.course) newErrors.course = "Course required";
    if (!formData.batchYear) newErrors.batchYear = "Batch year required";
    if (!formData.registerPassword) newErrors.registerPassword = "Password required";
    if (!formData.registerConfirmPassword) newErrors.registerConfirmPassword = "Confirm Password required";
    if (formData.registerPassword !== formData.registerConfirmPassword)
      newErrors.registerConfirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setFormData(prev => ({
        ...prev,
        email: prev.email?.trim() || '',
        registerIdentifier: prev.registerIdentifier?.trim() || '',
        lastName: prev.lastName?.trim() || '',
        firstName: prev.firstName?.trim() || '',
        middleInitial: prev.middleInitial?.trim() || '',
        nameExtension: prev.nameExtension?.trim() || '',
        presentAddress: prev.presentAddress?.trim() || '',
        permanentAddress: prev.permanentAddress?.trim() || '',
      }));
      nextStep();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
        Personal Information
      </h2>

      {/* Account Info Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FloatingInput
            id="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            label="Email"
            error={errors.email}
          />
          <FloatingInput
            id="registerIdentifier"
            value={formData.registerIdentifier}
            onChange={e => setFormData({ ...formData, registerIdentifier: e.target.value })}
            label="Username"
            error={errors.registerIdentifier}
          />
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FloatingInput
            id="lastName"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            label="Last Name"
            error={errors.lastName}
          />
          <FloatingInput
            id="firstName"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            label="First Name"
            error={errors.firstName}
          />
          <FloatingInput
            id="middleInitial"
            value={formData.middleInitial || ""}
            onChange={e => setFormData({ ...formData, middleInitial: e.target.value })}
            label="Middle Initial"
            error={errors.middleInitial}
          />
        </div>

        <FloatingSelect
          id="nameExtension"
          value={formData.nameExtension || ""}
          onChange={e => setFormData({ ...formData, nameExtension: e.target.value })}
          label="Name Extension (e.g., Jr., Sr., III)"
          placeholder="None"
          error={errors.nameExtension}
          options={["Jr.", "Sr.", "II", "III", "IV", "V"]}
        />
      </div>

      {/* Birthday & Demographics Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
            <DatePicker
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
              minDate={new Date(1900, 0, 1)}
              selected={formData.birthday ? new Date(formData.birthday) : null}
              onChange={date => setFormData({ ...formData, birthday: date })}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select your birthday"
              className="w-full p-3 border border-gray-300 rounded-md text-sm"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              yearDropdownItemNumber={200}
              scrollableYearDropdown
              isClearable
            />
            {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}
          </div>

          <FloatingInput 
            id="age" 
            type="number" 
            value={formData.age || ""} 
            label="Age" 
            readOnly 
          />
      
          <FloatingSelect
            id="sex"
            value={formData.sex || ""}
            onChange={e => setFormData({ ...formData, sex: e.target.value })}
            label="Sex"
            error={errors.sex}
            options={["Male", "Female"]}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FloatingInput
            id="presentAddress"
            value={formData.presentAddress}
            onChange={e => setFormData({ ...formData, presentAddress: e.target.value })}
            label="Present Address"
            error={errors.presentAddress}
          />
          <FloatingInput
            id="permanentAddress"
            value={formData.permanentAddress}
            onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })}
            label="Permanent Address"
            error={errors.permanentAddress}
          />
        </div>

        <FloatingInput
          id="contactNumber"
          type="tel"
          value={formData.contactNumber || ""}
          onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
          label="Contact Number"
          error={errors.contactNumber}
        />
      </div>

      {/* Academic Info Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FloatingSelect
            id="course"
            value={formData.course}
            onChange={e => setFormData({ ...formData, course: e.target.value })}
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
            onChange={e => setFormData({ ...formData, batchYear: e.target.value })}
            label="Batch Year"
            error={errors.batchYear}
            options={Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, i) =>
              (new Date().getFullYear() - i).toString()
            )}
          />
        </div>
      </div>

      {/* Password Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FloatingInput
            id="registerPassword"
            type={showPassword ? "text" : "password"}
            value={formData.registerPassword}
            onChange={e => setFormData({ ...formData, registerPassword: e.target.value })}
            label="Password"
            error={errors.registerPassword}
          >
            <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </FloatingInput>

          <FloatingInput
            id="registerConfirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.registerConfirmPassword}
            onChange={e => setFormData({ ...formData, registerConfirmPassword: e.target.value })}
            label="Confirm Password"
            error={errors.registerConfirmPassword}
          >
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer">
              <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
            </span>
          </FloatingInput>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition mt-6"
      >
        Next
      </button>
    </div>
  );
}

export default PersonalInfoForm;