import { useParams } from "react-router-dom";
import Content from "~/components/Content";
import PDFViewer from "~/components/PDFViewer";
import useContract from "~/hooks/useContract";

const Score = ({ value }: { value: number }) => {
  if (value > 75) return <div className="badge badge-success">{value}/100</div>;
  if (value > 50)
    return <div className="badge  badge-warning">{value}/100</div>;
  return <div className="badge  badge-danger">{value}/100</div>;
};
const ContractDetails = () => {
  const { hash } = useParams();
  const contract = useContract(hash!);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 mt-4">
        <h1 className="text-2xl font-bold">
          {contract?.data?.title || "Chi tiết hợp đồng"}
        </h1>
        <Score value={contract?.data?.score || 0} />
      </div>
      <p className="text mb-4">{contract?.data?.description}</p>
      <Content value={contract?.data?.aiContent || ""} />
      <PDFViewer hash={contract?.data?.hash} />
    </div>
  );
};

export default ContractDetails;
