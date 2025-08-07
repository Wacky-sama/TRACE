import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { login } from '../../services/auth';
import { setAuthData } from '../../utils/storage';

function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [loginError, setLoginError] = useState('');
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

  return (
    <>
        {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
                {loginError}
            </div>
        )}
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
  );
}

export default LoginForm;
