import { useState } from "react";
import toast from "react-hot-toast";
import { isValidPhoneNumber } from "libphonenumber-js";
import { CIVIL_STATUSES_OPTIONS } from "../../data/GTS/constants";
import PhoneInput from "../PhoneInput";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";

const GeneralInformation = ({ gtsData, onUpdate }) => {

  const [formData, setFormData] = useState({
    full_name: gtsData.full_name || "",
    permanent_address: gtsData.permanent_address || "",
    present_address: gtsData.present_address || "",
    contact_email: gtsData.contact_email || "",
    mobile: gtsData.mobile || "",
    civil_status: gtsData.civil_status || "",
    sex: gtsData.sex || "",
    birthday: gtsData.birthday || "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    const validateErrors = {};
    if (!formData.mobile?.trim()) {
      validateErrors.mobile = "Contact number is required";
    } else if (!isValidPhoneNumber(formData.mobile)) {
      validateErrors.mobile =
        "Please enter a valid phone number (e.g., +63 912 345 6789)";
    }
    setErrors(validateErrors);

    if (Object.keys(validateErrors).length > 0) {
      toast.error("Please fix the highlighted errors before saving.");
      return;
    }

    setSaving(true);
    try {
      const result = await onUpdate("personal", gtsData.id, formData);
      if (result.success) {
        toast.success("Saved successfully!");
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
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FloatingInput
          id="full_name"
          type="text"
          label="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          readOnly
        />

        <FloatingInput
          id="contact_email"
          type="email"
          label="E-mail Address"
          value={formData.contact_email}
          onChange={handleChange}
          readOnly
        />

        <FloatingInput
          id="permanent_address"
          type="text"
          label="Permanent Address"
          value={formData.permanent_address}
          onChange={handleChange}
        />

        <FloatingInput
          id="present_address"
          type="text"
          label="Present Address"
          value={formData.present_address}
          onChange={handleChange}
        />

        <FloatingSelect
          id="civil_status"
          value={formData.civil_status}
          label="Civil Status"
          onChange={handleChange}
          options={CIVIL_STATUSES_OPTIONS}
        />

        <FloatingInput 
          id="sex" 
          value={formData.sex} 
          label="Sex" 
          readOnly 
        />

        <FloatingInput
          id="birthday"
          value={formData.birthday}
          label="Birthday"
          readOnly
        />

        <PhoneInput
          id="mobile"
          label="Contact Number"
          value={formData.mobile}
          onChange={handleChange}
          error={errors.mobile}
          defaultCountry="ph"
          onError={(error) =>
            setErrors((prev) => ({ ...prev, mobile: error }))
          }
        />
      </div>

      <div className="flex justify-end mt-8">
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

export default GeneralInformation;