import { useState } from "react";
import Container from "~/components/UI/Container";
import UploadStep from "./components/UploadStep";
import VerifyStep from "./components/VerifyStep";
import SuccessStep from "./components/SuccessStep";

export interface KYCData {
  frontImage: File | null;
  backImage: File | null;
  country: string;
  extractedInfo: {
    name: string;
    idNumber: string;
    dateOfBirth: string;
    placeOfBirth: string;
    isValid: boolean;
  } | null;
}

const KYCPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [kycData, setKycData] = useState<KYCData>({
    frontImage: null,
    backImage: null,
    country: "",
    extractedInfo: null,
  });

  const handleStepComplete = (stepData: Partial<KYCData>) => {
    setKycData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadStep onComplete={handleStepComplete} />;
      case 2:
        return <VerifyStep kycData={kycData} onComplete={handleStepComplete} />;
      case 3:
        return <SuccessStep />;
      default:
        return <UploadStep onComplete={handleStepComplete} />;
    }
  };

  return (
    <Container>
      <section className="flex flex-col px-6 md:px-8 gap-8 md:gap-16 py-8 md:py-16">
        <div className="page-title flex flex-col gap-4 md:gap-6 items-center text-center">
          <p>Identity Verification</p>
          <span>Complete your KYC process to continue with contract signing</span>
        </div>

        {/* Progress indicator */}
        <div className="w-full max-w-lg mx-auto">
          <ul className="steps steps-horizontal w-full">
            <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Upload Documents</li>
            <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Verify Identity</li>
            <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>Complete</li>
          </ul>
        </div>

        {/* Step content */}
        <div className="w-full max-w-2xl mx-auto">
          {renderStep()}
        </div>
      </section>
    </Container>
  );
};

export default KYCPage;