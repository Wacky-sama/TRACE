import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PersonalInfoForm from "./PersonalInfoForm";
import EmploymentInfoForm from "./EmploymentInfoForm";

function RegisterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    registerIdentifier: "",
    email: "",
    lastName: "",
    firstName: "",
    middleInitial: "",
    nameExtension: "",
    birthday: null,
    age: "",
    sex: "",
    presentProvince: "",
    presentMunicipality: "",
    presentBarangayStreet: "",
    permanentProvince: "",
    permanentMunicipality: "",
    permanentBarangayStreet: "",
    presentAddress: "",
    permanentAddress: "",
    contactNumber: "",
    course: "",
    batchYear: "",
    registerPassword: "",
    registerConfirmPassword: "",

    // Step 2: Employment Info
    employmentNow: "",
    employmentStatus: "",
    placeOfWork: "",
    companyName: "",
    companyAddress: "",
    occupation: [],
    nonEmployedReasons: [],
    otherNonEmployedReason: "",
  });

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  async function handleRegister(
    finalNonEmployedReasons = formData.nonEmployedReasons,
    finalOccupations = formData.occupation
  ) {
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const presentFullAddress = `${formData.presentBarangayStreet}, 
      ${formData.presentMunicipality}, ${formData.presentProvince}`;
      const permanentFullAddress = `${formData.permanentBarangayStreet}, 
      ${formData.permanentMunicipality}, ${formData.permanentProvince}`;

      // PAYLOAD 1 - Create User
      const userPayload = {
        email: formData.email.trim(),
        username: formData.registerIdentifier.trim(),
        lastname: formData.lastName.trim(),
        firstname: formData.firstName.trim(),
        middle_initial: formData.middleInitial?.trim() || "",
        name_extension: formData.nameExtension?.trim() || "",
        birthday: formData.birthday
          ? new Date(formData.birthday).toISOString().split("T")[0]
          : null,
        sex: formData.sex.trim(),
        present_address: presentFullAddress,
        permanent_address: permanentFullAddress,
        contact_number: formData.contactNumber.trim(),
        course: formData.course.trim(),
        batch_year: parseInt(formData.batchYear.trim()),
        password: formData.registerPassword,
      };

      const userResponse = await api.post(
        "/users/register/alumni",
        userPayload
      );
      const newUserId = userResponse.data.id;

      // PAYLOAD 2 - Create GTS Response
      const gtsResponsePayload = {
        ever_employed:
          formData.employmentNow !== "Never employed"
            ? formData.employmentNow === "Yes"
            : false,

        is_employed: formData.employmentNow === "Yes",

        employment_status: formData.employmentStatus,

        place_of_work:
          formData.employmentNow === "Yes" ? formData.placeOfWork : null,

        company_name:
          formData.employmentNow === "Yes"
            ? formData.companyName?.trim()
            : null,

        company_address:
          formData.employmentNow === "Yes"
            ? formData.companyAddress?.trim()
            : null,

        occupation:
          formData.employmentNow === "Yes" && finalOccupations?.length
            ? finalOccupations
            : null,

        non_employed_reasons:
          formData.employmentNow === "No" && finalNonEmployedReasons?.length
            ? finalNonEmployedReasons
            : null,

        permanent_address: formData.permanentAddress.trim(),
        present_address: formData.presentAddress.trim()
      };

      await api.post(
        `/gts_responses/register/alumni/${newUserId}`,
        gtsResponsePayload
      );

      setRegisterSuccess(
        "Registration submitted successfully! Please wait for approval."
      );
      setTimeout(() => navigate('/alumni-login'), 3000);
    } catch (error) {
      if (error.response?.data) {
        console.error("Server validation error:", error.response.data);
        setRegisterError(
          `Registration failed! ${JSON.stringify(error.response.data, null, 2)}`
        );
      } else {
        setRegisterError(
          `Registration failed! ${error.message ?? "Please try again."}`
        );
      }
    }
  }

  return (
    <div>
      {registerError && (
        <div className="px-4 py-3 mb-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
          {registerError}
        </div>
      )}
      {registerSuccess && (
        <div className="px-4 py-3 mb-4 text-sm text-green-700 border border-green-200 rounded-md bg-green-50">
          {registerSuccess}
        </div>
      )}

      {step === 1 && (
        <PersonalInfoForm
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <EmploymentInfoForm
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          handleRegister={handleRegister}
        />
      )}
    </div>
  );
}

export default RegisterForm;
