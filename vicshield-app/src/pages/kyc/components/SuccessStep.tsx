import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "~/store/authStore";

const SuccessStep = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { setKycStatus } = useAuthStore();

  useEffect(() => {
    // Simulate processing time with loading animation
    const timer = setTimeout(() => {
      setShowSuccess(true);
      
      // Update KYC status in store
      setKycStatus(true);
    }, 3000); // 3 seconds of loading

    return () => clearTimeout(timer);
  }, [setKycStatus]);

  // Auto-redirect to contracts after showing success for 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const redirectTimer = setTimeout(() => {
        navigate('/contracts');
      }, 5000); // 5 seconds after success

      return () => clearTimeout(redirectTimer);
    }
  }, [showSuccess, navigate]);

  const handleGoToContracts = () => {
    navigate("/contracts");
  };

  if (!showSuccess) {
    return (
      <div className="card bg-base-300 p-6 md:p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Spinning animation */}
            <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Processing Verification</h3>
            <p className="text-base-content/70">
              We're finalizing your identity verification...
            </p>
          </div>

          {/* Progress dots animation */}
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-300 p-6 md:p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Success animation */}
        <div className="relative">
          <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center animate-pulse">
            <svg 
              className="w-12 h-12 text-success-content" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          {/* Success ring animation */}
          <div className="absolute inset-0 w-24 h-24 border-4 border-success rounded-full animate-ping opacity-30"></div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-success mb-2">Verification Complete!</h3>
          <p className="text-base-content/70 mb-4">
            Your identity has been successfully verified. You can now proceed with contract signing.
          </p>

          <div className="stats stats-horizontal bg-base-200 shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-title">Status</div>
              <div className="stat-value text-success">Verified</div>
              <div className="stat-desc">Identity confirmed</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="stat-title">Security</div>
              <div className="stat-value text-primary">100%</div>
              <div className="stat-desc">Documents secured</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            className="btn btn-primary btn-lg flex-1"
            onClick={handleGoToContracts}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Go to Contracts
          </button>
          
          <button
            className="btn btn-outline btn-lg flex-1"
            onClick={() => navigate("/")}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-base-content/50">
            Your verification data is encrypted and stored securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;