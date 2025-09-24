import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadFile from "./UploadContract";
import ContractsList from "./ListContract";

const Contracts = () => {
  const navigate = useNavigate();

  useEffect(() => {}, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <UploadFile />

      <ContractsList />
    </div>
  );
};

export default Contracts;
