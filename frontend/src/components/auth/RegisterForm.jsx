import { useState } from 'react';
import api from '../../services/api';
import PersonalInfoForm from './PersonalInfoForm';
import EmploymentSnapshotForm from './EmploymentSnapshotForm';

function RegisterForm({ setIsRegistering }) {
  const [step, setStep] = useState(1);

  // Toggles + validation
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  const [formData, setFormData] = useState({
    registerIdentifier: '',
    email: '',
    lastName: '',
    firstName: '',
    middleInitial: '',
    nameExtension: '',
    birthday: null,
    age: '',
    presentAddress: '',
    contactNumber: '',
    course: '',
    batchYear: '',
    registerPassword: '',
    registerConfirmPassword: '',
    employmentNow: '',
    status: '',
    placeOfWork: '',
    companyName: '',
    companyAddress: '',
    occupation: [],
  });

  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const handleRegister = async () => {
    setRegisterError('');
    setRegisterSuccess('');

    try {
      // 1️⃣ Prepare payloads
      const formDataForServer = {
        email: formData.email,
        username: formData.registerIdentifier,
        lastname: formData.lastName,
        firstname: formData.firstName,
        middle_initial: formData.middleInitial,
        name_extension: formData.nameExtension,
        birthday: formData.birthday,
        present_address: formData.presentAddress,
        contact_number: formData.contactNumber,
        course: formData.course,
        batch_year: formData.batchYear,
        password: formData.registerPassword,
        role: 'alumni',
        status: formData.status,
      };

      const employmentOptions = ["Employed - Permanent", "Employed - Contractual", "Self-employed / Freelance"];
      const isEmployed = employmentOptions.includes(formData.status);
      const everEmployed = isEmployed || formData.employmentNow === "Previously Employed";

      const gtsPayload = {
        ever_employed: everEmployed,
        is_employed: isEmployed,
        employment_status: isEmployed ? formData.status : null,
        place_of_work: isEmployed ? formData.placeOfWork : null,
        company_name: isEmployed ? formData.companyName : null,
        company_address: isEmployed ? formData.companyAddress : null,
        occupation: isEmployed && formData.occupation.length ? formData.occupation : null,
      };

      // 2️⃣ Create user
      const userResponse = await api.post('/users/register/alumni', formDataForServer);
      const userId = userResponse.data.id;

      // 3️⃣ Send GTS response
      await api.post(`/gts_responses/${userId}`, gtsPayload);

      setRegisterSuccess("Registration submitted successfully! Please wait for approval.");
      setTimeout(() => setIsRegistering(false), 3000);

    } catch (err) {
      setRegisterError(`Registration failed! ${err.response?.data?.detail ?? err.message ?? 'Please try again.'}`);
    }
  };

  return (
    <div>
      {registerError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
          {registerError}
        </div>
      )}
      {registerSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 text-sm">
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
        <EmploymentSnapshotForm
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