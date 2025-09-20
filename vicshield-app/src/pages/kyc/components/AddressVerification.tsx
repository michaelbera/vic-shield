import { useState } from 'react';
import { AddressInfo } from '../types';

interface AddressVerificationProps {
  initialData: AddressInfo;
  onNext: (data: AddressInfo) => void;
  onBack: () => void;
}

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'SG', label: 'Singapore' },
  // Add more countries as needed
];

const AddressVerification: React.FC<AddressVerificationProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [formData, setFormData] = useState<AddressInfo>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressInfo, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AddressInfo, string>> = {};

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State/Province is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    }
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleInputChange = (field: keyof AddressInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="card bg-base-300 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Address Verification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Street Address</label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className={`input input-bordered w-full ${
              errors.street ? 'input-error' : ''
            }`}
            placeholder="Enter your street address"
          />
          {errors.street && (
            <p className="text-error text-sm mt-1">{errors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`input input-bordered w-full ${
                errors.city ? 'input-error' : ''
              }`}
              placeholder="Enter your city"
            />
            {errors.city && (
              <p className="text-error text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">State/Province</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={`input input-bordered w-full ${
                errors.state ? 'input-error' : ''
              }`}
              placeholder="Enter your state or province"
            />
            {errors.state && (
              <p className="text-error text-sm mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className={`input input-bordered w-full ${
                errors.zipCode ? 'input-error' : ''
              }`}
              placeholder="Enter your ZIP or postal code"
            />
            {errors.zipCode && (
              <p className="text-error text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className={`select select-bordered w-full ${
                errors.country ? 'select-error' : ''
              }`}
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-error text-sm mt-1">{errors.country}</p>
            )}
          </div>
        </div>

        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">
            Please provide your current residential address. This information is used for compliance and verification purposes.
          </span>
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={onBack} className="btn btn-outline">
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressVerification;