import { useEffect, useState } from 'react';
import FloatingInput from '../FloatingInput';
import FloatingSelect from '../FloatingSelect';

const EMPLOYED_STATUSES = [
  'Employed - Permanent',
  'Employed - Contractual',
  'Self-employed / Freelance',
  'Others',
];

const NON_EMPLOYED_STATUSES = ['Unemployed', 'Retired', 'Looking for Work'];
const EMPLOYMENT_NOW_OPTIONS = ['Yes', 'No', 'Never employed'];

const OCCUPATION_OPTIONS = [
  'Software Engineer',
  'Teacher',
  'Nurse',
  'Doctor',
  'Freelancer',
  'Business Owner',
  'Other',
];

function EmploymentSnapshotForm({ formData, setFormData, prevStep, handleRegister }) {
  const [errors, setErrors] = useState({});
  const [otherOccupation, setOtherOccupation] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Unified validation
  const validate = () => {
    const newErrors = {};

    if (!formData.employmentNow) {
      newErrors.employmentNow = 'Please select an option.';
    }

    if (formData.employmentNow === 'Yes') {
      if (!formData.status) newErrors.status = 'Select your employment status.';
      if (!formData.placeOfWork?.trim()) newErrors.placeOfWork = 'Place of work required.';
      if (!formData.companyName?.trim()) newErrors.companyName = 'Company name required.';
      if (!formData.companyAddress?.trim()) newErrors.companyAddress = 'Company address required.';
      if (!formData.occupation.length) newErrors.occupation = 'Select at least one occupation.';
      if (formData.occupation.includes('Other') && !otherOccupation.trim()) {
        newErrors.otherOccupation = 'Please specify your occupation.';
      }
    }

    if (formData.employmentNow === 'No' && !formData.status) {
      newErrors.status = 'Select your current situation.';
    }

    if (formData.employmentNow === 'Never employed') {
      // just enforce that status stays "Never employed"
      if (formData.status !== 'Never employed') {
        newErrors.status = 'Invalid status for never employed.';
      }
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  // Run validation live whenever inputs change
  useEffect(() => {
    validate();
  }, [formData, otherOccupation]);

  // Reset fields based on employmentNow
  useEffect(() => {
    setFormData(prev => {
      const updated = { ...prev };

      if (prev.employmentNow === 'Yes') {
        if (NON_EMPLOYED_STATUSES.includes(prev.status) || prev.status === 'Never employed') {
          updated.status = '';
        }
      }

      if (prev.employmentNow === 'No') {
        updated.placeOfWork = '';
        updated.companyName = '';
        updated.companyAddress = '';
        updated.occupation = [];
        updated.status = NON_EMPLOYED_STATUSES.includes(prev.status) ? prev.status : '';
      }

      if (prev.employmentNow === 'Never employed') {
        updated.status = 'Never employed';
        updated.placeOfWork = '';
        updated.companyName = '';
        updated.companyAddress = '';
        updated.occupation = [];
      }

      return updated;
    });

    setOtherOccupation('');
  }, [formData.employmentNow, setFormData]);

  const handleOccupationChange = option => {
    setFormData(prev => {
      const current = prev.occupation;
      let updated;
      if (current.includes(option)) {
        updated = current.filter(o => o !== option);
        if (option === 'Other') setOtherOccupation('');
      } else {
        updated = [...current, option];
      }
      return { ...prev, occupation: updated };
    });
  };

  const onSubmit = async () => {
    if (!validate()) return;

    const finalOccupations = formData.occupation.map(o =>
      o === 'Other' ? otherOccupation.trim() : o.trim()
    );

    await handleRegister(finalOccupations);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Employment Information</h2>

      {/* Employment Now */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Are you presently employed?</label>
        <div className="flex flex-col gap-2">
          {EMPLOYMENT_NOW_OPTIONS.map(opt => (
            <label key={opt} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="employmentNow"
                value={opt}
                checked={formData.employmentNow === opt}
                onChange={e => setFormData({ ...formData, employmentNow: e.target.value })}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
        {errors.employmentNow && <p className="text-red-500 text-xs mt-1">{errors.employmentNow}</p>}
      </div>

      {/* If employed */}
      {formData.employmentNow === 'Yes' && (
        <>
          <FloatingSelect
            id="status"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            label="Employment Status"
            error={errors.status}
            options={EMPLOYED_STATUSES}
          />
          <FloatingSelect
            id="placeOfWork"
            value={formData.placeOfWork}
            onChange={e => setFormData({ ...formData, placeOfWork: e.target.value })}
            label="Place of Work"
            error={errors.placeOfWork}
            options={['Local', 'Abroad']}
          />
          <FloatingInput
            id="companyName"
            value={formData.companyName}
            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
            label="Company Name"
            error={errors.companyName}
          />
          <FloatingInput
            id="companyAddress"
            value={formData.companyAddress}
            onChange={e => setFormData({ ...formData, companyAddress: e.target.value })}
            label="Company Address"
            error={errors.companyAddress}
          />

          {/* Occupations */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation(s)</label>
            <div className="flex flex-wrap gap-2">
              {OCCUPATION_OPTIONS.map(opt => (
                <label
                  key={opt}
                  className={`px-2 py-1 border rounded cursor-pointer ${
                    formData.occupation.includes(opt)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={formData.occupation.includes(opt)}
                    onChange={() => handleOccupationChange(opt)}
                    className="hidden"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {formData.occupation.includes('Other') && (
              <FloatingInput
                id="otherOccupation"
                value={otherOccupation}
                onChange={e => setOtherOccupation(e.target.value.trimStart())}
                label="Please specify your occupation"
                error={errors.otherOccupation}
              />
            )}
            {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
          </div>
        </>
      )}

      {/* If unemployed */}
      {formData.employmentNow === 'No' && (
        <FloatingSelect
          id="status"
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          label="Current Situation"
          error={errors.status}
          options={NON_EMPLOYED_STATUSES}
        />
      )}

      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid}
          className={`px-6 py-2 rounded ${
            isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default EmploymentSnapshotForm;
