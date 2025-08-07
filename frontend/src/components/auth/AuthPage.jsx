import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthData, getToken, getRole, isApproved, clearAuthData } from '../../utils/storage';
import { login } from '../../services/auth';
import api from '../../services/api';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const navigate = useNavigate();

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
  
  const handleLogin = async (identifier, password) => {
    const errors = {};
    if (!identifier) errors.identifier = "Username or Email is required";
    if (!password) errors.password = "Password is required";
   
    if (Object.keys(errors).length > 0) {
      setLoginError("Please fill in all fields.");
      return;
    }

    try {
      const { token, role, is_approved } = await login(identifier, password);
      setAuthData({ token, role, is_approved });

      if (role === "alumni" && !is_approved) {
        clearAuthData();
        setLoginError('Your account is pending approval by the admin.');
        return;
      }

      navigate(`/${role}/dashboard `);
    } catch (err) {
      setLoginError(err.response?.date?.detail ?? err.message);
    }
  }

  const handleRegister = async (formData, setRegisterErrors, setAge, resetForm) => {
    const errors = {};
    const requiredFields = [
      'registerIdentifier', 'email', 'lastName', 'firstName', 'birthday', 'age', 'presentAddress',
      'contactNumber', 'course', 'batchYear', 'registerPassword', 'registerConfirmPassword', 'status'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) errors[field] = `${field} is required`;
    });

    if (formData.registerPassword !== formData.registerConfirmPassword) {
      errors.registerConfirmPassword = "Passwords do not match";
    }

    setRegisterErrors(errors);
    setRegisterError('');
    setRegisterSuccess('');
    if (Object.keys(errors).length > 0) return;

    try {
      await api.post('/users/register/alumni', {
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
        nature: formData.nature,
        company_name: formData.companyName,
        company_address: formData.companyAddress,
        position: formData.position,
        status: formData.status,
        role: 'alumni'
      });

      setRegisterSuccess("Registration submitted successfully! Please wait for approval.");
      resetForm();
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
      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform transition-transform duration-300 hover:-translate-y-2">
        <div className="flex-1 bg-gray-800 flex items-center justify-center p-4 md:p-8">
          <div className="text-center">
            <img src="/TRACE LOGO.png" alt="TRACE Logo" className="w-32 md:w-48 h-auto mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Welcome, Alumni!</h3>
            <p className="text-gray-200 text-sm">Track, Reconnect, and Connect with Excellence</p>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10">
          {isRegistering ? (
            <RegisterForm
              onSubmit={handleRegister}
              error={registerError}
              success={registerSuccess}
            />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              error={loginError}
            />
          )}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
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