import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import DataDisplay from "~/components/DataDisplay";
import UploadFile from "~/components/UploadFile";
import useUser from "~/hooks/useUser";

const KYC = () => {
  const [country, setCountry] = useState<string>("");
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [file, setFile] = useState("");
  const account = useDynamicContext();
  const [kycData, setKycData] = useState<any>();
  const user = useUser();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.country.is");
        const data = await res.json();
        setCountry(data.country || "Unknown");
      } catch {
        setCountry("Unknown");
      } finally {
        setLoadingCountry(false);
      }
    })();
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `${import.meta.env.VITE_VICSHIELD_API_URL}/users/kyc`,
        {
          address: account.primaryWallet?.address,
          fileHash: file,
        }
      );
      console.log("KYC response:", res.data);
      setKycData(res.data);
      return res.data;
    },
  });

  return (
    <div className="card bg-base-300 p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Upload Identity Documents</h3>
          <p className="text-base-content/70">
            Please upload clear photos of the front and back of your Vietnamese
            ID card
          </p>
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
          <span>
            {loadingCountry
              ? "Detecting your location..."
              : `Detected country: ${country}`}
          </span>
        </div>
        <UploadFile onChange={setFile} />
        {kycData ? (
          <>
            <DataDisplay
              data={{
                name: kycData.name,
                ID: kycData.idNumber,
                "Date of Birth": kycData.dateOfBirth,
                country: kycData.country,
                "Confidence level": kycData.confidence,
                "Document Valid": kycData.isValid ? "Yes" : "No",
              }}
            />
            {kycData.isValid ? (
              <button className="btn btn-primary" onClick={() => user.refetch}>
                Confirm
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => location.reload()}
              >
                Retry
              </button>
            )}
          </>
        ) : (
          <button
            className="btn btn-primary"
            disabled={!file || mutation.isPending}
            onClick={() => mutation.mutateAsync()}
          >
            {mutation.isPending
              ? "Verifying by AI.."
              : "Submit for Verification"}
            {mutation.isPending && (
              <span className="loading loading-spinner loading-sm ml-2"></span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default KYC;
