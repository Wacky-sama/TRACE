import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function LoginForm({ onSubmit, error }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  const handleSubmit = () => {
    onSubmit(identifier, password, setLoginErrors);
  };

  return (
    <div className="max-w-md w-full mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder=" "
            className="w-full p-3 pt-6 pl-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
          />
          <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500">
            Email or Username
          </label>
        </div>
        <div className="h-5 mt-1">
          {loginErrors.identifier && <p className="text-red-500 text-xs">{loginErrors.identifier}</p>}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            className="w-full p-3 pt-6 pl-10 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
          />
          <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 transform origin-left peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500">
            Password
          </label>
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </span>
        </div>
        <div className="h-5 mt-1">
          {loginErrors.password && <p className="text-red-500 text-xs">{loginErrors.password}</p>}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4"
      >
        Login
      </button>
    </div>
  );
}

export default LoginForm;
