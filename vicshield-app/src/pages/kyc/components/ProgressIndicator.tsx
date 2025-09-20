import { KYCStep } from '../types';

interface ProgressIndicatorProps {
  currentStep: KYCStep;
  completedSteps: KYCStep[];
}

const steps = [
  { key: 'personal' as KYCStep, label: 'Personal Info' },
  { key: 'identity' as KYCStep, label: 'Identity' },
  { key: 'address' as KYCStep, label: 'Address' },
  { key: 'review' as KYCStep, label: 'Review' },
];

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  completedSteps,
}) => {
  const getStepStatus = (stepKey: KYCStep) => {
    if (completedSteps.includes(stepKey)) return 'completed';
    if (stepKey === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  getStepStatus(step.key) === 'completed'
                    ? 'bg-green-500 text-white'
                    : getStepStatus(step.key) === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {getStepStatus(step.key) === 'completed' ? '✓' : index + 1}
              </div>
              <span className="text-xs mt-2 text-center">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  completedSteps.includes(step.key) ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;