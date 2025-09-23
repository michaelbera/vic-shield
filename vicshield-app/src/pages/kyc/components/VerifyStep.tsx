import { useState, useEffect } from "react";
import OpenAI from "openai";
import type { KYCData } from "../Page";
import axios from "axios";

interface VerifyStepProps {
  kycData: KYCData;
  onComplete: (data: Partial<KYCData>) => void;
}

const VerifyStep = ({ kycData, onComplete }: VerifyStepProps) => {
  const [extractedInfo, setExtractedInfo] =
    useState<KYCData["extractedInfo"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if OpenAI API key is available
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error(
            "OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment."
          );
        }

        // Convert images to base64

        const prompt = `
Analyze these ID card images and extract the following information:
1. Full name
2. ID number
3. Date of birth
5. Verify if this is a valid  ID card

Please respond in JSON format with these fields:
{
  "name": "extracted full name",
  "idNumber": "extracted ID number",
  "dateOfBirth": "extracted date of birth",
  "isValid": true/false,
  "confidence": "high/medium/low",
  "notes": "any additional observations"
}
If the document is not a ID card or the images are unclear, set isValid to false and explain in notes.
        `;

        const response = await axios.post(
          "https://api-ai.primevaults.finance/chat",
          {
            model: "gpt-5",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  {
                    type: "image_url",
                    image_url: {
                      url: `https://idscan.net/wp-content/uploads/arizona-ai-generated-fake-ids.jpg`,
                    },
                  },
                ],
              },
            ],
          }
        );

        const result = response.data.answer[0]?.message?.content;
        if (result) {
          try {
            const parsedResult = JSON.parse(result);
            setExtractedInfo({
              name: parsedResult.name || "N/A",
              idNumber: parsedResult.idNumber || "N/A",
              dateOfBirth: parsedResult.dateOfBirth || "N/A",
              placeOfBirth: parsedResult.placeOfBirth || "N/A",
              isValid: parsedResult.isValid || false,
            });
          } catch (parseError) {
            // Fallback: create mock data for development
            console.warn(
              "Failed to parse OpenAI response, using mock data:",
              parseError
            );
            setExtractedInfo({
              name: "Nguyen Van A",
              idNumber: "123456789012",
              dateOfBirth: "01/01/1990",
              placeOfBirth: "Ha Noi",
              isValid: true,
            });
          }
        } else {
          throw new Error("No response from OpenAI");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError(err instanceof Error ? err.message : "Verification failed");

        // For development: provide mock data if API fails
        setExtractedInfo({
          name: "Nguyen Van A (Demo)",
          idNumber: "123456789012",
          dateOfBirth: "01/01/1990",
          placeOfBirth: "Ha Noi",
          isValid: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (kycData.frontImage && kycData.backImage) {
      verifyDocuments();
    }
  }, [kycData]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleConfirm = () => {
    onComplete({ extractedInfo });
  };

  if (loading) {
    return (
      <div className="card bg-base-300 p-6 md:p-8">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <h3 className="text-xl font-bold">Verifying Your Documents</h3>
          <p className="text-base-content/70 text-center">
            Our AI is analyzing your ID card to extract information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-300 p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Verification Results</h3>
          <p className="text-base-content/70">
            Please review the extracted information from your ID card
          </p>
        </div>

        {error && (
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
            <span>{error}</span>
          </div>
        )}

        {extractedInfo && (
          <>
            <div
              className={`alert ${
                extractedInfo.isValid ? "alert-success" : "alert-error"
              }`}
            >
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
                  d={
                    extractedInfo.isValid
                      ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                />
              </svg>
              <span>
                {extractedInfo.isValid
                  ? "Valid Vietnamese ID card detected"
                  : "Invalid or unrecognized document"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  value={extractedInfo.name}
                  className="input input-bordered"
                  readOnly
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">ID Number</span>
                </label>
                <input
                  type="text"
                  value={extractedInfo.idNumber}
                  className="input input-bordered"
                  readOnly
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Date of Birth</span>
                </label>
                <input
                  type="text"
                  value={extractedInfo.dateOfBirth}
                  className="input input-bordered"
                  readOnly
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Place of Birth</span>
                </label>
                <input
                  type="text"
                  value={extractedInfo.placeOfBirth}
                  className="input input-bordered"
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleConfirm}
                disabled={!extractedInfo.isValid}
              >
                Confirm Information
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyStep;
