import { useState } from 'react';
import { PersonalInfo as PersonalInfoType } from '../types';

interface PersonalInfoProps {
  initialData: PersonalInfoType;
  onNext: (data: PersonalInfoType) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ initialData, onNext }) => {
  const [formData, setFormData] = useState<PersonalInfoType>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfoType, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof PersonalInfoType, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
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

  const handleInputChange = (field: keyof PersonalInfoType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="card bg-base-300 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`input input-bordered w-full ${
                errors.firstName ? 'input-error' : ''
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-error text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`input input-bordered w-full ${
                errors.lastName ? 'input-error' : ''
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-error text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`input input-bordered w-full ${
              errors.email ? 'input-error' : ''
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`input input-bordered w-full ${
              errors.phone ? 'input-error' : ''
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-error text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={`input input-bordered w-full ${
              errors.dateOfBirth ? 'input-error' : ''
            }`}
          />
          {errors.dateOfBirth && (
            <p className="text-error text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="btn btn-primary">
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;