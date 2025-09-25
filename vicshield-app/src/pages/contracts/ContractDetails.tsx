import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Content from "~/components/Content";
import { useModelLoading } from "~/components/loading/ModelLoading";
import PDFViewer from "~/components/PDFViewer";
import useContract from "~/hooks/useContract";
import SignContract from "./SignContract";

export const Score = ({ value }: { value: number }) => {
  if (value > 80) return <div className="badge badge-success">{value}/100</div>;
  if (value > 50)
    return <div className="badge  badge-warning">{value}/100</div>;
  return <div className="badge  badge-danger">{value}/100</div>;
};
const ContractDetails = () => {
  const { hash } = useParams();
  const contract = useContract(hash!);
  const { open, close } = useModelLoading();

  useEffect(() => {
    open("Thinking by VicShieldAI...");
  }, [open]);

  useEffect(() => {
    if (contract.data?.aiContent) {
      setTimeout(() => {
        close();
      }, 2000);
    }
  }, [close, contract.data?.aiContent]);

  return (
    <div className="min-h-screen">
      {contract?.data?.aiContent && (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 mb-4 mt-4">
              <h1 className="text-2xl font-bold">{contract?.data?.title}</h1>
              <Score value={contract?.data?.score || 0} />
            </div>
            <SignContract hash={contract?.data?.hash} />
          </div>
          <p className="text mb-4">{contract?.data?.description}</p>
          <Content value={contract?.data?.aiContent || ""} />
          <PDFViewer hash={contract?.data?.hash} />
        </>
      )}
    </div>
  );
};

export default ContractDetails;
