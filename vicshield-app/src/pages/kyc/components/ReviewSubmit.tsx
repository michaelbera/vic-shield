import { useState } from 'react';
import { KYCData } from '../types';

interface ReviewSubmitProps {
  kycData: KYCData;
  onBack: () => void;
  onSubmit: () => void;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  kycData,
  onBack,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    onSubmit();
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'passport':
        return 'Passport';
      case 'drivingLicense':
        return 'Driving License';
      case 'nationalId':
        return 'National ID';
      default:
        return type;
    }
  };

  const getCountryLabel = (countryCode: string) => {
    const countries: Record<string, string> = {
      US: 'United States',
      CA: 'Canada',
      GB: 'United Kingdom',
      AU: 'Australia',
      VN: 'Vietnam',
      SG: 'Singapore',
    };
    return countries[countryCode] || countryCode;
  };

  return (
    <div className="card bg-base-300 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="card bg-base-200 p-4">
          <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Name:</span> {kycData.personalInfo.firstName} {kycData.personalInfo.lastName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {kycData.personalInfo.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {kycData.personalInfo.phone}
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span> {kycData.personalInfo.dateOfBirth}
            </div>
          </div>
        </div>

        {/* Identity Information */}
        <div className="card bg-base-200 p-4">
          <h3 className="text-lg font-semibold mb-3">Identity Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Document Type:</span> {getDocumentTypeLabel(kycData.identityInfo.documentType)}
            </div>
            <div>
              <span className="font-medium">Document Number:</span> {kycData.identityInfo.documentNumber}
            </div>
            <div className="col-span-full">
              <span className="font-medium">Document Upload:</span> {kycData.identityInfo.documentFile ? kycData.identityInfo.documentFile.name : 'No file uploaded'}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card bg-base-200 p-4">
          <h3 className="text-lg font-semibold mb-3">Address Information</h3>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="font-medium">Street Address:</span> {kycData.addressInfo.street}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="font-medium">City:</span> {kycData.addressInfo.city}
              </div>
              <div>
                <span className="font-medium">State:</span> {kycData.addressInfo.state}
              </div>
              <div>
                <span className="font-medium">ZIP Code:</span> {kycData.addressInfo.zipCode}
              </div>
            </div>
            <div>
              <span className="font-medium">Country:</span> {getCountryLabel(kycData.addressInfo.country)}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="card bg-base-200 p-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                I agree to the{' '}
                <a href="#" className="link link-primary">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="link link-primary">
                  Privacy Policy
                </a>
              </span>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
        </div>

        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-sm">
            Please review all information carefully. Once submitted, some details cannot be changed without additional verification.
          </span>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button type="button" onClick={onBack} className="btn btn-outline">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!agreedToTerms || isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting && <span className="loading loading-spinner"></span>}
          {isSubmitting ? 'Submitting...' : 'Submit KYC'}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmit;