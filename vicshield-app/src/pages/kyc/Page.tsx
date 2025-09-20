import { useState } from 'react';
import Container from '~/components/UI/Container';
import ProgressIndicator from './components/ProgressIndicator';
import PersonalInfo from './components/PersonalInfo';
import IdentityVerification from './components/IdentityVerification';
import AddressVerification from './components/AddressVerification';
import ReviewSubmit from './components/ReviewSubmit';
import { KYCData, KYCStep, PersonalInfo as PersonalInfoType, IdentityInfo, AddressInfo } from './types';

const KYCPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<KYCStep>('personal');
  const [completedSteps, setCompletedSteps] = useState<KYCStep[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const [kycData, setKycData] = useState<KYCData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    },
    identityInfo: {
      documentType: 'passport',
      documentNumber: '',
      documentFile: null,
    },
    addressInfo: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const handlePersonalInfoNext = (data: PersonalInfoType) => {
    setKycData(prev => ({ ...prev, personalInfo: data }));
    if (!completedSteps.includes('personal')) {
      setCompletedSteps(prev => [...prev, 'personal']);
    }
    setCurrentStep('identity');
  };

  const handleIdentityNext = (data: IdentityInfo) => {
    setKycData(prev => ({ ...prev, identityInfo: data }));
    if (!completedSteps.includes('identity')) {
      setCompletedSteps(prev => [...prev, 'identity']);
    }
    setCurrentStep('address');
  };

  const handleAddressNext = (data: AddressInfo) => {
    setKycData(prev => ({ ...prev, addressInfo: data }));
    if (!completedSteps.includes('address')) {
      setCompletedSteps(prev => [...prev, 'address']);
    }
    setCurrentStep('review');
  };

  const handleFinalSubmit = () => {
    setCompletedSteps(prev => [...prev, 'review']);
    setIsCompleted(true);
  };

  const handleBackToPersonal = () => {
    setCurrentStep('personal');
  };

  const handleBackToIdentity = () => {
    setCurrentStep('identity');
  };

  const handleBackToAddress = () => {
    setCurrentStep('address');
  };

  if (isCompleted) {
    return (
      <Container>
        <section className="flex flex-col px-6 md:px-8 gap-8 py-8 md:py-16 items-center min-h-screen justify-center">
          <div className="card bg-base-300 p-8 md:p-12 text-center max-w-2xl">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-4">KYC Verification Complete!</h1>
            <p className="text-lg mb-6">
              Thank you for completing your KYC verification. Your information has been submitted successfully and is being reviewed.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              You will receive an email notification once your verification is approved. This process typically takes 1-3 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="btn btn-primary"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentStep('personal');
                  setCompletedSteps([]);
                }}
                className="btn btn-outline"
              >
                Start New Verification
              </button>
            </div>
          </div>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="flex flex-col px-6 md:px-8 gap-8 py-8 md:py-16">
        <div className="page-title flex flex-col gap-4 items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold">KYC Verification</h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Complete your Know Your Customer (KYC) verification to access all VicShield features and ensure compliance with regulations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <ProgressIndicator currentStep={currentStep} completedSteps={completedSteps} />
          
          {currentStep === 'personal' && (
            <PersonalInfo
              initialData={kycData.personalInfo}
              onNext={handlePersonalInfoNext}
            />
          )}
          
          {currentStep === 'identity' && (
            <IdentityVerification
              initialData={kycData.identityInfo}
              onNext={handleIdentityNext}
              onBack={handleBackToPersonal}
            />
          )}
          
          {currentStep === 'address' && (
            <AddressVerification
              initialData={kycData.addressInfo}
              onNext={handleAddressNext}
              onBack={handleBackToIdentity}
            />
          )}
          
          {currentStep === 'review' && (
            <ReviewSubmit
              kycData={kycData}
              onBack={handleBackToAddress}
              onSubmit={handleFinalSubmit}
            />
          )}
        </div>
      </section>
    </Container>
  );
};

export default KYCPage;