import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import FloatingInput from '../FloatingInput';
import FloatingSelect from '../FloatingSelect';

function RegisterForm({ setIsRegistering }) {
  const [step, setStep] = useState(1);

  // Personal Info
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

  // Employment Info
  const [placeOfWork, setPlaceOfWork] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [occupation, setOccupation] = useState([]);
  const [status, setStatus] = useState('');

  // Toggles + validation
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  //  Refs for scrolling
  const fieldRefs = {
    registerIdentifier: useRef(null),
    email: useRef(null),
    lastName: useRef(null),
    firstName: useRef(null),
    birthday: useRef(null),
    age: useRef(null),
    presentAddress: useRef(null),
    contactNumber: useRef(null),
    course: useRef(null),
    batchYear: useRef(null),
    registerPassword: useRef(null),
    registerConfirmPassword: useRef(null),
    status: useRef(null),
    placeOfWork: useRef(null),
    companyName: useRef(null),
    companyAddress: useRef(null),
    occupation: useRef(null)
  };

  // Auto-calc age
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

  // Reset employment fields when status changes
  useEffect(() => {
    if (status === "Unemployed" || status === "Retired" || status === "Looking for Work") {
      setPlaceOfWork("");
      setCompanyName("");
      setCompanyAddress("");
      setOccupation("");
    }
  }, [status]);

  // 🔥 Helper to scroll to first error
  const scrollToError = (errors) => {
    const firstKey = Object.keys(errors)[0];
    if (firstKey && fieldRefs[firstKey]?.current) {
      fieldRefs[firstKey].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fieldRefs[firstKey].current.focus();
    }
  };

  // --- Validation functions ---
  const validateStep1 = () => {
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
    if (registerPassword !== registerConfirmPassword)
      errors.registerConfirmPassword = "Passwords do not match";

    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) scrollToError(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!status) errors.status = "Employment status is required";
    if (status !== "Unemployed" && status !== "Retired" && status !== "Looking for Work") {
      if (!placeOfWork) errors.placeOfWork = "Place of work is required";
      if (!companyName) errors.companyName = "Company name is required";
      if (!companyAddress) errors.companyAddress = "Company address is required";
      if (!occupation) errors.occupation = "Position is required";
    }

    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) scrollToError(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Step navigation ---
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => setStep(1);

  // --- Submit ---
  const handleRegister = async () => {
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();
    if (!step1Valid || !step2Valid) return;

    setRegisterError('');
    setRegisterSuccess('');

    try {
      await api.post('/users/register/alumni', {
        email,
        username: registerIdentifier,
        lastname: lastName,
        firstname: firstName,
        middle_initial: middleInitial,
        name_extension: nameExtension,
        birthday,
        present_address: presentAddress,
        contact_number: contactNumber,
        course,
        batch_year: batchYear,
        password: registerPassword,
        role: 'alumni',
        place_of_work: placeOfWork,
        company_name: companyName,
        company_address: companyAddress,
        occupation,
        status
      });

      setRegisterSuccess("Registration submitted successfully! Please wait for approval.");
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
        <>
          <h2 className="text-lg font-semibold mb-2">Personal Information</h2>

          <FloatingInput ref={fieldRefs.email} id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} label="Email" error={registerErrors.email} />

          <FloatingInput ref={fieldRefs.registerIdentifier} id="username" value={registerIdentifier} onChange={e => setRegisterIdentifier(e.target.value)} label="Username" error={registerErrors.registerIdentifier} />

          <FloatingInput ref={fieldRefs.lastName} id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} label="Last Name" error={registerErrors.lastName} />

          <FloatingInput ref={fieldRefs.firstName} id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} label="First Name" error={registerErrors.firstName} />

          <FloatingInput ref={fieldRefs.middleInitial} id="middleInitial" value={middleInitial} onChange={e => setMiddleInitial(e.target.value)} label="Middle Initial" error={registerErrors.middleInitial} />

          <FloatingInput ref={fieldRefs.nameExtension} id="nameExtension" value={nameExtension} onChange={e => setNameExtension(e.target.value)} label="Name Extension (e.g., Jr., Sr., III)" error={registerErrors.nameExtension} />

          {/* Birthday */}
          <div className="mb-4" ref={fieldRefs.birthday}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
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
            {registerErrors.birthday && <p className="text-red-500 text-xs">{registerErrors.birthday}</p>}
          </div>

          <FloatingInput 
            ref={fieldRefs.age} 
            id="age" type="number" 
            value={age} label="Age" 
            readOnly error={registerErrors.age} 
          />

          <FloatingInput 
            ref={fieldRefs.presentAddress} 
            id="presentAddress" 
            value={presentAddress} 
            onChange={e => setPresentAddress(e.target.value)}
            label="Present Address" 
            error={registerErrors.presentAddress} 
           />

          <FloatingInput 
            ref={fieldRefs.contactNumber} 
            id="contactNumber" 
            type="tel" 
            value={contactNumber} 
            onChange={e => setContactNumber(e.target.value)} 
            label="Contact Number" 
            error={registerErrors.contactNumber} 
          />

          <FloatingSelect
            ref={fieldRefs.course}
            id="course"
            value={course}
            onChange={e => setCourse(e.target.value)}
            label="Course"
            error={registerErrors.course}
            options={[
              "BACHELOR OF SCIENCE IN AGRICULTURE",
              "BACHELOR OF SCIENCE IN ACCOUNTING INFORMATION SYSTEM",
              "BACHELOR OF SCIENCE IN CRIMINOLOGY",
              "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT",
              "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
              "BACHELOR OF ELEMENTARY EDUCATION",
              "BACHELOR OF SECONDARY EDUCATION"
            ]}
          />

        <FloatingSelect
            ref={fieldRefs.batchYear}
            id="batchYear"
            value={batchYear}
            onChange={e => setBatchYear(e.target.value)}
            label="Batch Year"
            error={registerErrors.batchYear}
            options={Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, i) => (1950 + i).toString())}
        />


          {/* Password */}
        <FloatingInput
            ref={fieldRefs.registerPassword}
            id="registerPassword"
            type={showRegisterPassword ? "text" : "password"}
            value={registerPassword}
            onChange={e => setRegisterPassword(e.target.value)}
            label="Password"
            error={registerErrors.registerPassword}
        >
            <span
                className="cursor-pointer text-gray-500"
                onClick={() => setShowRegisterPassword(prev => !prev)}
                tabIndex={0}
                role="button"
                aria-label="Toggle password visibility"
            >
                {showRegisterPassword ? (
                <FontAwesomeIcon icon={faEye} />
                ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
                )}
             </span>
        </FloatingInput>

        <FloatingInput
            ref={fieldRefs.registerConfirmPassword}
            id="registerConfirmPassword"
            type={showRegisterConfirmPassword ? "text" : "password"}
            value={registerConfirmPassword}
            onChange={e => setRegisterConfirmPassword(e.target.value)}
            label="Confirm Password"
            error={registerErrors.registerConfirmPassword}
        >
          <span
            className="cursor-pointer text-gray-500"
            onClick={() => setShowRegisterConfirmPassword(prev => !prev)}
            tabIndex={0}
            role="button"
            aria-label="Toggle confirm password visibility"
          >
            {showRegisterConfirmPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
          </span>
        </FloatingInput>

          <button
            onClick={nextStep}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 mb-4"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Employment Information</h2>

          <FloatingSelect
            ref={fieldRefs.status}
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            label="Employment Status"
            error={registerErrors.status}
            options={[
              "Employed - Permanent",
              "Employed - Contractual",
              "Self-employed / Freelance",
              "Unemployed",
              "Retired",
              "Looking for Work",
              "Others"
            ]}
          />

          {status !== "Unemployed" && status !== "Retired" && status !== "Looking for Work" && (
            <>
              <FloatingSelect
                ref={fieldRefs.placeOfWork}
                id="placeOfWork"
                value={placeOfWork}
                onChange={e => setPlaceOfWork(e.target.value)}
                label="Place of Work"
                error={registerErrors.placeOfWork}
                options={["Local", "Abroad"]}
              />
              <FloatingInput
                ref={fieldRefs.companyName}
                id="companyName"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                label="Company Name"
                error={registerErrors.companyName}
              />
              <FloatingInput
                ref={fieldRefs.companyAddress}
                id="companyAddress"
                value={companyAddress}
                onChange={e => setCompanyAddress(e.target.value)}
                label="Company Address"
                error={registerErrors.companyAddress}
              />
              <div className="mb-4" ref={fieldRefs.occupation}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Present Occupation</label>
                {[
                  "Officials of Government and Special-Interest Organizations, Corporate Executives, Managers, Managing Proprietors and Supervisors",
                  "Professionals",
                  "Technicians and Associate Professionals",
                  "Clerks",
                  "Service workers and Shop and Market Sales Workers",
                  "Farmers, Forestry Workers and Fishermen",
                  "Trades and Related Workers",
                  "Plant and machine Operators and Assemblers",
                  "Laborers and Unskilled Workers",
                  "Others (please specify)"
                ].map((option) => (
                  <label key={option} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={occupation.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setOccupation([...occupation, option]);
                        } else {
                          setOccupation(occupation.filter(o => o !== option));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
                {registerErrors.occupation && <p className="text-red-500 text-xs">{registerErrors.occupation}</p>}
              </div>
            </>
          )}

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