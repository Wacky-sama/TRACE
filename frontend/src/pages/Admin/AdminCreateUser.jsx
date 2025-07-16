import { getToken } from '../../utils/storage';
import { useState } from 'react';
import api from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AdminCreateUser = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    lastname: '',
    firstname: '',
    middle_initial: '',
    role: 'admin',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = "Username is required";
    if (!form.email) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (!form.confirmPassword) errs.confirmPassword = "Confirm password is required";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!form.lastname) errs.lastname = "Last name is required";
    if (!form.firstname) errs.firstname = "First name is required";
    if (form.role !== 'admin') {
      errs.role = "Role must be admin";
    }
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      await api.post(
        '/users/admin/create-user',
        payload,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage("User created successfully!");
      setForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        lastname: '',
        firstname: '',
        middle_initial: '',
        role: 'admin',
      });
    } catch (error) {
      setMessage(error.response?.data?.detail || "Creation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-xl font-semibold mb-4">Create User</h2>

      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />
      {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}


      <input
        name="lastname"
        value={form.lastname}
        onChange={handleChange}
        placeholder="Last Name"
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />
      {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}

      <input
        name="firstname"
        value={form.firstname}
        onChange={handleChange}
        placeholder="First Name"
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />
      {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}

      <input
        name="middle_initial"
        value={form.middle_initial.toUpperCase()}
        onChange={handleChange}
        placeholder="Middle Initial"
        maxLength={1}
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-md text-sm"
      >
        <option value="admin">Admin</option>
      </select>
      {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-md text-sm"
        />
        <span
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
        </span>
      </div>
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <div className="relative">
        <input
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full p-3 border border-gray-300 rounded-md text-sm"
        />
        <span
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
          onClick={() => setShowConfirmPassword(prev => !prev)}
        >
          {showConfirmPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
        </span>
      </div>
      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
      >
        Create User
      </button>

      {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
    </form>
  );
};

export default AdminCreateUser;
