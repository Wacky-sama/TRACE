import { useState } from 'react';
import api from '../../services/api';
import PersonalInfoForm from './PersonalInfoForm';
import EmploymentInfoForm from './EmploymentInfoForm';

function RegisterForm({ setIsRegistering }) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
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
    permanentAddress: '',
    contactNumber: '',
    course: '',
    batchYear: '',
    registerPassword: '',
    registerConfirmPassword: '',

    // Step 2: Employment Info
    employmentNow: '',
    employmentStatus: '',
    placeOfWork: '',
    companyName: '',
    companyAddress: '',
    occupation: [],
    nonEmployedReasons: [],
    otherNonEmployedReason: '',
  });

  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  async function handleRegister(finalOccupations = formData.occupation) {
    setRegisterError('');
    setRegisterSuccess('');

    try {
      // PAYLOAD 1 - Create User
      const userPayload = {
        email: formData.email.trim(),
        username: formData.registerIdentifier.trim(),
        lastname: formData.lastName.trim(),
        firstname: formData.firstName.trim(),
        middle_initial: formData.middleInitial?.trim() || '',
        name_extension: formData.nameExtension?.trim() || '',
        birthday: formData.birthday
            ? new Date(formData.birthday).toISOString().split('T')[0]
            : null,
        sex: formData.sex.trim(),
        present_address: formData.presentAddress.trim(),
        permanent_address: formData.permanentAddress.trim(),
        contact_number: formData.contactNumber.trim(),
        course: formData.course.trim(),
        batch_year: parseInt(formData.batchYear.trim()),
        password: formData.registerPassword,
        role: 'alumni',
      };

      const userResponse = await api.post('/users/register/alumni', userPayload);
      const newUserId = userResponse.data.id;
      

      // PAYLOAD 2 - Create GTS Response
      const gtsResponsePayload = {
       ever_employed: formData.employmentNow !== 'Never employed' 
          ? formData.employmentNow === 'Yes' 
          : false,

        is_employed: formData.employmentNow === 'Yes',

        employment_status: formData.employmentStatus,

        place_of_work: formData.employmentNow === 'Yes' 
          ? formData.placeOfWork 
          : null,

        company_name: formData.employmentNow === 'Yes' 
          ? formData.companyName?.trim() 
          : null,

        company_address: formData.employmentNow === 'Yes' 
          ? formData.companyAddress?.trim() 
          : null,

        occupation: formData.employmentNow === 'Yes' && finalOccupations.length 
          ? finalOccupations.map(o => o.trim()).join(', ')
          : null,

        non_employed_reasons: formData.employmentNow === 'No'
            ? [
                ...formData.nonEmployedReasons.filter(r => r !== 'Other reasons, please specify'),
                ...(formData.otherNonEmployedReason.trim()
                  ? [formData.otherNonEmployedReason.trim()]
                  : []),
              ]
            : null,

        permanent_address: formData.permanentAddress.trim(),
      };

      await api.post(`/gts_responses/register/alumni/${newUserId}`, gtsResponsePayload);

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