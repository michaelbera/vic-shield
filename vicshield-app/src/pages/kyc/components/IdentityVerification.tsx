import { useState } from 'react';
import { IdentityInfo } from '../types';

interface IdentityVerificationProps {
  initialData: IdentityInfo;
  onNext: (data: IdentityInfo) => void;
  onBack: () => void;
}

const documentTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'drivingLicense', label: 'Driving License' },
  { value: 'nationalId', label: 'National ID' },
] as const;

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [formData, setFormData] = useState<IdentityInfo>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof IdentityInfo, string>>>({});
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof IdentityInfo, string>> = {};

    if (!formData.documentType) {
      newErrors.documentType = 'Please select a document type';
    }
    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'Document number is required';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, documentFile: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleInputChange = (field: keyof IdentityInfo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="card bg-base-300 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Identity Verification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Document Type</label>
          <select
            value={formData.documentType}
            onChange={(e) => handleInputChange('documentType', e.target.value)}
            className={`select select-bordered w-full ${
              errors.documentType ? 'select-error' : ''
            }`}
          >
            <option value="">Select document type</option>
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.documentType && (
            <p className="text-error text-sm mt-1">{errors.documentType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Document Number</label>
          <input
            type="text"
            value={formData.documentNumber}
            onChange={(e) => handleInputChange('documentNumber', e.target.value)}
            className={`input input-bordered w-full ${
              errors.documentNumber ? 'input-error' : ''
            }`}
            placeholder="Enter document number"
          />
          {errors.documentNumber && (
            <p className="text-error text-sm mt-1">{errors.documentNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Document Upload (Optional)
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload a clear photo or scan of your document (JPG, PNG, or PDF)
          </p>
        </div>

        {filePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img
              src={filePreview}
              alt="Document preview"
              className="max-w-sm max-h-64 object-contain border rounded"
            />
          </div>
        )}

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
            Your documents are encrypted and stored securely. We use this information only for identity verification.
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

export default IdentityVerification;