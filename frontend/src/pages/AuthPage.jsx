import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  // Error states
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [registerIdentifier, setRegisterIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [course, setCourse] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

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
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await axios.post('http://192.168.10.2:8000/users/login', {
       identifier,
        password
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed!' + (err.response?.data?.detail) || '');
    }
  };

  const handleRegister = async () => {
    const errors = {};
    if (!registerIdentifier) errors.registerIdentifier = "Username is required";
    if (!email) errors.email = "Email is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!firstName) errors.firstName = "First name is required";
    if (!course) errors.course = "Course is required";
    if (!batchYear) errors.batchYear = "Batch year is required";
    if (!registerPassword) errors.registerPassword = "Password is required";
    if (!registerConfirmPassword) errors.registerConfirmPassword = "Confirm Password is required";
    if (registerPassword !== registerConfirmPassword) errors.registerConfirmPassword = "Passwords do not match";

    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await axios.post('http://192.168.10.2:8000/users/register/alumni', {
        username: registerIdentifier,
        email, 
        password: registerPassword,
        lastname: lastName,
        firstname: firstName,
        middle_initial: middleInitial,
        course,
        batch_year: batchYear,
        role: 'alumni'
      });
      alert("Registration submitted. Wait for approval.");
      setIsRegistering(false);
      setRegisterIdentifier('');
      setEmail('');
      setLastName('');
      setFirstName('');
      setMiddleInitial('');
      setCourse('');
      setBatchYear('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setRegisterErrors({});
    } catch (err) {
      alert('Registration failed! ' + (err.response?.data?.detail || ''));
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

          {isRegistering ? (
            <>
              <input
                  type="text"
                  placeholder="Username"
                  value={registerIdentifier}
                  onChange={e => setRegisterIdentifier(e.target.value)}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm"
              />
              {registerErrors.registerIdentifier && <p className="text-red-500 text-sm">{registerErrors.registerIdentifier}</p>}

              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm"
              />
              {registerErrors.email && <p className="text-red-500 text-xs">{registerErrors.email}</p>}

              <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm"
              />
              {registerErrors.lastName && <p className="text-red-500 text-xs">{registerErrors.lastName}</p>}

              <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm"
              />
               {registerErrors.firstName && <p className="text-red-500 text-xs">{registerErrors.firstName}</p>}

              <input
                  type="text"
                  placeholder="Middle Initial"
                  value={middleInitial}
                  onChange={e => setMiddleInitial(e.target.value)}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm"
              />
               {registerErrors.middleInitial && <p className="text-red-500 text-xs">{registerErrors.middleInitial}</p>}

              <select
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm"
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
               {registerErrors.course && <p className="text-red-500 text-xs">{registerErrors.course}</p>}

              <input
                  type="number"
                  placeholder="Batch Year"
                  value={batchYear}
                  onChange={e => setBatchYear(e.target.value)}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm"
              />
              {registerErrors.batchYear && <p className="text-red-500 text-xs">{registerErrors.batchYear}</p>}

              <div className="relative mb-3">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Password"
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              {registerErrors.registerPassword && <p className="text-red-500 text-xs">{registerErrors.registerPassword}</p>}

                <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowRegisterPassword(prev => !prev)}>
                  {showRegisterPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </span>
              </div>

              <div className="relative mb-6">
                <input
                  type={showRegisterConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={registerConfirmPassword}
                  onChange={e => setRegisterConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
                {registerErrors.registerConfirmPassword && <p className="text-red-500 text-xs">{registerErrors.registerConfirmPassword}</p>}
                <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowRegisterConfirmPassword(prev => !prev)}>
                  {showRegisterConfirmPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </span>
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
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {loginErrors.identifier && <p className="text-red-500 text-xs">{loginErrors.identifier}</p>}

              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {loginErrors.password && <p className="text-red-500 text-xs">{loginErrors.password}</p>}
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
            <br />Tabugadir, Kenji "Brocks" I.
            <br />Taguba, Philip Joshua V.
            <br />Salviejo, Victor Louis R.
            <br />Balgos, Wendel B.
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;