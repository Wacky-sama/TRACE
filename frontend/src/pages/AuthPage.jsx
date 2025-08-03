import { setAuthData, getToken, getRole, isApproved, clearAuthData } from '../utils/storage';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../services/api';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  
  // Error states
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  // Personal Information
  const [registerIdentifier, setRegisterIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [nameExtension, setNameExtension] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [age, setAge] = useState('');
  const [presentAddress,  setPresentAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [course, setCourse] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  // Employment Information
  const [nature, setNature] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('');
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  // Navigation
  const navigate = useNavigate();

  const handleLogin = async () => {
    const errors = {};
    if (!identifier) errors.identifier = "Username or Email is required";
    if (!password) errors.password = "Password is required";
    
    setLoginErrors(errors);
    setLoginError(''); 
    
    if (Object.keys(errors).length > 0) return;

    try {
      const { token, role, is_approved } = await login(identifier, password);
      setAuthData({ token, role, is_approved });

      if (role === "alumni" && !is_approved) {
        setLoginError("Your account is pending approval by the admin.");
        return;
      }

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "alumni") {
        navigate("/alumni/dashboard");
      } else {
        setLoginError("Unauthorized access. Please contact the administrator.");
      }
    } catch (err) {
      setLoginError(err.response?.data?.detail ?? err.message);
      }
  };

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    const is_approved = isApproved();

  if (token && role) {
    if (role === "alumni" && !is_approved) {
      clearAuthData();
      return;
    }
    
    navigate(`/${role}/dashboard`);
  }
}, [navigate]);

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
        nature,
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      {/* Main Container with Hover Effect */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform transition-transform duration-300 hover:-translate-y-2">
        {/* Left side - Logo */}
        <div className="flex-1 bg-gray-800 flex items-center justify-center p-4 md:p-8">
          <div className="text-center">
            <img 
              src="/TRACE LOGO.png" 
              alt="TRACE Logo" 
              className="w-32 md:w-48 h-auto mx-auto mb-4"
            />
            <h3 className="text-white text-xl font-semibold mb-2">Welcome, Alumni!</h3>
            <p className="text-gray-200 text-sm">
              Track, Reconnect, and Connect with Excellence
            </p>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-md w-full mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">
            {isRegistering ? "Register" : "Login"}
          </h2>

          {/* Login Error Display */}
          {!isRegistering && loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
              {loginError}
            </div>
          )}

          {/* Registration Error/Success Display */}
          {isRegistering && registerError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
              {registerError}
            </div>
          )}
          
          {isRegistering && registerSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 text-sm">
              {registerSuccess}
            </div>
          )}

          {isRegistering ? (
            <>
              <div className="mb-4">
                <h2 className='flex'>Personal Information</h2>
              </div>

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
              </div>

              <div className="mb-4">
                <h2 className='flex'>Employment Information</h2>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Nature (Local / Abroad)"
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

              <button
                onClick={handleRegister}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 mb-4"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faUser} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" 
                  />
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className="w-full p-3 pt-6 pl-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="identifier"
                    className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-600"
                  >
                    Email or Username
                  </label>
                </div>
                <div className="h-5 mt-1">
                  {loginErrors.identifier && <p className="text-red-500 text-xs">{loginErrors.identifier}</p>}
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faLock} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" 
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 pt-6 pl-10 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-600"
                  >
                    Password
                  </label>
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter') setShowPassword(prev => !prev); }}
                  >
                    {showPassword ? <FontAwesomeIcon icon={faEye} size="md" /> : <FontAwesomeIcon icon={faEyeSlash} size="md" />}
                  </span>
                </div>
                <div className="h-5 mt-1">
                  {loginErrors.password && <p className="text-red-500 text-xs">{loginErrors.password}</p>}
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4"
              >
                Login
              </button>
            </>
          )}

          <p className="text-sm text-gray-500 mb-4">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 hover:underline"
            >
              {isRegistering ? "Login here." : "Register here."}
            </button>
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Developed by:
            <br />Balgos, Wendel B.
            <br />Salviejo, Victor Louis R.
            <br />Taguba, Philip Joshua V.
            <br />Tabugadir, Kenji "Brocks" I.
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;