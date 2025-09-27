import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { login, getProfile } from '../../services/auth';
import { setAuthData, setUser } from '../../utils/storage';
import { useUser } from '../../context/UserContext';
import FloatingInput from '../FloatingInput';

function LoginForm() {
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
        setLoginError("Your account is pending approval by the admin.");
        return;
      }

      setAuthData({ token, role, is_approved });
      const userData = await getProfile();
      setUser(userData);
      setCurrentUser(userData); 

      if (role === "admin") {
        navigate("/admin/dashboard", {replace: true});
      } else if (role === "alumni") {
        navigate("/alumni/dashboard", {replace: true});
      } else {
        setLoginError("Unauthorized access. Please contact the administrator.");
      }
    } catch (err) {
      setLoginError(err.response?.data?.detail ?? err.message);
    }
  };

  return (
    <>
        {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
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
                className="cursor-pointer text-gray-500"
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
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4"
      >
        Login
      </button>
    </>
  );
}

export default LoginForm;
