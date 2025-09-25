import { useNavigate } from "react-router-dom";
import ContractsList from "./ListContract";
import UploadFile from "~/components/UploadFile";

const Contracts = () => {
  const navigate = useNavigate();

  const onUpload = (hash: string) => {
    navigate(`/contracts/${hash}`);
  };

  return (
    <div className="min-h-screen flex flex-col mt-8">
      <UploadFile onChange={onUpload} text="Upload Contract Document" />
      <ContractsList />
    </div>
  );
};

export default Contracts;
