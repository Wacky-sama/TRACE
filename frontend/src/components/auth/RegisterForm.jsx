import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

function RegisterForm({ setIsRegistering }) {
    const [step, setStep] = useState(1);
    const [registerIdentifier, setRegisterIdentifier] = useState('');
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [nameExtension, setNameExtension] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [age, setAge] = useState('');
    const [presentAddress, setPresentAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [course, setCourse] = useState('');
    const [batchYear, setBatchYear] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [nature, setNature] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [position, setPosition] = useState('');
    const [status, setStatus] = useState('');
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
    const [registerErrors, setRegisterErrors] = useState({});
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');

  useEffect(() => {
    if (birthday) {
      const today = new Date();
      const birthDate = new Date(birthday);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge('');
    }
  }, [birthday]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleRegister = async () => {
    const errors = {};
    if (!registerIdentifier) errors.registerIdentifier = "Username is required";
    if (!email) errors.email = "Email is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!firstName) errors.firstName = "First name is required";
    if (!birthday) errors.birthday = "Birthday is required";
    if (!age) errors.age = "Age is required";
    if (!presentAddress) errors.presentAddress = "Present address is required";
    if (!contactNumber) errors.contactNumber = "Contact number is required";
    if (!course) errors.course = "Course is required";
    if (!batchYear) errors.batchYear = "Batch year is required";
    if (!registerPassword) errors.registerPassword = "Password is required";
    if (!registerConfirmPassword) errors.registerConfirmPassword = "Confirm Password is required";
    if (registerPassword !== registerConfirmPassword) errors.registerConfirmPassword = "Passwords do not match";
    if (!status) errors.status = "Employment status is required";

    setRegisterErrors(errors);
    setRegisterError('');
    setRegisterSuccess('');
    if (Object.keys(errors).length > 0) return;

    try {
      await api.post('/users/register/alumni', {
        email: email,
        username: registerIdentifier,
        lastname: lastName,
        firstname: firstName,
        middle_initial: middleInitial,
        name_extension: nameExtension,
        birthday: birthday,
        present_address: presentAddress,
        contact_number: contactNumber,
        course: course,
        batch_year: batchYear,
        password: registerPassword,
        // Employment Information
        place_of_work: placeOfWork,
        company_name: companyName,
        company_address: companyAddress,
        position,
        status,
        role: 'alumni'
      });

      const resetRegisterForm = () => {
        setRegisterIdentifier('');
        setEmail('');
        setLastName('');
        setFirstName('');
        setMiddleInitial('');
        setNameExtension('');
        setBirthday(null);
        setAge('');
        setPresentAddress('');
        setContactNumber('');
        setCourse('');
        setBatchYear('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        setNature('');
        setCompanyName('');
        setCompanyAddress('');
        setPosition('');
        setStatus('');
        setRegisterErrors({});
      };

      setRegisterSuccess("Registration submitted successfully! Please wait for approval.");
      resetRegisterForm();
      setTimeout(() => {
        setIsRegistering(false);
        setRegisterSuccess('');
      }, 3000);
    } catch (err) {
      setRegisterError('Registration failed! ' + (err.response?.data?.detail || 'Please try again.'));
    }
  };

  return (
    <div>
        {/* Feedback messages */}
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
            <div>
                <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.email && <p className="text-red-500 text-xs">{registerErrors.email}</p>}
                    </div>

                    <input
                        type="text"
                        placeholder="Username"
                        value={registerIdentifier}
                        onChange={e => setRegisterIdentifier(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.registerIdentifier && <p className="text-red-500 text-xs">{registerErrors.registerIdentifier}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.lastName && <p className="text-red-500 text-xs">{registerErrors.lastName}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.firstName && <p className="text-red-500 text-xs">{registerErrors.firstName}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Middle Initial"
                        value={middleInitial}
                        onChange={e => setMiddleInitial(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.middleInitial && <p className="text-red-500 text-xs">{registerErrors.middleInitial}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Name Extension (e.g. Jr., Sr., III)"
                        value={nameExtension}
                        onChange={e => setNameExtension(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.nameExtension && <p className="text-red-500 text-xs">{registerErrors.nameExtension}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Birthday
                    </label>
                    <DatePicker
                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                        minDate={new Date(1900, 0, 1)}
                        selected={birthday}
                        onChange={(date) => setBirthday(date)}
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
                    <div className="h-5 mt-1">
                        {registerErrors.birthday && (
                            <p className="text-red-500 text-xs">{registerErrors.birthday}</p>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.age && <p className="text-red-500 text-xs">{registerErrors.age}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Present Address"
                        value={presentAddress}
                        onChange={e => setPresentAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.presentAddress && <p className="text-red-500 text-xs">{registerErrors.presentAddress}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="tel"
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChange={e => setContactNumber(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.contactNumber && <p className="text-red-500 text-xs">{registerErrors.contactNumber}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <select
                        value={course}
                        onChange={e => setCourse(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    >
                        <option value="">Select Course</option>
                        <option value="BACHELOR OF SCIENCE IN AGRICULTURE">BACHELOR OF SCIENCE IN AGRICULTURE</option>
                        <option value="BACHELOR OF SCIENCE IN ACCOUNTING INFORMATION SYSTEM">BACHELOR OF SCIENCE IN ACCOUNTING INFORMATION SYSTEM</option>
                        <option value="BACHELOR OF SCIENCE IN CRIMINOLOGY">BACHELOR OF SCIENCE IN CRIMINOLOGY</option>
                        <option value="BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT">BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT</option>
                        <option value="BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY">BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY</option>
                        <option value="BACHELOR OF ELEMENTARY EDUCATION">BACHELOR OF ELEMENTARY EDUCATION</option>
                        <option value="BACHELOR OF SECONDARY EDUCATION">BACHELOR OF SECONDARY EDUCATION</option>
                    </select>
                    <div className="h-5 mt-1">
                        {registerErrors.course && <p className="text-red-500 text-xs">{registerErrors.course}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="number"
                        placeholder="Batch Year"
                        value={batchYear}
                        onChange={e => setBatchYear(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.batchYear && <p className="text-red-500 text-xs">{registerErrors.batchYear}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <input
                            type={showRegisterPassword ? "text" : "password"}
                            placeholder="Password"
                            value={registerPassword}
                            onChange={e => setRegisterPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md text-sm pr-10"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                        onClick={() => setShowRegisterPassword(prev => !prev)}>
                            {showRegisterPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                    </div>
                    <div className="h-5 mt-1">
                        {registerErrors.registerPassword && <p className="text-red-500 text-xs">{registerErrors.registerPassword}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <input
                            type={showRegisterConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={registerConfirmPassword}
                            onChange={e => setRegisterConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md text-sm pr-10"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                            onClick={() => setShowRegisterConfirmPassword(prev => !prev)}>
                        {showRegisterConfirmPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                    </div>
                    <div className="h-5 mt-1">
                        {registerErrors.registerConfirmPassword && <p className="text-red-500 text-xs">{registerErrors.registerConfirmPassword}</p>}
                    </div>
                    <button onClick={nextStep} className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 mb-4">Next</button>
                </div>
            </div>
        )}

        {step === 2 && (
            <div>
                <h2 className="text-lg font-semibold mb-2">Employment Information</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Place of Work (Local / Abroad)"
                        value={nature}
                        onChange={e => setNature(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.nature && <p className="text-red-500 text-xs">{registerErrors.nature}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.companyName && <p className="text-red-500 text-xs">{registerErrors.companyName}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Company Address"
                        value={companyAddress}
                        onChange={e => setCompanyAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.companyAddress && <p className="text-red-500 text-xs">{registerErrors.companyAddress}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Position"
                        value={position}
                        onChange={e => setPosition(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="h-5 mt-1">
                        {registerErrors.position && <p className="text-red-500 text-xs">{registerErrors.position}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                    >
                        <option value="">Select Employment Status</option>
                        <option value="Employed - Permanent">Employed – Permanent</option>
                        <option value="Employed - Contractual">Employed – Contractual</option>
                        <option value="Self-employed / Freelance">Self-employed / Freelance</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Retired">Retired</option>
                        <option value="Looking for Work">Looking for Work</option>
                        <option value="Others">Others</option>
                    </select>
                    <div className="h-5 mt-1">
                        {registerErrors.status && <p className="text-red-500 text-xs">{registerErrors.status}</p>}
                    </div>
                </div>
                    
                <div className="flex justify-between gap-2">
                    <button
                        onClick={prevStep}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleRegister}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
                    >
                        Register
                    </button>
                </div>
            </div>
        )}
    </div>
    );
}

export default RegisterForm;
