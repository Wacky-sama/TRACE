import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { login, getProfile } from '../../services/auth';
import { setAuthData, setUser, clearAuthData } from '../../utils/storage';
import { useUser } from '../../context/UserContext';
import FloatingInput from '../FloatingInput';

function LoginForm({ expectedRole }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const { setCurrentUser } = useUser();
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
      
      if (role === "alumni" && !is_approved) {
        toast.info("Your account is pending approval by the admin.");
        return;
      }

      if (role !== expectedRole) {
        toast.error(`Access denied: This login page is for ${expectedRole} only. Please use the appropriate portal.`);

        setTimeout(() => {
          clearAuthData();
          if (role === "admin") {
            navigate("/admin-login");
          } else if (role === "alumni") {
            navigate("/alumni-login");
          }
        }, 4000);
        return;
      }

      setAuthData({ token, role, is_approved });
      const userData = await getProfile();
      setUser(userData);
      setCurrentUser(userData); 

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "alumni") {
        navigate("/alumni/dashboard");
      } else {
        setLoginError("Unauthorized access. Please contact the administrator.");
      }
    } catch (error) { 
      setLoginError(error.response?.data?.detail ?? error.message);
    }
  };

  return (
    <>
        {loginError && (
            <div className="px-4 py-3 mb-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
                {loginError}
            </div>
        )}
        
        <FloatingInput
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            label="Email or Username"
            error={loginErrors.identifier}
            icon={<FontAwesomeIcon icon={faUser} />}
        />

        <FloatingInput
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            error={loginErrors.password}
            icon={<FontAwesomeIcon icon={faLock} />}
        >

            <span
                className="text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setShowPassword((prev) => !prev)}
            >
                {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
            </span>
        </FloatingInput>

      <button
        onClick={handleLogin}
        className="w-full py-3 mb-4 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Login
      </button>
    </>
  );
}

export default LoginForm;
