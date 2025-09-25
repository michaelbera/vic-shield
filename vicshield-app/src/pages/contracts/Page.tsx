import { useNavigate } from "react-router-dom";
import ContractsList from "./ListContract";
import UploadFile from "~/components/UploadFile";

const Contracts = () => {
  const navigate = useNavigate();

  const onUpload = (hash: string) => {
    navigate(`/contracts/${hash}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <UploadFile onChange={onUpload} />
      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate("/contracts/new")}
      >
        New Contract
      </button>

      <ContractsList />
    </div>
  );
};

export default Contracts;
