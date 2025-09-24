import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadFile from "./UploadContract";

const Contracts = () => {
  const navigate = useNavigate();

  useEffect(() => {}, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <UploadFile />
    </div>
  );
};

export default Contracts;
