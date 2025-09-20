import { useState, useEffect } from "react";
import type { KYCData } from "../Page";

interface UploadStepProps {
  onComplete: (data: Partial<KYCData>) => void;
}

const UploadStep = ({ onComplete }: UploadStepProps) => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [country, setCountry] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingCountry, setLoadingCountry] = useState(true);

  // Fetch user's country on component mount
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        // Using ipapi.co for country detection
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setCountry(data.country_name || "Unknown");
      } catch (error) {
        console.error('Error fetching country:', error);
        setCountry("Unknown");
      } finally {
        setLoadingCountry(false);
      }
    };

    fetchCountry();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      if (side === 'front') {
        setFrontImage(file);
      } else {
        setBackImage(file);
      }
    }
  };

  const handleVerify = async () => {
    if (!frontImage || !backImage) {
      alert("Please upload both front and back images");
      return;
    }

    setLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    onComplete({
      frontImage,
      backImage,
      country,
    });

    setLoading(false);
  };

  const canProceed = frontImage && backImage && !loading;

  return (
    <div className="card bg-base-300 p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Upload Identity Documents</h3>
          <p className="text-base-content/70">
            Please upload clear photos of the front and back of your Vietnamese ID card
          </p>
        </div>

        {/* Country Display */}
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>
            {loadingCountry ? "Detecting your location..." : `Detected country: ${country}`}
          </span>
        </div>

        {/* Upload Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Front Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="label">
              <span className="label-text font-medium">Front of ID Card</span>
            </label>
            <div className="border-2 border-dashed border-base-content/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              {frontImage ? (
                <div className="flex flex-col gap-2">
                  <img 
                    src={URL.createObjectURL(frontImage)} 
                    alt="Front of ID" 
                    className="max-h-32 mx-auto rounded"
                  />
                  <p className="text-sm text-success">{frontImage.name}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <svg className="w-12 h-12 mx-auto text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm text-base-content/70">Click to upload front image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="opacity-0 absolute inset-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, 'front')}
              />
            </div>
          </div>

          {/* Back Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="label">
              <span className="label-text font-medium">Back of ID Card</span>
            </label>
            <div className="border-2 border-dashed border-base-content/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              {backImage ? (
                <div className="flex flex-col gap-2">
                  <img 
                    src={URL.createObjectURL(backImage)} 
                    alt="Back of ID" 
                    className="max-h-32 mx-auto rounded"
                  />
                  <p className="text-sm text-success">{backImage.name}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <svg className="w-12 h-12 mx-auto text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm text-base-content/70">Click to upload back image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="opacity-0 absolute inset-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, 'back')}
              />
            </div>
          </div>
        </div>

        {/* Verify Button */}
        <div className="flex justify-center pt-4">
          <button
            className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
            onClick={handleVerify}
            disabled={!canProceed}
          >
            {loading ? 'Processing...' : 'Verify Documents'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadStep;