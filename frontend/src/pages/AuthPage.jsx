import { useState } from 'react';
import axios from 'axios';
import { IoEyeOff, IoEye } from "react-icons/io5";

function AuthPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/login', {
        username: identifier,
        password
      });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Login failed!');
    }
  };

  const handleRegister = async () => {
    
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center transform transition-transform duration-300 hover:-translate-y-2">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        <input
          type="text"
          placeholder="Email / Username"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') setShowPassword(prev => !prev); }}
          >
            {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4"
        >
          Login
        </button>
        <div>
        <p className="text-sm text-gray-500 mb-4">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here.</a>
          </p>
        </div>
        <p className="mt-6 text-sm text-gray-500">Developed by: 
            <br />Tabugadir, Kenji "Brocks" I.
            <br />Taguba, Philip Joshua V.
            <br />Salviejo, Victor Louis R.
            <br />Balgos, Wendel B.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
