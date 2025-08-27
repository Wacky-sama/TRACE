import { useState } from 'react';
import api from '../../services/api';
import PersonalInfoForm from './PersonalInfoForm';
import EmploymentInfoForm from './EmploymentInfoForm';

function RegisterForm({ setIsRegistering }) {
  const [step, setStep] = useState(1);

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
    sex: '',
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

  async function handleRegister(finalOccupations = formData.occupation) {
    setRegisterError('');
    setRegisterSuccess('');

    try {
      const employmentOptions = ['Employed - Permanent', 'Employed - Contractual', 'Self-employed / Freelance'];
      const isEmployed = employmentOptions.includes(formData.status);

      const payload = {
        email: formData.email.trim(),
        username: formData.registerIdentifier.trim(),
        lastname: formData.lastName.trim(),
        firstname: formData.firstName.trim(),
        middle_initial: formData.middleInitial?.trim() || '',
        name_extension: formData.nameExtension?.trim() || '',
        birthday: formData.birthday
          ? new Date(formData.birthday).toISOString().split('T')[0]
          : null,
        sex: formData.sex?.trim() || '',
        present_address: formData.presentAddress.trim(),
        contact_number: formData.contactNumber.trim(),
        course: formData.course.trim(),
        batch_year: formData.batchYear.trim(),
        password: formData.registerPassword.trim(),
        role: 'alumni',

        is_employed: isEmployed,
        employment_status: isEmployed ? formData.status : null,
        place_of_work: isEmployed ? formData.placeOfWork?.trim() : null,
        company_name: isEmployed ? formData.companyName?.trim() : null,
        company_address: isEmployed ? formData.companyAddress?.trim() : null,
        occupation: isEmployed && finalOccupations.length ? finalOccupations.map(o => o.trim()) : null
      };

      const response = await api.post('/users/register/alumni', payload);

      setRegisterSuccess('Registration submitted successfully! Please wait for approval.');
      setTimeout(() => setIsRegistering(false), 3000);

    } catch (err) {
      if (err.response?.data) {
        console.error('Server validation error:', err.response.data);
        setRegisterError(`Registration failed! ${JSON.stringify(err.response.data, null, 2)}`);
      } else {
        setRegisterError(`Registration failed! ${err.message ?? 'Please try again.'}`);
      }
    }
  }

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