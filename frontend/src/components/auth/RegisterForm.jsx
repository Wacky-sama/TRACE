import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function RegisterForm({ onSubmit, error, success }) {
  const [formData, setFormData] = useState({
    registerIdentifier: '', email: '', lastName: '', firstName: '', middleInitial: '', nameExtension: '',
    birthday: null, age: '', presentAddress: '', contactNumber: '', course: '', batchYear: '',
    registerPassword: '', registerConfirmPassword: '', nature: '', companyName: '', companyAddress: '',
    position: '', status: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  const handleChange = (field, value) => {
    if (field === 'birthday') {
      const today = new Date();
      const birthDate = new Date(value);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;
      setFormData(prev => ({ ...prev, birthday: value, age: calculatedAge.toString() }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
        registerIdentifier: '', 
        email: '', 
        lastName: '', 
        firstName: '', 
        middleInitial: '', 
        nameExtension: '',
        birthday: null, 
        age: '', 
        presentAddress: '', 
        contactNumber: '',
        course: '', 
        batchYear: '',
        registerPassword: '', 
        registerConfirmPassword: '', 
        nature: '', 
        companyName: '', 
        companyAddress: '',
        position: '', 
        status: ''
    });
    setRegisterErrors({});
  };

  const handleSubmit = () => {
    onSubmit(formData, setRegisterErrors, () => {}, resetForm);
  };

  return (
    <div className="max-w-md w-full mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 text-sm">{success}</div>}

      <h3 className="text-left font-medium mb-2">Personal Information</h3>
      {['email', 'registerIdentifier', 'lastName', 'firstName', 'middleInitial', 'nameExtension', 'presentAddress', 'contactNumber'].map(field => (
        <div className="mb-4" key={field}>
          <input
            type="text"
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={formData[field]}
            onChange={e => handleChange(field, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-sm"
          />
          {registerErrors[field] && <p className="text-red-500 text-xs mt-1">{registerErrors[field]}</p>}
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
        <DatePicker
          selected={formData.birthday}
          onChange={date => handleChange('birthday', date)}
          dateFormat="MM/dd/yyyy"
          maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
          minDate={new Date(1900, 0, 1)}
          className="w-full p-3 border border-gray-300 rounded-md text-sm"
          placeholderText="Select your birthday"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        {registerErrors.birthday && <p className="text-red-500 text-xs mt-1">{registerErrors.birthday}</p>}
      </div>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100"
        />
        {registerErrors.age && <p className="text-red-500 text-xs mt-1">{registerErrors.age}</p>}
      </div>

      <div className="mb-4">
        <select
          value={formData.course}
          onChange={e => handleChange('course', e.target.value)}
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
        {registerErrors.course && <p className="text-red-500 text-xs mt-1">{registerErrors.course}</p>}
      </div>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Batch Year"
          value={formData.batchYear}
          onChange={e => handleChange('batchYear', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-sm"
        />
        {registerErrors.batchYear && <p className="text-red-500 text-xs mt-1">{registerErrors.batchYear}</p>}
      </div>

      {['registerPassword', 'registerConfirmPassword'].map((field) => (
        <div className="mb-4 relative" key={field}>
          <input
            type={(field === 'registerPassword' && showPassword) || (field === 'registerConfirmPassword' && showConfirmPassword) ? 'text' : 'password'}
            placeholder={field === 'registerPassword' ? 'Password' : 'Confirm Password'}
            value={formData[field]}
            onChange={e => handleChange(field, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-sm pr-10"
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => field === 'registerPassword' ? setShowPassword(p => !p) : setShowConfirmPassword(p => !p)}
          >
            <FontAwesomeIcon icon={(field === 'registerPassword' ? showPassword : showConfirmPassword) ? faEye : faEyeSlash} />
          </span>
          {registerErrors[field] && <p className="text-red-500 text-xs mt-1">{registerErrors[field]}</p>}
        </div>
      ))}

      <h3 className="text-left font-medium mb-2">Employment Information</h3>
      {['nature', 'companyName', 'companyAddress', 'position'].map(field => (
        <div className="mb-4" key={field}>
          <input
            type="text"
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={formData[field]}
            onChange={e => handleChange(field, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-sm"
          />
          {registerErrors[field] && <p className="text-red-500 text-xs mt-1">{registerErrors[field]}</p>}
        </div>
      ))}

      <div className="mb-4">
        <select
          value={formData.status}
          onChange={e => handleChange('status', e.target.value)}
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
        {registerErrors.status && <p className="text-red-500 text-xs mt-1">{registerErrors.status}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 mb-4"
      >
        Register
      </button>
    </div>
  );
}

export default RegisterForm;
